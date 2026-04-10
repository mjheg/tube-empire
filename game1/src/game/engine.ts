import { GameState } from "./state";
import { EQUIPMENT_MULTIPLIERS, SPACE_MULTIPLIERS, TEAM } from "./upgrades";
import { CATEGORIES } from "./categories";

export function calcViewsPerClick(state: GameState): number {
  const equipMult = EQUIPMENT_MULTIPLIERS[state.equipmentLevel] ?? 1;
  const spaceMult = SPACE_MULTIPLIERS[state.spaceLevel] ?? 1;
  const categoryMult = CATEGORIES[state.activeCategory]?.viewMultiplier ?? 1;
  const trendingMult = state.activeCategory === state.currentTrending ? 2 : 1;
  const prestigeMult = state.permanentMultiplier;

  return Math.floor(1 * equipMult * spaceMult * categoryMult * trendingMult * prestigeMult);
}

export function calcViewsPerSecond(state: GameState): number {
  let vps = 0;
  for (const member of TEAM) {
    if (state.team[member.id]) {
      vps += member.vps;
    }
  }

  const spaceMult = SPACE_MULTIPLIERS[state.spaceLevel] ?? 1;
  const prestigeMult = state.permanentMultiplier;

  return Math.floor(vps * spaceMult * prestigeMult);
}

function calcMoneyPerView(subscribers: number): number {
  if (subscribers < 100) return 0;
  return 0.001;
}

export function handleClick(state: GameState): GameState {
  const vpc = calcViewsPerClick(state);
  const newViews = state.views + vpc;
  const newTotalViews = state.totalViews + vpc;
  const newSubscribers = Math.floor(newTotalViews / 1000);
  const moneyEarned = vpc * calcMoneyPerView(newSubscribers);

  return {
    ...state,
    views: newViews,
    totalViews: newTotalViews,
    subscribers: newSubscribers,
    money: state.money + moneyEarned,
    viewsPerClick: vpc,
    totalClicks: state.totalClicks + 1,
  };
}

export function tick(state: GameState): GameState {
  const vps = calcViewsPerSecond(state);
  if (vps === 0) {
    return { ...state, viewsPerSecond: 0, totalPlayTime: state.totalPlayTime + 1 };
  }

  const newViews = state.views + vps;
  const newTotalViews = state.totalViews + vps;
  const newSubscribers = Math.floor(newTotalViews / 1000);
  const moneyEarned = vps * calcMoneyPerView(newSubscribers);

  return {
    ...state,
    views: newViews,
    totalViews: newTotalViews,
    subscribers: newSubscribers,
    money: state.money + moneyEarned,
    viewsPerSecond: vps,
    totalPlayTime: state.totalPlayTime + 1,
  };
}
