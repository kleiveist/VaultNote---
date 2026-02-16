<!-- AUTO-GENERATED:backlink START -->
[← Back](architecture.md)
<!-- AUTO-GENERATED:backlink END -->
# Vault Data Model

## Recommended Vault Layout

```text
/appdata/vaults/IDBS01/
  vault.json
  /md
    IDBS01KS-01.md
  /json
    settings.json
    index.json
    ui.json
  /assets
    IDBS01KS-01-01.png
```

## `vault.json`

Purpose:

- Identify vault.
- Define canonical local paths.
- Store local vault rules.

Example:

```json
{
  "id": "IDBS01",
  "name": "Project IDBS01",
  "paths": {
    "md": "./md",
    "json": "./json",
    "assets": "./assets"
  },
  "rules": {
    "loadOnlyInsideVault": true
  }
}
```

## Markdown File Model

Each note/task/spec file consists of:

1. YAML frontmatter metadata block (optional but recommended).
2. Markdown body content.

Example frontmatter:

```yaml
---
Cover: '[[IDBS01KS-01-01.png]]'
Section: IUFS
Rank: SE1
Projekt: IDBS01
Task: Exam
Ergebnis: "0 | Not started"
Prozent: "0% | 0"
MuiChoi: null
TransA3: null
tags:
  - IDBS01KS-01
  - IUFS
  - SE1
  - IDBS01
  - Exam
link1: '[[IDBS01KS-01]]'
---
```

## JSON Data Files

### `settings.json`

Vault-specific preferences:

- autosave on/off
- preview defaults
- preferred shortcuts profile

### `index.json`

Optional cache for fast lookup:

- file path
- title
- tags
- modified timestamp

### `ui.json`

UI restoration state:

- expanded tree folders
- selected file
- open tabs
- active tab

## Validation Rules

1. Paths in `vault.json` must resolve under vault root.
2. Frontmatter parse failures produce warnings, not hard failures.
3. JSON state writes should be atomic to reduce corruption risk.

