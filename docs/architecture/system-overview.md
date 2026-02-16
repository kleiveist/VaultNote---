<!-- AUTO-GENERATED:backlink START -->
[← Back](architecture.md)
<!-- AUTO-GENERATED:backlink END -->
# System Overview

## Architecture Style

VaultNote should use a modular desktop architecture with local filesystem as the primary data source.
Recommended baseline:

- UI shell (frontend app).
- Core services (vault, files, editor session, command registry).
- Renderer pipeline (Markdown + optional math + syntax highlighting).
- Persistence layer (JSON state files inside vault).

## Logical Modules

1. `VaultService`
   - Resolve active vault.
   - Enforce load-only-inside-vault rule.
   - Validate required folders and metadata files.

2. `FileTreeService`
   - Build tree model from vault paths.
   - Provide file operations (copy/move/rename/delete/open-with).

3. `EditorSessionService`
   - Manage opened tabs and dirty states.
   - Track navigation history and cursor/scroll restoration.

4. `MarkdownPipeline`
   - Parse Markdown and frontmatter.
   - Render preview safely.
   - Add optional math and highlighting stages.

5. `CommandService`
   - Register/execute commands.
   - Handle shortcut binding and command palette indexing.

6. `SettingsService`
   - Read/write `settings.json`, `ui.json`, and optional index cache.

## Runtime Data Flow

1. App boot:
   - Read global app state (last vault id/path).
   - Activate vault and hydrate UI.
2. Vault load:
   - Validate vault file layout.
   - Build explorer tree and optional cache index.
3. File open:
   - Open file in tab, parse frontmatter, initialize editor model.
4. Edit cycle:
   - Mark tab dirty, support undo/redo, save on demand.
5. Preview cycle:
   - Transform source through Markdown pipeline.
6. Shutdown:
   - Persist active vault, open tabs, and UI state.

## Security and Safety Constraints

- No path traversal outside active vault.
- File operations must be normalized and validated before execution.
- Preview rendering should sanitize potentially unsafe HTML unless explicitly allowed.

## Performance Targets (Initial)

- Vault switch completion: under 1.5s for medium vaults.
- File open to editable state: under 300ms for typical notes.
- Preview update latency: under 120ms for normal files.

