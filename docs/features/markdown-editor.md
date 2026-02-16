<!-- AUTO-GENERATED:backlink START -->
[← Back](features.md)
<!-- AUTO-GENERATED:backlink END -->
# Markdown Editor Specification

## 1. Modes

### Source (Code) Mode

- Raw Markdown editing, including YAML frontmatter.
- Syntax highlighting when available.

### Preview Mode

- Rendered Markdown view.
- Links are interactive.
- Frontmatter hidden by default.

### Optional Future: Split View

- Side-by-side source and preview.
- Synchronized scrolling.

## 2. Markdown Support

Required rendered syntax:

- Headings (`#` to `######`).
- Paragraphs and line breaks.
- Ordered/unordered lists.
- Checklists (`- [ ]`, `- [x]`).
- Quotes (`>`).
- Horizontal rules (`---`, `***`, `___`).
- Links and autolinks.
- Images.
- Inline code and fenced code blocks.
- Strikethrough (`~~text~~`).

## 3. Code Blocks and Highlighting

- Triple-backtick fenced blocks.
- Language identifier after opening fence.
- Markdown parsing does not execute inside code blocks.

## 4. Math Rendering

- Inline math: `$...$`.
- Block math: `$$...$$`.
- Render only in preview.
- Malformed math should degrade gracefully without crash.

## 5. YAML Frontmatter

- Recognize frontmatter only at top of file.
- Parse metadata fields and tags.
- Invalid YAML is warning-level, not fatal.
- File remains editable and savable.

## 6. Editing Comfort Features

### Auto Pairs

- `()`, `[]`, `{}`, `""`, `''`, and optional backticks.

### Selection Wrapping

- `Ctrl+B`: wrap with `**...**`.
- `Ctrl+I`: wrap with `*...*`.
- `Ctrl+\``: wrap with inline code markers.
- Optional: shortcut to wrap selection in fenced code block.

### List Enter Behavior

- Continue list item on `Enter`.
- End list when pressing `Enter` on an empty list item.

### Indentation

- `Tab`: indent in lists/code blocks.
- `Shift+Tab`: outdent.

## 7. Links and Navigation

### In Preview

- External links open with configured policy.
- Internal wiki links (`[[Note]]`) resolve to vault files.

### In Source

- `Ctrl+Click` on links/wiki links opens target.

## 8. Save and History

- `Ctrl+S` saves active file.
- Undo/Redo supported.
- Back/Forward controls navigate editor history.

## 9. Rendering Robustness

- Unknown or broken syntax is rendered as text.
- Renderer failures should fall back safely without data loss.

## 10. Command API Surface

Expose command IDs for:

- `togglePreview`
- `toggleSplitView`
- `formatBold`
- `formatItalic`
- `insertCodeBlock(lang)`
- `insertMathInline`
- `insertMathBlock`
- `openCommandPalette`

