import { HamsterState, createInitialState } from "./state";

const SAVE_KEY = "hamster-home-save";

export function saveGame(state: HamsterState): void {
  const toSave = { ...state, lastSaveTime: Date.now(), lastOnlineTime: Date.now() };
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(toSave)); } catch {}
}

export function loadGame(): HamsterState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed.happiness !== "number") return null;
    if (!Array.isArray(parsed.placedItems)) parsed.placedItems = [];
    if (!Array.isArray(parsed.dailyMissions)) parsed.dailyMissions = [];
    return parsed as HamsterState;
  } catch { return null; }
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export interface OfflineReport {
  offlineMinutes: number;
  hungerLost: number;
  happinessLost: number;
}

export function calcOfflineChanges(state: HamsterState): OfflineReport {
  const elapsed = Math.floor((Date.now() - state.lastOnlineTime) / 1000);
  const cappedSeconds = Math.min(elapsed, 86400);
  const minutes = Math.floor(cappedSeconds / 60);
  if (minutes < 1) return { offlineMinutes: 0, hungerLost: 0, happinessLost: 0 };
  const hungerLost = Math.min(state.hunger, minutes * 0.02 * 60);
  const happinessLost = Math.min(state.happiness, minutes * 0.01 * 60);
  return { offlineMinutes: minutes, hungerLost, happinessLost };
}

export function applyOfflineChanges(state: HamsterState, report: OfflineReport): HamsterState {
  return {
    ...state,
    hunger: Math.max(0, state.hunger - report.hungerLost),
    happiness: Math.max(0, state.happiness - report.happinessLost),
    lastOnlineTime: Date.now(),
  };
}
