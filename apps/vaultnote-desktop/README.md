# VaultNote Desktop

Desktop application scaffold for the VaultNote project.

## Stack

- Tauri 2
- React + TypeScript + Vite
- Markdown preview pipeline (marked + DOMPurify)

## Run

1. `pnpm install`
2. `pnpm tauri dev`

Or from repository root:

1. `python3 tools/control.py --tauri --skip-system-deps --target apps/vaultnote-desktop`
2. `python3 tools/control.py --start`

## Current Scope

This scaffold implements the documented shell baseline:

- top bar, navigation rail, explorer panel, editor panel, bottom bar
- tabbed editing with dirty state
- source/preview toggle
- YAML frontmatter parsing warnings
- command palette foundation (`Ctrl+P` / `Ctrl+O`)

