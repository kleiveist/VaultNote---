<!-- AUTO-GENERATED:backlink START -->
[← Back](architecture.md)
<!-- AUTO-GENERATED:backlink END -->
# UI Shell Specification

## Layout

The shell is split into:

1. Top bar.
2. Left navigation rail.
3. Explorer panel.
4. Editor panel.
5. Bottom bar.

## Top Bar

### Global Icons (left)

- Sidebar collapse/expand.
- Mode icons (files, search, bookmarks, etc.).
- Active mode must be highlighted.
- Desktop tooltips on hover.

### Explorer Toolbar (inside explorer header)

Actions include:

- Edit/Pencil.
- New item (+).
- Sort or up/down ordering control.
- View mode switch.
- Close explorer/action cancel.

## Navigation Rail

Minimum modules:

- Dashboard.
- Editor.
- Graph.

Behavior:

- Click icon -> activate module.
- Active module gets clear visual state.
- Optional context menu on right click/long press.

## Explorer Panel

- Tree list with folder chevrons.
- Selected item state.
- Fast keyboard and context-menu access.

## Editor Panel

### Tabs Row

- One tab per open file.
- Active and dirty states.
- Close action per tab.

### Editor Header

- Left: back/forward buttons.
- Right: code/preview mode switch.
- Optional future split mode control.

## Bottom Bar

### Left: Vault Switcher

- Drop-up list of available vaults.
- Selection triggers vault context reload.

### Right: Help and Settings

- Open as modal/popup overlays.
- Close with button, outside click, or `Esc`.

## UX State Rules

1. Active states are always visible.
2. Empty states are explicit and actionable.
3. Last vault and tab context are restorable.

