<!-- AUTO-GENERATED:backlink START -->
[← Back](index.md)
<!-- AUTO-GENERATED:backlink END -->
# VaultNote Documentation

This `docs/` folder contains the complete product and implementation documentation for VaultNote.
The project is a vault-based knowledge and task workspace that combines Markdown editing, YAML metadata, file navigation, and fast command-driven workflows.

## Documentation Map

- `docs/product/vision-and-scope.md`
  - Product vision, target users, MVP boundaries, and success criteria.
- `docs/product/functional-requirements.md`
  - Full feature requirements derived from the project spec.
- `docs/architecture/system-overview.md`
  - High-level architecture, module boundaries, and runtime data flow.
- `docs/architecture/vault-data-model.md`
  - Vault folder conventions, JSON models, and frontmatter structure.
- `docs/architecture/ui-shell-spec.md`
  - Complete app shell behavior (top bar, rail, explorer, editor, bottom bar).
- `docs/features/file-explorer.md`
  - Explorer behavior, file operations, context menus, and drag-and-drop rules.
- `docs/features/markdown-editor.md`
  - Markdown editor specification (code/preview, syntax, frontmatter, math, commands).
- `docs/features/navigation-and-shortcuts.md`
  - Navigation model and keyboard shortcuts.
- `docs/implementation/mvp-implementation-plan.md`
  - Build sequence from foundation to MVP completion.
- `docs/implementation/roadmap.md`
  - Milestones after MVP and expansion strategy.
- `docs/implementation/testing-and-quality.md`
  - Testing strategy, quality gates, and release readiness.

## Product Summary

VaultNote is designed around one core rule: load and manage content only inside an active vault.
A vault contains Markdown files as source content, JSON files for app and vault state, and assets such as images.

Core capabilities:

1. Multi-vault workspace with a bottom-bar vault switcher.
2. Left-side navigation rail (Dashboard, Editor, Graph, and future modules).
3. Tree-based file explorer with common file management actions.
4. Tabbed Markdown editor with source/preview mode and metadata-aware behavior.
5. Command system for keyboard-driven workflows and future plugins.

## How To Use This Documentation

1. Start with `docs/product/vision-and-scope.md`.
2. Implement core behavior using `docs/architecture/*`.
3. Build features with `docs/features/*` as source of truth.
4. Track delivery with `docs/implementation/mvp-implementation-plan.md` and `docs/implementation/roadmap.md`.

