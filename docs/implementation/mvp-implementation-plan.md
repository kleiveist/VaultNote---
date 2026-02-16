<!-- AUTO-GENERATED:backlink START -->
[← Back](implementation.md)
<!-- AUTO-GENERATED:backlink END -->
# MVP Implementation Plan

## Delivery Strategy

Build in vertical slices so each phase produces a testable app increment.

## Phase 1: Foundation

Goals:

- Create app shell layout regions.
- Implement vault activation and path guarding.
- Add baseline settings persistence.

Deliverables:

- `VaultService` skeleton.
- Initial `settings.json` and vault context load.
- Empty-state UI for explorer/editor.

## Phase 2: Explorer Core

Goals:

- Render file tree from active vault.
- Enable open, rename, copy/move/delete operations.

Deliverables:

- Tree model + folder expand/collapse state.
- Context menu actions with validation.
- Drag-and-drop move/copy behavior.

## Phase 3: Editor Core

Goals:

- Implement tabbed editor with dirty-state.
- Add save, undo/redo, and history navigation.

Deliverables:

- Multi-tab management.
- Source mode editing pipeline.
- Basic command bindings.

## Phase 4: Markdown and Preview

Goals:

- Add Markdown render pipeline.
- Add frontmatter parsing and warning states.
- Add optional math rendering.

Deliverables:

- Preview mode toggle.
- Frontmatter hidden by default in preview.
- Safe fallback on parse/render failures.

## Phase 5: Command System and Polishing

Goals:

- Add command palette and extensible command registry.
- Improve UX states and persistence restoration.

Deliverables:

- `Ctrl+P` quick open.
- Restored last vault and open tabs.
- Help/settings popups in bottom bar.

## MVP Acceptance Checklist

1. User can switch vaults and see only vault-local files.
2. User can perform core explorer operations safely.
3. User can edit Markdown and save reliably.
4. User can toggle preview and render main Markdown syntax.
5. User can use command palette for fast navigation.

