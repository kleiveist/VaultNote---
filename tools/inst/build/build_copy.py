#!/usr/bin/env python3
"""
Copy generated build artifacts into configured destination directories.

control.py entry:
  python3 tools/control.py --build --copy

Sources (resolved under the desktop app directory):
  - src-tauri/target/release/bundle/appimage
  - src-tauri/target/release/bundle/deb
  - src-tauri/target/release/bundle/rpm
  - src-tauri/target/<WIN_COPY_TARGET>/release/bundle/portable

Configuration:
  - BUNDLE_COPY_DESTS      Path-separated list of destination roots.
                           If unset, defaults to: <repo>/dist/bundles
  - WIN_COPY_TARGET        Windows target triple used for portable zip source.
                           Defaults to WIN_LINUX_TARGET or x86_64-pc-windows-msvc.
  - APPIMAGE_OUTPUT_NAME   Optional output filename override for AppImage files.
"""

from __future__ import annotations

import os
import shutil
import time
from pathlib import Path

from console import action, bundle, err, info, kv, ok, section, warn
from project_paths import app_dir_hint, resolve_app_dir


def _repo_root_from_tools_inst_build() -> Path:
    # tools/inst/build/build_copy.py -> repo root is parents[3].
    return Path(__file__).resolve().parents[3]


def _collect_files(source_dir: Path, patterns: tuple[str, ...]) -> list[Path]:
    if not source_dir.exists():
        return []
    files: list[Path] = []
    seen: set[Path] = set()
    for pattern in patterns:
        for path in sorted(source_dir.glob(pattern)):
            if not path.is_file() or path in seen:
                continue
            files.append(path)
            seen.add(path)
    return files


def _ensure_dir(path: Path, dry_run: bool) -> bool:
    action(f"mkdir -p {path}")
    if dry_run:
        return True
    try:
        path.mkdir(parents=True, exist_ok=True)
    except OSError as exc:
        err(f"Could not create directory: {path} ({exc})")
        return False
    return True


def _copy_file(src: Path, dst: Path, dry_run: bool) -> bool:
    exists_already = dst.exists()
    op = "overwrite" if exists_already else "copy"
    action(f"{op} {src} -> {dst}")
    if dry_run:
        return True
    try:
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
    except OSError as exc:
        err(f"Copy failed: {src} -> {dst} ({exc})")
        return False
    return True


def _format_duration(seconds: float) -> str:
    return f"{seconds:.2f}s"


def _destination_file_path(kind: str, source_dir: Path, src: Path, destination_dir: Path) -> Path:
    if kind == "appimage":
        output_name = os.environ.get("APPIMAGE_OUTPUT_NAME", "").strip()
        if output_name:
            if "." not in output_name:
                output_name = f"{output_name}.AppImage"
            return destination_dir / output_name
    rel = src.relative_to(source_dir)
    return destination_dir / rel


def _resolve_destination_roots(repo_root: Path) -> tuple[Path, ...]:
    raw = os.environ.get("BUNDLE_COPY_DESTS", "").strip()
    if not raw:
        return ((repo_root / "dist" / "bundles").resolve(),)

    roots: list[Path] = []
    for item in raw.split(os.pathsep):
        candidate = item.strip()
        if not candidate:
            continue
        path = Path(candidate).expanduser()
        if not path.is_absolute():
            path = (repo_root / path).resolve()
        else:
            path = path.resolve()
        if path not in roots:
            roots.append(path)
    return tuple(roots)


def run_install(dry_run: bool = False) -> int:
    overall_start = time.perf_counter()

    repo_root = _repo_root_from_tools_inst_build()
    app_dir, source = resolve_app_dir(repo_root)
    using_legacy = source.startswith("legacy:")
    if not app_dir.exists():
        raise SystemExit(f"Desktop app dir not found: {app_dir}. {app_dir_hint()}")

    win_target = os.environ.get("WIN_COPY_TARGET") or os.environ.get(
        "WIN_LINUX_TARGET", "x86_64-pc-windows-msvc"
    )

    linux_bundle_dir = app_dir / "src-tauri" / "target" / "release" / "bundle"
    win_portable_dir = (
        app_dir / "src-tauri" / "target" / win_target / "release" / "bundle" / "portable"
    )

    source_specs: dict[str, tuple[Path, tuple[str, ...]]] = {
        "appimage": (linux_bundle_dir / "appimage", ("*.AppImage", "*.appimage")),
        "deb": (linux_bundle_dir / "deb", ("*.deb",)),
        "rpm": (linux_bundle_dir / "rpm", ("*.rpm",)),
        "portable": (win_portable_dir, ("*.zip",)),
    }
    destination_roots = _resolve_destination_roots(repo_root)

    section("Run Context")
    info(f"Repo root: {repo_root}")
    info(f"App dir:   {app_dir}")
    if using_legacy:
        warn("Using legacy path: consider migrating to /apps/vaultnote-desktop")
    kv("WIN_COPY_TARGET", win_target)
    kv("BUNDLE_COPY_DESTS", os.environ.get("BUNDLE_COPY_DESTS", "<repo>/dist/bundles"))
    if dry_run:
        warn("Dry run mode enabled: no files or directories will be written.")

    section("Source Artifacts")
    artifacts: dict[str, list[Path]] = {}
    source_file_count = 0
    for kind, (source_dir, patterns) in source_specs.items():
        kv(kind, str(source_dir))
        files = _collect_files(source_dir, patterns)
        artifacts[kind] = files
        if not files:
            warn(f"No files found: {source_dir}")
            continue
        for file_path in files:
            bundle(f"{kind}: {file_path}")
            source_file_count += 1

    if source_file_count == 0:
        err("No source artifacts found. Build first, then run --build --copy.")
        return 1

    section("Copy Targets")
    for destination_root in destination_roots:
        info(str(destination_root))

    copied_files = 0
    failed_steps = 0

    for destination_root in destination_roots:
        section(f"Copy -> {destination_root}")
        for kind, (source_dir, _) in source_specs.items():
            destination_dir = destination_root / kind
            if not _ensure_dir(destination_dir, dry_run=dry_run):
                failed_steps += 1
                continue

            files = artifacts[kind]
            if not files:
                warn(f"{kind}: nothing to copy.")
                continue

            for src in files:
                dst = _destination_file_path(kind, source_dir, src, destination_dir)
                if _copy_file(src, dst, dry_run=dry_run):
                    copied_files += 1
                    if not dry_run:
                        bundle(f"{kind}: {dst}")
                else:
                    failed_steps += 1

    total_time = time.perf_counter() - overall_start
    section("Result")
    kv("Source files", str(source_file_count))
    kv("Copy operations", str(copied_files))
    if failed_steps:
        kv("Failed steps", str(failed_steps))
    kv("Total time", _format_duration(total_time))

    if failed_steps:
        err("Bundle copy completed with errors.")
        return 1

    if dry_run:
        ok("Dry run completed.")
    else:
        ok("Bundle copy completed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(run_install(False))
