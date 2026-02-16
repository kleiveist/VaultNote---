<!-- AUTO-GENERATED:backlink START -->
[← Back](features.md)
<!-- AUTO-GENERATED:backlink END -->
# Navigation and Shortcuts

## Navigation Model

The app should support both mouse-first and keyboard-first navigation.

## Primary Navigation Areas

1. Navigation rail: module-level switching (Dashboard, Editor, Graph).
2. Explorer: file/folder traversal and operations.
3. Editor tabs: switch between open documents.
4. Command palette: direct jump to files and commands.

## Top-Level Shortcuts (Recommended Defaults)

| Action | Shortcut |
|---|---|
| Open command palette / quick open | `Ctrl+P` (or `Ctrl+O`) |
| Save file | `Ctrl+S` |
| Undo | `Ctrl+Z` |
| Redo | `Ctrl+Y` or `Ctrl+Shift+Z` |
| Bold selection | `Ctrl+B` |
| Italic selection | `Ctrl+I` |
| Rename in explorer | `F2` |
| Delete in explorer | `Delete` |

## Command Palette Requirements

- Fuzzy search across files and commands.
- Keyboard-only execution path (`arrow`, `enter`, `esc`).
- Extensible command registration for future plugins.

## UX Rules

1. Focus must be visible at all times.
2. Shortcut conflicts should be configurable.
3. Shortcut mapping should be serializable in settings.

