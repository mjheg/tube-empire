import { GameState, createInitialState } from "./state";

export const PRESTIGE_THRESHOLD = 10_000_000;

export function canPrestige(state: GameState): boolean {
  return state.subscribers >= PRESTIGE_THRESHOLD;
}

interface PrestigeBonus {
  multiplier: number;
  description: string;
}

export const PRESTIGE_BONUSES: PrestigeBonus[] = [
  { multiplier: 1.5, description: "All earnings +50%" },
  { multiplier: 2.0, description: "All earnings +100%, start with Webcam" },
  { multiplier: 3.0, description: "All earnings +200%, start with Webcam + Editor" },
  { multiplier: 4.5, description: "All earnings +350%, start with DSLR + Editor" },
  { multiplier: 7.0, description: "All earnings +600%, start with DSLR + full team" },
];

export function getPrestigeBonus(prestigeCount: number): PrestigeBonus {
  const index = Math.min(prestigeCount, PRESTIGE_BONUSES.length - 1);
  return PRESTIGE_BONUSES[index];
}

export function performPrestige(state: GameState): GameState {
  const newPrestigeCount = state.prestigeCount + 1;
  const bonus = getPrestigeBonus(newPrestigeCount);
  const fresh = createInitialState();

  return {
    ...fresh,
    prestigeCount: newPrestigeCount,
    permanentMultiplier: bonus.multiplier,
    equipmentLevel: newPrestigeCount >= 3 ? 2 : newPrestigeCount >= 1 ? 1 : 0,
    team: {
      editor: newPrestigeCount >= 2,
      thumbnail: newPrestigeCount >= 4,
      manager: newPrestigeCount >= 4,
      pd: newPrestigeCount >= 4,
    },
    lastDailyClaimDate: state.lastDailyClaimDate,
    dailyStreak: state.dailyStreak,
  };
}
