import { HamsterState } from "./state";

const DAY_MS = 24 * 60 * 60 * 1000;

export function updateGrowthStage(state: HamsterState): HamsterState {
  const ageDays = (Date.now() - state.birthTime) / DAY_MS;
  let stage: HamsterState["growthStage"];
  if (ageDays < 3) stage = "baby";
  else if (ageDays < 7) stage = "teen";
  else stage = "adult";

  if (stage === state.growthStage) return state;
  return { ...state, growthStage: stage };
}

export function xpForLevel(level: number): number {
  return 20 + level * 15;
}

export function checkLevelUp(state: HamsterState): { state: HamsterState; leveledUp: boolean } {
  const needed = xpForLevel(state.intimacyLevel);
  if (state.intimacyXP < needed) return { state, leveledUp: false };
  return {
    state: { ...state, intimacyLevel: state.intimacyLevel + 1, intimacyXP: state.intimacyXP - needed },
    leveledUp: true,
  };
}

export function getGrowthLabel(stage: HamsterState["growthStage"]): string {
  switch (stage) { case "baby": return "Baby"; case "teen": return "Teen"; case "adult": return "Adult"; }
}

export function getHamsterSize(stage: HamsterState["growthStage"]): number {
  switch (stage) { case "baby": return 0.6; case "teen": return 0.8; case "adult": return 1.0; }
}
