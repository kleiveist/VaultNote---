import type { VaultConfig } from "./models";

export function isPathInsideVault(vaultRoot: string, candidatePath: string): boolean {
  const root = normalize(vaultRoot);
  const candidate = normalize(candidatePath);
  return candidate === root || candidate.startsWith(`${root}/`);
}

export function resolveVaultPath(vault: VaultConfig, relativePath: string): string {
  const root = normalize(vault.rootPath);
  const cleanRelative = relativePath.replace(/^\/+/, "");
  return `${root}/${cleanRelative}`;
}

function normalize(value: string): string {
  return value.replace(/\\/g, "/").replace(/\/+$/, "");
}
