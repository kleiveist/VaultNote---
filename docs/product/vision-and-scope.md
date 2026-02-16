<!-- AUTO-GENERATED:backlink START -->
[← Back](product.md)
<!-- AUTO-GENERATED:backlink END -->
# Vision and Scope

## Vision

VaultNote is a local-first knowledge workspace that combines structured metadata and rich Markdown editing in a fast desktop app.
The product should feel like a practical mix of note editor, project workspace, and developer tool.

## Problem Statement

Users need to manage project knowledge with:

- Human-readable content (Markdown).
- Machine-friendly metadata (YAML frontmatter + JSON settings/indexes).
- Reliable file-level operations directly in a vault tree.
- Fast navigation and keyboard-driven command execution.

## Target Users

- Students organizing course/exam/project notes.
- Technical users documenting tasks and implementation plans.
- Teams that prefer repository-friendly text formats over database-only tools.

## Product Principles

1. Vault-first boundaries: the app only loads content inside the selected vault path.
2. Markdown as source of truth: content stays portable and readable.
3. Metadata-friendly workflow: YAML frontmatter and tags support filtering/sorting.
4. Progressive complexity: strong MVP first, then graphing/plugins/advanced layout.
5. Robust UX states: active, empty, and error states must always be explicit.

## MVP Scope (In)

- Vault selection and persistence.
- 3-pane shell: navigation rail, explorer, editor.
- Tree explorer with open/copy/move/rename/delete/path/open-with operations.
- Tabbed Markdown editor with code and preview modes.
- YAML frontmatter support with non-blocking validation warnings.
- Markdown rendering with code blocks, checkboxes, links, images, and horizontal rules.
- Optional math rendering in preview (`$...$`, `$$...$$`) without crash on malformed input.
- Command palette and command registry foundation.

## Out of Scope (Initial MVP)

- Real-time collaboration.
- Cloud sync.
- Full plugin marketplace.
- Mobile-first UI.

## Success Criteria

1. Users can create/open a vault and manage files without leaving the app.
2. Markdown editing and preview remain responsive on medium-sized vaults.
3. Frontmatter-driven filtering/sorting works on standard metadata fields.
4. Last active vault and open tabs restore reliably after restart.

