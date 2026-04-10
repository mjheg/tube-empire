export interface GameState {
  // Resources
  views: number;
  totalViews: number;
  subscribers: number;
  money: number;

  // Click power
  viewsPerClick: number;

  // Auto production (views per second)
  viewsPerSecond: number;

  // Equipment level (0-3): phone, webcam, dslr, cinema
  equipmentLevel: number;

  // Space level (0-3): room, studio, office, bigStudio
  spaceLevel: number;

  // Team members owned (each is 0 or 1)
  team: {
    editor: boolean;
    thumbnail: boolean;
    manager: boolean;
    pd: boolean;
  };

  // Unlocked category indices (always includes 0 = vlog)
  unlockedCategories: number[];

  // Active category index
  activeCategory: number;

  // Milestones already celebrated (subscriber thresholds)
  celebratedMilestones: number[];

  // Prestige
  prestigeCount: number;
  permanentMultiplier: number;

  // Daily reward
  lastDailyClaimDate: string | null; // "YYYY-MM-DD"
  dailyStreak: number;

  // Trending
  currentTrending: number; // category index that's trending
  trendingChangedAt: number; // timestamp ms

  // Timestamps
  lastSaveTime: number; // timestamp ms
  lastOnlineTime: number; // timestamp ms

  // Stats
  totalClicks: number;
  totalPlayTime: number; // seconds
}

export function createInitialState(): GameState {
  return {
    views: 0,
    totalViews: 0,
    subscribers: 0,
    money: 0,
    viewsPerClick: 1,
    viewsPerSecond: 0,
    equipmentLevel: 0,
    spaceLevel: 0,
    team: {
      editor: false,
      thumbnail: false,
      manager: false,
      pd: false,
    },
    unlockedCategories: [0],
    activeCategory: 0,
    celebratedMilestones: [],
    prestigeCount: 0,
    permanentMultiplier: 1,
    lastDailyClaimDate: null,
    dailyStreak: 0,
    currentTrending: 0,
    trendingChangedAt: Date.now(),
    lastSaveTime: Date.now(),
    lastOnlineTime: Date.now(),
    totalClicks: 0,
    totalPlayTime: 0,
  };
}
