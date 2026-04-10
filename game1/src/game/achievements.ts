import { GameState } from "./state";

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
  check: (state: GameState) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_click",
    title: "First Upload",
    description: "Upload your first video",
    emoji: "\u{1F3AC}",
    check: (s) => s.totalClicks >= 1,
  },
  {
    id: "click_100",
    title: "Content Machine",
    description: "Upload 100 videos",
    emoji: "\u{1F4F9}",
    check: (s) => s.totalClicks >= 100,
  },
  {
    id: "click_1000",
    title: "Upload Addict",
    description: "Upload 1,000 videos",
    emoji: "\u{1F525}",
    check: (s) => s.totalClicks >= 1000,
  },
  {
    id: "sub_100",
    title: "Getting Started",
    description: "Reach 100 subscribers",
    emoji: "\u{1F4E2}",
    check: (s) => s.subscribers >= 100,
  },
  {
    id: "sub_1k",
    title: "Rising Star",
    description: "Reach 1,000 subscribers",
    emoji: "\u2B50",
    check: (s) => s.subscribers >= 1000,
  },
  {
    id: "sub_100k",
    title: "Influencer",
    description: "Reach 100K subscribers",
    emoji: "\u{1F31F}",
    check: (s) => s.subscribers >= 100_000,
  },
  {
    id: "sub_1m",
    title: "Superstar",
    description: "Reach 1M subscribers",
    emoji: "\u{1F48E}",
    check: (s) => s.subscribers >= 1_000_000,
  },
  {
    id: "first_editor",
    title: "Team Player",
    description: "Hire your first team member",
    emoji: "\u{1F465}",
    check: (s) => s.team.editor || s.team.thumbnail || s.team.manager || s.team.pd,
  },
  {
    id: "full_team",
    title: "Full Squad",
    description: "Hire all team members",
    emoji: "\u{1F3C6}",
    check: (s) => s.team.editor && s.team.thumbnail && s.team.manager && s.team.pd,
  },
  {
    id: "first_upgrade",
    title: "Glow Up",
    description: "Upgrade your camera",
    emoji: "\u{1F4F7}",
    check: (s) => s.equipmentLevel >= 1,
  },
  {
    id: "cinema_camera",
    title: "Hollywood",
    description: "Get the Cinema Camera",
    emoji: "\u{1F3A5}",
    check: (s) => s.equipmentLevel >= 3,
  },
  {
    id: "big_studio",
    title: "Media Empire HQ",
    description: "Unlock the Big Studio",
    emoji: "\u{1F3E2}",
    check: (s) => s.spaceLevel >= 3,
  },
  {
    id: "all_categories",
    title: "Multi-Creator",
    description: "Unlock all video categories",
    emoji: "\u{1F308}",
    check: (s) => s.unlockedCategories.length >= 6,
  },
  {
    id: "first_prestige",
    title: "Reborn",
    description: "Prestige for the first time",
    emoji: "\u{1F504}",
    check: (s) => s.prestigeCount >= 1,
  },
  {
    id: "streak_7",
    title: "Dedicated",
    description: "7-day login streak",
    emoji: "\u{1F4AA}",
    check: (s) => s.dailyStreak >= 7,
  },
  {
    id: "money_1m",
    title: "Millionaire",
    description: "Earn $1,000,000",
    emoji: "\u{1F4B0}",
    check: (s) => s.money >= 1_000_000,
  },
];

export function checkNewAchievements(state: GameState): AchievementDef[] {
  return ACHIEVEMENTS.filter(
    (a) => !state.achievements.includes(a.id) && a.check(state)
  );
}
