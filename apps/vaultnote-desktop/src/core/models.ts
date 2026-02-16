export type ModuleId = "dashboard" | "editor" | "graph";

export interface VaultPaths {
  md: string;
  json: string;
  assets: string;
}

export interface VaultRules {
  loadOnlyInsideVault: boolean;
}

export interface VaultConfig {
  id: string;
  name: string;
  rootPath: string;
  paths: VaultPaths;
  rules: VaultRules;
}

export interface TreeNode {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  children?: TreeNode[];
}

export interface EditorTab {
  id: string;
  title: string;
  path: string;
  content: string;
  dirty: boolean;
}

export interface CommandItem {
  id: string;
  title: string;
  group: "General" | "Editor" | "Files" | "Vault";
  run: () => void;
}

export interface UIState {
  lastVaultId: string;
  activeModule: ModuleId;
  openTabIds: string[];
  activeTabId: string | null;
  explorerCollapsed: boolean;
}
