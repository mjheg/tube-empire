export interface CategoryDef {
  id: number;
  name: string;
  emoji: string;
  viewMultiplier: number;
  unlockSubscribers: number;
}

export const CATEGORIES: CategoryDef[] = [
  { id: 0, name: "Vlog", emoji: "\u{1F4F7}", viewMultiplier: 1, unlockSubscribers: 0 },
  { id: 1, name: "Gaming", emoji: "\u{1F3AE}", viewMultiplier: 1.5, unlockSubscribers: 500 },
  { id: 2, name: "Mukbang", emoji: "\u{1F357}", viewMultiplier: 2, unlockSubscribers: 5_000 },
  { id: 3, name: "Shorts", emoji: "\u26A1", viewMultiplier: 3, unlockSubscribers: 20_000 },
  { id: 4, name: "Music", emoji: "\u{1F3B5}", viewMultiplier: 5, unlockSubscribers: 100_000 },
  { id: 5, name: "Education", emoji: "\u{1F4DA}", viewMultiplier: 8, unlockSubscribers: 500_000 },
];

export function getUnlockableCategories(subscribers: number): number[] {
  return CATEGORIES
    .filter((c) => c.unlockSubscribers <= subscribers)
    .map((c) => c.id);
}
