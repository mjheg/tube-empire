export interface HamsterState {
  name: string;

  // Stats (0-100)
  happiness: number;
  hunger: number;
  energy: number;

  // Growth
  birthTime: number;
  growthStage: "baby" | "teen" | "adult";
  intimacyLevel: number;
  intimacyXP: number;

  // Economy
  coins: number;

  // Decoration
  placedItems: PlacedItem[];

  // Missions
  dailyMissions: DailyMissionProgress[];
  lastMissionResetDate: string;

  // Daily login
  lastLoginDate: string | null;
  loginStreak: number;

  // Meta
  totalPets: number;
  totalFeeds: number;
  lastSaveTime: number;
  lastOnlineTime: number;
}

export interface PlacedItem {
  itemId: string;
  x: number;
  y: number;
}

export interface DailyMissionProgress {
  missionId: string;
  current: number;
  target: number;
  claimed: boolean;
}

export function createInitialState(): HamsterState {
  return {
    name: "",
    happiness: 70,
    hunger: 80,
    energy: 100,
    birthTime: Date.now(),
    growthStage: "baby",
    intimacyLevel: 0,
    intimacyXP: 0,
    coins: 50,
    placedItems: [
      { itemId: "water-bottle", x: 0.15, y: 0.2 },
      { itemId: "food-bowl", x: 0.15, y: 0.7 },
      { itemId: "wheel", x: 0.7, y: 0.3 },
      { itemId: "house", x: 0.75, y: 0.75 },
    ],
    dailyMissions: [],
    lastMissionResetDate: "",
    lastLoginDate: null,
    loginStreak: 0,
    totalPets: 0,
    totalFeeds: 0,
    lastSaveTime: Date.now(),
    lastOnlineTime: Date.now(),
  };
}
