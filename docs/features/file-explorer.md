<!-- AUTO-GENERATED:backlink START -->
[← Back](features.md)
<!-- AUTO-GENERATED:backlink END -->
# File Explorer Specification

## Scope

The explorer is the primary filesystem interface inside the active vault.
It must expose the vault tree while preventing actions outside vault boundaries.

## Core Behavior

1. Display folders and files in a hierarchical tree.
2. Expand/collapse folders with chevron controls.
3. Keep current selection visible and highlighted.
4. Open files in editor on activation.

## Supported Operations

Per item, support:

- Open.
- Open with...
- Reveal in file path.
- Rename.
- Copy.
- Cut.
- Paste.
- Move.
- Delete.

## Context Menu Contract

Required menu entries:

- Open
- Open with...
- Reveal in file path
- Rename
- Copy
- Cut
- Paste
- Move...
- Delete

Disable invalid actions contextually (example: paste disabled when clipboard is empty).

## Drag-and-Drop Rules

1. File onto folder -> move by default.
2. Modifier key can force copy.
3. Invalid targets show rejection feedback.
4. On drop completion, refresh tree and maintain logical selection.

## Keyboard Behavior

- `Enter`: open file / toggle folder.
- `F2`: rename selected item.
- `Delete`: delete selected item (with confirmation).
- Arrow keys: navigate tree.

## Error Handling

- Failed operation shows inline toast/dialog with cause.
- Partial operation failures should not corrupt tree state.
- Any path resolution failure must be blocked if target escapes vault root.

