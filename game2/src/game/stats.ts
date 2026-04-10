import { HamsterState } from "./state";

export function decayStats(state: HamsterState): HamsterState {
  return {
    ...state,
    hunger: Math.max(0, state.hunger - 0.02),
    happiness: Math.max(0, state.happiness - 0.01),
    energy: state.energy < 100 ? Math.min(100, state.energy + 0.05) : state.energy,
  };
}

export function pet(state: HamsterState): HamsterState {
  return {
    ...state,
    happiness: Math.min(100, state.happiness + 5),
    intimacyXP: state.intimacyXP + 2,
    totalPets: state.totalPets + 1,
    coins: state.coins + 1,
  };
}

export function feed(state: HamsterState, foodValue: number): HamsterState {
  return {
    ...state,
    hunger: Math.min(100, state.hunger + foodValue),
    happiness: Math.min(100, state.happiness + 2),
    intimacyXP: state.intimacyXP + 1,
    totalFeeds: state.totalFeeds + 1,
  };
}

export function play(state: HamsterState): HamsterState {
  if (state.energy < 10) return state;
  return {
    ...state,
    energy: Math.max(0, state.energy - 15),
    happiness: Math.min(100, state.happiness + 10),
    intimacyXP: state.intimacyXP + 3,
    coins: state.coins + 2,
  };
}

export function getHappinessEmoji(value: number): string {
  if (value >= 80) return "\u2764\uFE0F";
  if (value >= 50) return "\u{1F9E1}";
  if (value >= 20) return "\u{1F494}";
  return "\u{1F5A4}";
}
