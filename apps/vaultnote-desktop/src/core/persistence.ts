import type { UIState } from "./models";

const STORAGE_KEY = "vaultnote.ui.state.v1";

export function loadUIState(): Partial<UIState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as Partial<UIState>;
  } catch {
    return {};
  }
}

export function saveUIState(state: UIState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
