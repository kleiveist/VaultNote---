<!-- AUTO-GENERATED:backlink START -->
[← Back](implementation.md)
<!-- AUTO-GENERATED:backlink END -->
# Testing and Quality Strategy

## Testing Pyramid

## Unit Tests

Target modules:

- Frontmatter parser.
- Markdown pipeline transforms.
- Path validation utilities.
- Command registry and keybinding resolution.

## Integration Tests

Target workflows:

- Vault switch and file tree refresh.
- File operation lifecycle (copy/move/rename/delete).
- Editor open -> edit -> save -> reload.
- Preview rendering with mixed Markdown/frontmatter/math.

## End-to-End Tests

Critical scenarios:

1. Open app, select vault, open file, edit, save, restart, restore state.
2. Drag file across folders and verify tree/persistence integrity.
3. Open help/settings modal and close using all supported interactions.

## Quality Gates

Before release candidate:

- No data-loss bugs in file operations.
- No vault-boundary escape in path handling.
- Preview mode stable with malformed input.
- Restore workflow stable for last vault and open tabs.

## Non-Functional Checks

- Performance profiling for tree rendering and preview latency.
- Memory checks with many open tabs.
- Accessibility pass for keyboard and focus visibility.

## Manual QA Checklist

1. Verify active states in rail, explorer, and tabs.
2. Verify empty states when vault is empty or no tab is open.
3. Verify context menu enable/disable rules.
4. Verify shortcut behavior with keyboard-only workflow.

