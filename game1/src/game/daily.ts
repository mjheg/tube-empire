import { GameState } from "./state";

interface DailyReward {
  day: number;
  description: string;
  emoji: string;
  viewsBonus: number;
  subscriberBonus: number;
}

export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, description: "Views Bonus", emoji: "\u{1F4FA}", viewsBonus: 1000, subscriberBonus: 0 },
  { day: 2, description: "Views Bonus x2", emoji: "\u{1F4FA}", viewsBonus: 2000, subscriberBonus: 0 },
  { day: 3, description: "Subscriber Boost", emoji: "\u2B50", viewsBonus: 3000, subscriberBonus: 50 },
  { day: 4, description: "Big Views", emoji: "\u{1F525}", viewsBonus: 5000, subscriberBonus: 0 },
  { day: 5, description: "Subscriber Boost x2", emoji: "\u2B50", viewsBonus: 5000, subscriberBonus: 100 },
  { day: 6, description: "Mega Views", emoji: "\u{1F4A5}", viewsBonus: 10000, subscriberBonus: 0 },
  { day: 7, description: "JACKPOT!", emoji: "\u{1F3B0}", viewsBonus: 50000, subscriberBonus: 500 },
];

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function canClaimDaily(state: GameState): boolean {
  return state.lastDailyClaimDate !== getTodayString();
}

export function claimDaily(state: GameState): { state: GameState; reward: DailyReward } {
  const today = getTodayString();
  const yesterday = getYesterdayString();

  let newStreak: number;
  if (state.lastDailyClaimDate === yesterday) {
    newStreak = state.dailyStreak + 1;
  } else {
    newStreak = 1;
  }

  const rewardIndex = (newStreak - 1) % 7;
  const reward = DAILY_REWARDS[rewardIndex];

  const newState: GameState = {
    ...state,
    lastDailyClaimDate: today,
    dailyStreak: newStreak,
    views: state.views + reward.viewsBonus,
    totalViews: state.totalViews + reward.viewsBonus,
    subscribers: state.subscribers + reward.subscriberBonus,
  };

  return { state: newState, reward };
}
