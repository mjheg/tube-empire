import { CATEGORIES } from "./categories";

const TRENDING_INTERVAL = 30 * 60 * 1000; // 30 minutes

export function shouldRotateTrending(trendingChangedAt: number): boolean {
  return Date.now() - trendingChangedAt >= TRENDING_INTERVAL;
}

export function getNewTrendingCategory(currentTrending: number): number {
  const pool = CATEGORIES.map((c) => c.id).filter((id) => id !== currentTrending);
  return pool[Math.floor(Math.random() * pool.length)];
}
