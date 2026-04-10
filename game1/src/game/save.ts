import { GameState, createInitialState } from "./state";
import { calcViewsPerSecond } from "./engine";

const SAVE_KEY = "youtuber-tycoon-save";

export function saveGame(state: GameState): void {
  const toSave = { ...state, lastSaveTime: Date.now(), lastOnlineTime: Date.now() };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage full or unavailable
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed.totalViews !== "number") return null;
    // Backfill fields added after initial release
    if (!Array.isArray(parsed.achievements)) parsed.achievements = [];
    if (!parsed.channelName) parsed.channelName = "";
    return parsed as GameState;
  } catch {
    return null;
  }
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function calcOfflineEarnings(state: GameState): {
  offlineViews: number;
  offlineMoney: number;
  offlineSeconds: number;
} {
  const now = Date.now();
  const elapsed = Math.floor((now - state.lastOnlineTime) / 1000);
  const cappedSeconds = Math.min(elapsed, 86400); // max 24h

  if (cappedSeconds < 60) {
    return { offlineViews: 0, offlineMoney: 0, offlineSeconds: 0 };
  }

  const vps = calcViewsPerSecond(state);
  const offlineViews = vps * cappedSeconds;
  const moneyPerView = state.subscribers >= 100 ? 0.001 : 0;
  const offlineMoney = offlineViews * moneyPerView;

  return { offlineViews, offlineMoney, offlineSeconds: cappedSeconds };
}
