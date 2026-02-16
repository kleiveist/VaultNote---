import type { EditorTab, TreeNode, VaultConfig } from "../core/models";

export const sampleVault: VaultConfig = {
  id: "vaultnote-main",
  name: "VaultNote Workspace",
  rootPath: "/vaults/vaultnote-main",
  paths: {
    md: "./md",
    json: "./json",
    assets: "./assets"
  },
  rules: {
    loadOnlyInsideVault: true
  }
};

export const sampleTree: TreeNode[] = [
  {
    id: "folder-product",
    name: "product",
    path: "md/product",
    type: "folder",
    children: [
      {
        id: "file-vision",
        name: "vision.md",
        path: "md/product/vision.md",
        type: "file"
      },
      {
        id: "file-requirements",
        name: "functional-requirements.md",
        path: "md/product/functional-requirements.md",
        type: "file"
      }
    ]
  },
  {
    id: "folder-architecture",
    name: "architecture",
    path: "md/architecture",
    type: "folder",
    children: [
      {
        id: "file-shell",
        name: "ui-shell-spec.md",
        path: "md/architecture/ui-shell-spec.md",
        type: "file"
      }
    ]
  }
];

const initialMarkdown = `---
Cover: "[[vaultnote-cover.png]]"
Section: Product
Rank: A1
Project: VAULTNOTE
Task: MVP
Status: "0 | Not started"
Progress: "0%"
tags:
  - VaultNote
  - MVP
  - Spec
---

# VaultNote MVP

- [ ] Implement vault switcher
- [ ] Implement tree explorer operations
- [ ] Implement markdown source/preview modes

## Notes

Use command palette with Ctrl+P to open files and commands.
`;

export const sampleTabs: EditorTab[] = [
  {
    id: "tab-vision",
    title: "vision.md",
    path: "md/product/vision.md",
    content: initialMarkdown,
    dirty: false
  }
];
