import { HamsterState } from "./state";

interface MissionDef {
  id: string;
  description: string;
  target: number;
  reward: number;
}

export const DAILY_MISSIONS: MissionDef[] = [
  { id: "pet3", description: "Pet your hamster 3 times", target: 3, reward: 10 },
  { id: "feed3", description: "Feed your hamster 3 times", target: 3, reward: 10 },
  { id: "login", description: "Log in today", target: 1, reward: 5 },
];

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function resetDailyMissions(state: HamsterState): HamsterState {
  const today = getTodayString();
  if (state.lastMissionResetDate === today) return state;
  return {
    ...state,
    lastMissionResetDate: today,
    dailyMissions: DAILY_MISSIONS.map((m) => ({
      missionId: m.id, current: 0, target: m.target, claimed: false,
    })),
  };
}

export function updateMissionProgress(state: HamsterState): HamsterState {
  const missions = state.dailyMissions.map((mp) => {
    if (mp.claimed) return mp;
    let current = mp.current;
    if (mp.missionId === "pet3") current = Math.min(mp.target, state.totalPets % 1000);
    if (mp.missionId === "feed3") current = Math.min(mp.target, state.totalFeeds % 1000);
    if (mp.missionId === "login") current = 1;
    return { ...mp, current };
  });
  return { ...state, dailyMissions: missions };
}

export function claimMissionReward(state: HamsterState, missionId: string): HamsterState {
  const def = DAILY_MISSIONS.find((d) => d.id === missionId);
  if (!def) return state;
  const mission = state.dailyMissions.find((m) => m.missionId === missionId);
  if (!mission || mission.claimed || mission.current < mission.target) return state;

  return {
    ...state,
    dailyMissions: state.dailyMissions.map((m) =>
      m.missionId === missionId ? { ...m, claimed: true } : m
    ),
    coins: state.coins + def.reward,
  };
}
