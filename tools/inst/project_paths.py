#!/usr/bin/env python3
"""
Shared project path helpers for tooling scripts.

The desktop app directory is resolved in this priority:
1) Explicit argument passed by caller.
2) VAULTNOTE_APP_DIR environment variable.
3) APP_DIR environment variable.
4) Default: apps/vaultnote-desktop
5) Legacy fallbacks:
   - apps/fmd-desktop
   - tools/apps/fmd-desktop
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Iterable

DEFAULT_APP_DIR = Path("apps") / "vaultnote-desktop"
LEGACY_APP_DIRS = (
    Path("apps") / "fmd-desktop",
    Path("tools") / "apps" / "fmd-desktop",
)
APP_DIR_ENV_KEYS = ("VAULTNOTE_APP_DIR", "APP_DIR")


def _resolve_under_repo(repo_root: Path, candidate: str | Path) -> Path:
    path = Path(candidate).expanduser()
    if path.is_absolute():
        return path.resolve()
    return (repo_root / path).resolve()


def _candidate_pairs(explicit_app_dir: str | Path | None) -> Iterable[tuple[str | Path, str]]:
    if explicit_app_dir:
        yield explicit_app_dir, "arg"
    for env_key in APP_DIR_ENV_KEYS:
        raw = os.environ.get(env_key, "").strip()
        if raw:
            yield raw, f"env:{env_key}"
    yield DEFAULT_APP_DIR, "default"
    for legacy in LEGACY_APP_DIRS:
        yield legacy, f"legacy:{legacy.as_posix()}"


def resolve_app_dir(
    repo_root: Path,
    *,
    explicit_app_dir: str | Path | None = None,
    require_exists: bool = True,
) -> tuple[Path, str]:
    """
    Resolve the desktop app directory and indicate where the value came from.

    Returns:
        tuple[path, source]
        source in {"arg", "env:...", "default", "legacy:..."}
    """
    first_candidate: tuple[Path, str] | None = None
    seen: set[Path] = set()

    for candidate, source in _candidate_pairs(explicit_app_dir):
        resolved = _resolve_under_repo(repo_root, candidate)
        if resolved in seen:
            continue
        seen.add(resolved)
        if first_candidate is None:
            first_candidate = (resolved, source)
        if not require_exists or resolved.exists():
            return resolved, source

    if first_candidate is None:
        # This branch should never happen but keeps type-checkers happy.
        fallback = (repo_root / DEFAULT_APP_DIR).resolve()
        return fallback, "default"
    return first_candidate


def app_dir_hint() -> str:
    return (
        "Set VAULTNOTE_APP_DIR (or APP_DIR) to override "
        f"(default: {DEFAULT_APP_DIR.as_posix()})."
    )

