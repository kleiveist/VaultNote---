<!-- AUTO-GENERATED:backlink START -->
[← Back](product.md)
<!-- AUTO-GENERATED:backlink END -->
# Functional Requirements

## 1. Vault Management

### FR-1 Active Vault

- The app must maintain exactly one active vault at a time.
- Only files inside the active vault can be loaded and indexed.

### FR-2 Vault Structure

A vault should support at minimum:

- `md/` for Markdown files.
- `json/` for settings/index/ui state.
- `assets/` for images and attachments.

### FR-3 Vault Switching

- A vault switcher is available in the bottom-left bar.
- Switching vault reloads explorer tree, open tabs policy, and cached indexes.

## 2. Application Shell

### FR-4 Layout Regions

The app layout includes:

- Top bar for global/contextual actions.
- Left navigation rail (module icons).
- Left explorer panel (folder/file tree).
- Main editor area (tabs + content).
- Bottom bar (vault switch + help/settings).

### FR-5 Active States

The app must visually indicate:

- Active navigation module.
- Selected explorer file/folder.
- Active editor tab.

## 3. Explorer

### FR-6 Tree View

- Folders are collapsible/expandable.
- Tree indentation reflects depth.

### FR-7 File Operations

Per file/folder, support:

- Open.
- Open with.
- Reveal in file path.
- Rename.
- Copy/Cut/Paste.
- Move.
- Delete.

### FR-8 Drag-and-Drop

- Dragging a file onto a folder performs move by default.
- Modifier key may switch operation to copy.

## 4. Editor

### FR-9 Tab System

- Multiple files can be opened as tabs.
- Tabs show dirty state for unsaved changes.
- Tabs can be closed via mouse or shortcut.

### FR-10 Modes

- Code mode: raw Markdown + frontmatter editing.
- Preview mode: rendered Markdown.
- Optional future split view.

### FR-11 Markdown Coverage

Renderer must support:

- Headings, paragraphs, lists, checkboxes, quotes, links, images, hr.
- Inline code and fenced code blocks.
- Strikethrough.

### FR-12 Frontmatter Behavior

- YAML frontmatter is detected at file start.
- Invalid YAML shows warning but does not block save.
- Preview hides frontmatter by default.

### FR-13 Math

- Inline and block LaTeX in preview.
- Invalid expressions must degrade safely (no crash).

### FR-14 Save + History

- `Ctrl+S` saves active file.
- Undo/Redo keyboard support.
- Back/Forward editor navigation through visited positions/files.

## 5. Commands and Shortcuts

### FR-15 Command Palette

- `Ctrl+O` or `Ctrl+P` opens a searchable command/file palette.
- Fuzzy search across commands and files.
- Command registry is extensible.

### FR-16 Command API

Provide commands such as:

- `togglePreview`
- `toggleSplitView`
- `formatBold`
- `formatItalic`
- `insertCodeBlock`
- `insertMathInline`
- `insertMathBlock`
- `openCommandPalette`

## 6. Settings, Help, and Persistence

### FR-17 Help and Settings

- Help and Settings open as popup/modal from bottom-right icons.
- Popups close via `X`, outside click, or `Esc`.

### FR-18 Persistence

Persist in JSON:

- Last active vault.
- Last open tabs.
- Optional explorer UI state.

## 7. Empty States

### FR-19 Required Empty States

- No open tab: show `Select a file...`.
- Empty vault: show `No files in vault...`.

