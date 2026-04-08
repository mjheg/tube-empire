# YouTuber Tycoon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first idle/clicker web game where you grow from 0 subscribers to a media empire, monetized via reward ads and in-app purchases.

**Architecture:** Single-page Next.js app. All game logic runs client-side in React with a Canvas overlay for visual effects. Game state lives in LocalStorage (no server). React components handle UI (stats, menus, modals); a game engine module runs the tick loop updating resources every second.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, HTML Canvas 2D, LocalStorage, Vercel (free tier)

---

## File Structure

```
game1/
  src/
    app/
      layout.tsx          — Root layout, meta tags, viewport config
      page.tsx            — Single page, mounts <Game />
      globals.css         — Global styles, CSS variables, mobile-first
    components/
      Game.tsx            — Top-level game shell, orchestrates panels
      StatsBar.tsx        — Top bar: subscribers, views, money, trending
      CommentFeed.tsx     — Scrolling auto-generated comments
      StudioView.tsx      — Center area: room background + equipment
      ClickButton.tsx     — Main "upload video" button + click effects
      MilestoneBar.tsx    — Progress bar to next milestone
      BottomNav.tsx       — Tab navigation: equipment, team, channel, shop
      panels/
        EquipmentPanel.tsx  — Equipment upgrade list
        TeamPanel.tsx       — Team hire/upgrade list
        ChannelPanel.tsx    — Category unlock + channel management
        ShopPanel.tsx       — IAP placeholders, ad-remove, boosts
      modals/
        MilestoneModal.tsx  — Celebration popup on milestone hit
        OfflineModal.tsx    — "While you were away..." popup
        EventModal.tsx      — Random event popup (algorithm, hater, collab)
        DailyRewardModal.tsx — Daily login reward popup
        PrestigeModal.tsx   — Prestige confirmation + rewards
        SettingsModal.tsx   — Settings (reset, language placeholder)
    game/
      engine.ts           — Game tick loop (1s interval), resource calculations
      state.ts            — GameState type + initial state + state helpers
      upgrades.ts         — Upgrade definitions (equipment, space, team) + cost/effect formulas
      categories.ts       — Video category definitions + unlock conditions + view multipliers
      events.ts           — Random event definitions + trigger logic
      trending.ts         — Trending topic rotation logic
      prestige.ts         — Prestige reset logic + permanent bonus calculations
      daily.ts            — Daily reward logic + streak tracking
      save.ts             — LocalStorage save/load + offline earnings calc
      comments.ts         — Comment generation (pools by subscriber tier)
      milestones.ts       — Milestone definitions + check logic
      format.ts           — Number formatting (1000 → 1K, 1000000 → 1M)
    data/
      comments.json       — Comment text pools by subscriber tier
      trending-topics.json — Trending topic list
  public/
    favicon.ico
  package.json
  tsconfig.json
  next.config.ts
  tailwind.config.ts
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `game1/package.json`
- Create: `game1/tsconfig.json`
- Create: `game1/next.config.ts`
- Create: `game1/tailwind.config.ts`
- Create: `game1/src/app/layout.tsx`
- Create: `game1/src/app/page.tsx`
- Create: `game1/src/app/globals.css`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/myeongjeonghyeonmyeongjeonghyeon/earn_money/game1
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

When prompted, accept defaults. This creates the full scaffold including package.json, tsconfig.json, next.config.ts, tailwind.config.ts, and the src/app directory.

- [ ] **Step 2: Clean up default files**

Remove default Next.js boilerplate content. Replace `src/app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="min-h-dvh bg-gray-900 text-white flex items-center justify-center">
      <h1 className="text-2xl font-bold">YouTuber Tycoon</h1>
    </main>
  );
}
```

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouTuber Tycoon",
  description: "Grow from 0 subscribers to a media empire!",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="overscroll-none overflow-hidden">{children}</body>
    </html>
  );
}
```

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --color-primary: #ff4757;
  --color-secondary: #ffa502;
  --color-accent: #2ed573;
  --color-bg: #111827;
  --color-surface: #1f2937;
  --color-text: #f9fafb;
  --color-text-dim: #9ca3af;
}

* {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

- [ ] **Step 3: Verify dev server runs**

```bash
cd /Users/myeongjeonghyeonmyeongjeonghyeon/earn_money/game1
npm run dev
```

Open http://localhost:3000 and verify "YouTuber Tycoon" text appears on a dark background.

- [ ] **Step 4: Commit**

```bash
cd /Users/myeongjeonghyeonmyeongjeonghyeon/earn_money
git init
git add game1/
git commit -m "feat: scaffold Next.js project for YouTuber Tycoon"
```

---

### Task 2: Game State & Number Formatting

**Files:**
- Create: `game1/src/game/state.ts`
- Create: `game1/src/game/format.ts`

- [ ] **Step 1: Create GameState type and initial state**

Create `game1/src/game/state.ts`:

```ts
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
```

- [ ] **Step 2: Create number formatter**

Create `game1/src/game/format.ts`:

```ts
const SUFFIXES = [
  { threshold: 1e12, suffix: "T" },
  { threshold: 1e9, suffix: "B" },
  { threshold: 1e6, suffix: "M" },
  { threshold: 1e4, suffix: "K" },
];

export function formatNumber(n: number): string {
  if (n < 0) return "-" + formatNumber(-n);

  for (const { threshold, suffix } of SUFFIXES) {
    if (n >= threshold) {
      const value = n / threshold;
      return value < 10
        ? value.toFixed(1) + suffix
        : Math.floor(value) + suffix;
    }
  }

  return Math.floor(n).toLocaleString();
}

export function formatMoney(n: number): string {
  return "$" + formatNumber(n);
}
```

- [ ] **Step 3: Verify formatting works**

Create a temporary test. Add to end of `format.ts`:

```ts
// Quick sanity check — remove after verifying
if (typeof window === "undefined") {
  console.log(formatNumber(0));        // "0"
  console.log(formatNumber(999));      // "999"
  console.log(formatNumber(1234));     // "1,234"
  console.log(formatNumber(12345));    // "1.2K"
  console.log(formatNumber(1234567)); // "1.2M"
  console.log(formatMoney(50000));     // "$5.0K"
}
```

Run:
```bash
cd /Users/myeongjeonghyeonmyeongjeonghyeon/earn_money/game1
npx tsx src/game/format.ts
```

Verify output matches comments above. Then remove the sanity check block.

- [ ] **Step 4: Commit**

```bash
git add game1/src/game/state.ts game1/src/game/format.ts
git commit -m "feat: add game state type and number formatting"
```

---

### Task 3: Game Data Definitions

**Files:**
- Create: `game1/src/game/upgrades.ts`
- Create: `game1/src/game/categories.ts`
- Create: `game1/src/game/milestones.ts`

- [ ] **Step 1: Define upgrades**

Create `game1/src/game/upgrades.ts`:

```ts
export interface UpgradeDef {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: string; // human-readable
}

export const EQUIPMENT: UpgradeDef[] = [
  { id: "equip-0", name: "Phone Camera", description: "Basic phone recording", cost: 0, effect: "1x views per click" },
  { id: "equip-1", name: "Webcam", description: "Better quality uploads", cost: 500, effect: "3x views per click" },
  { id: "equip-2", name: "DSLR", description: "Professional video quality", cost: 50_000, effect: "10x views per click" },
  { id: "equip-3", name: "Cinema Camera", description: "Hollywood-tier production", cost: 5_000_000, effect: "50x views per click" },
];

export const EQUIPMENT_MULTIPLIERS = [1, 3, 10, 50];

export const SPACES: UpgradeDef[] = [
  { id: "space-0", name: "My Room", description: "Filming in your bedroom", cost: 0, effect: "Starting space" },
  { id: "space-1", name: "Small Studio", description: "A proper desk setup", cost: 2_000, effect: "+50% all views" },
  { id: "space-2", name: "Office", description: "A real workspace", cost: 200_000, effect: "+150% all views" },
  { id: "space-3", name: "Big Studio", description: "Full production facility", cost: 20_000_000, effect: "+400% all views" },
];

export const SPACE_MULTIPLIERS = [1, 1.5, 2.5, 5];

export interface TeamMemberDef {
  id: keyof typeof TEAM_VPS;
  name: string;
  description: string;
  cost: number;
  vps: number; // views per second added
  unlockSubscribers: number;
}

const TEAM_VPS = {
  editor: 5,
  thumbnail: 20,
  manager: 100,
  pd: 500,
} as const;

export const TEAM: TeamMemberDef[] = [
  { id: "editor", name: "Editor", description: "Auto-edits your videos", cost: 10_000, vps: TEAM_VPS.editor, unlockSubscribers: 100_000 },
  { id: "thumbnail", name: "Thumbnail Designer", description: "Click-worthy thumbnails", cost: 100_000, vps: TEAM_VPS.thumbnail, unlockSubscribers: 100_000 },
  { id: "manager", name: "Manager", description: "Handles brand deals", cost: 1_000_000, vps: TEAM_VPS.manager, unlockSubscribers: 1_000_000 },
  { id: "pd", name: "PD", description: "Full content pipeline", cost: 10_000_000, vps: TEAM_VPS.pd, unlockSubscribers: 1_000_000 },
];
```

- [ ] **Step 2: Define video categories**

Create `game1/src/game/categories.ts`:

```ts
export interface CategoryDef {
  id: number;
  name: string;
  emoji: string;
  viewMultiplier: number;
  unlockSubscribers: number;
}

export const CATEGORIES: CategoryDef[] = [
  { id: 0, name: "Vlog", emoji: "📷", viewMultiplier: 1, unlockSubscribers: 0 },
  { id: 1, name: "Gaming", emoji: "🎮", viewMultiplier: 1.5, unlockSubscribers: 500 },
  { id: 2, name: "Mukbang", emoji: "🍗", viewMultiplier: 2, unlockSubscribers: 5_000 },
  { id: 3, name: "Shorts", emoji: "⚡", viewMultiplier: 3, unlockSubscribers: 20_000 },
  { id: 4, name: "Music", emoji: "🎵", viewMultiplier: 5, unlockSubscribers: 100_000 },
  { id: 5, name: "Education", emoji: "📚", viewMultiplier: 8, unlockSubscribers: 500_000 },
];

export function getUnlockableCategories(subscribers: number): number[] {
  return CATEGORIES
    .filter((c) => c.unlockSubscribers <= subscribers)
    .map((c) => c.id);
}
```

- [ ] **Step 3: Define milestones**

Create `game1/src/game/milestones.ts`:

```ts
export interface MilestoneDef {
  subscribers: number;
  title: string;
  description: string;
  emoji: string;
}

export const MILESTONES: MilestoneDef[] = [
  { subscribers: 100, title: "First Monetization!", emoji: "💰", description: "You can now earn money from views!" },
  { subscribers: 1_000, title: "Silver Button!", emoji: "🥈", description: "YouTube sent you a Silver Play Button!" },
  { subscribers: 100_000, title: "Gold Button!", emoji: "🥇", description: "Gold Play Button! You can hire an editor now!" },
  { subscribers: 1_000_000, title: "Diamond Button!", emoji: "💎", description: "Diamond Play Button! Time to build an MCN!" },
  { subscribers: 10_000_000, title: "Media Empire!", emoji: "👑", description: "You've built a media empire! Prestige available!" },
];

export function getNewMilestone(
  subscribers: number,
  celebrated: number[]
): MilestoneDef | null {
  return (
    MILESTONES.find(
      (m) => subscribers >= m.subscribers && !celebrated.includes(m.subscribers)
    ) ?? null
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add game1/src/game/upgrades.ts game1/src/game/categories.ts game1/src/game/milestones.ts
git commit -m "feat: add upgrade, category, and milestone definitions"
```

---

### Task 4: Game Engine (Tick Loop + Click Handler)

**Files:**
- Create: `game1/src/game/engine.ts`

- [ ] **Step 1: Create the game engine**

Create `game1/src/game/engine.ts`:

```ts
import { GameState } from "./state";
import { EQUIPMENT_MULTIPLIERS, SPACE_MULTIPLIERS, TEAM } from "./upgrades";
import { CATEGORIES } from "./categories";

/**
 * Calculate effective views per click based on equipment, space, category, trending, prestige.
 */
export function calcViewsPerClick(state: GameState): number {
  const equipMult = EQUIPMENT_MULTIPLIERS[state.equipmentLevel] ?? 1;
  const spaceMult = SPACE_MULTIPLIERS[state.spaceLevel] ?? 1;
  const categoryMult = CATEGORIES[state.activeCategory]?.viewMultiplier ?? 1;
  const trendingMult = state.activeCategory === state.currentTrending ? 2 : 1;
  const prestigeMult = state.permanentMultiplier;

  return Math.floor(1 * equipMult * spaceMult * categoryMult * trendingMult * prestigeMult);
}

/**
 * Calculate total views per second from team members.
 */
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

/**
 * Calculate subscribers gained from total views.
 * Every 1000 views = ~1 subscriber (with diminishing returns smoothed out).
 */
function calcSubscribers(totalViews: number): number {
  return Math.floor(totalViews / 1000);
}

/**
 * Calculate money from views. Unlocked at 100 subscribers.
 * Rate: $0.001 per view (simplified CPM model).
 */
function calcMoneyPerView(subscribers: number): number {
  if (subscribers < 100) return 0;
  return 0.001;
}

/**
 * Handle a click event. Returns updated state.
 */
export function handleClick(state: GameState): GameState {
  const vpc = calcViewsPerClick(state);
  const newViews = state.views + vpc;
  const newTotalViews = state.totalViews + vpc;
  const newSubscribers = calcSubscribers(newTotalViews);
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

/**
 * Process one game tick (called every second).
 * Adds auto-generated views from team, updates subscribers/money.
 */
export function tick(state: GameState): GameState {
  const vps = calcViewsPerSecond(state);
  if (vps === 0) {
    return { ...state, viewsPerSecond: 0, totalPlayTime: state.totalPlayTime + 1 };
  }

  const newViews = state.views + vps;
  const newTotalViews = state.totalViews + vps;
  const newSubscribers = calcSubscribers(newTotalViews);
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
```

- [ ] **Step 2: Commit**

```bash
git add game1/src/game/engine.ts
git commit -m "feat: add game engine with click handler and tick loop"
```

---

### Task 5: Save/Load & Offline Earnings

**Files:**
- Create: `game1/src/game/save.ts`

- [ ] **Step 1: Create save/load system**

Create `game1/src/game/save.ts`:

```ts
import { GameState, createInitialState } from "./state";
import { calcViewsPerSecond } from "./engine";

const SAVE_KEY = "youtuber-tycoon-save";

export function saveGame(state: GameState): void {
  const toSave = { ...state, lastSaveTime: Date.now(), lastOnlineTime: Date.now() };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Basic validation: check a required field exists
    if (typeof parsed.totalViews !== "number") return null;
    return parsed as GameState;
  } catch {
    return null;
  }
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

/**
 * Calculate offline earnings since last save.
 * Returns { offlineViews, offlineMoney, offlineSeconds }.
 * Cap at 24 hours to prevent absurd numbers.
 */
export function calcOfflineEarnings(state: GameState): {
  offlineViews: number;
  offlineMoney: number;
  offlineSeconds: number;
} {
  const now = Date.now();
  const elapsed = Math.floor((now - state.lastOnlineTime) / 1000);
  const cappedSeconds = Math.min(elapsed, 86400); // max 24h

  if (cappedSeconds < 60) {
    // Less than 1 minute — not worth showing
    return { offlineViews: 0, offlineMoney: 0, offlineSeconds: 0 };
  }

  const vps = calcViewsPerSecond(state);
  const offlineViews = vps * cappedSeconds;
  const moneyPerView = state.subscribers >= 100 ? 0.001 : 0;
  const offlineMoney = offlineViews * moneyPerView;

  return { offlineViews, offlineMoney, offlineSeconds: cappedSeconds };
}
```

- [ ] **Step 2: Commit**

```bash
git add game1/src/game/save.ts
git commit -m "feat: add save/load system with offline earnings"
```

---

### Task 6: Trending, Events, Daily Rewards, Prestige Logic

**Files:**
- Create: `game1/src/game/trending.ts`
- Create: `game1/src/game/events.ts`
- Create: `game1/src/game/daily.ts`
- Create: `game1/src/game/prestige.ts`

- [ ] **Step 1: Create trending system**

Create `game1/src/game/trending.ts`:

```ts
import { CATEGORIES } from "./categories";

const TRENDING_INTERVAL = 30 * 60 * 1000; // 30 minutes

export function shouldRotateTrending(trendingChangedAt: number): boolean {
  return Date.now() - trendingChangedAt >= TRENDING_INTERVAL;
}

export function getNewTrendingCategory(currentTrending: number): number {
  const pool = CATEGORIES.map((c) => c.id).filter((id) => id !== currentTrending);
  return pool[Math.floor(Math.random() * pool.length)];
}
```

- [ ] **Step 2: Create random events**

Create `game1/src/game/events.ts`:

```ts
export interface GameEvent {
  id: string;
  title: string;
  description: string;
  emoji: string;
  effect: "views_boost" | "subscriber_boost" | "subscriber_loss" | "money_boost";
  multiplier: number;
  durationSeconds: number;
}

export const EVENTS: GameEvent[] = [
  {
    id: "algorithm",
    title: "Algorithm Boost!",
    description: "Your video got picked up by the algorithm!",
    emoji: "🚀",
    effect: "views_boost",
    multiplier: 10,
    durationSeconds: 600, // 10 min
  },
  {
    id: "collab",
    title: "Collab Offer!",
    description: "A big creator wants to collab with you!",
    emoji: "🤝",
    effect: "subscriber_boost",
    multiplier: 5,
    durationSeconds: 300,
  },
  {
    id: "hater",
    title: "Hater Attack!",
    description: "Trolls are flooding your comments...",
    emoji: "😡",
    effect: "subscriber_loss",
    multiplier: 0.95, // lose 5% subscribers
    durationSeconds: 0, // instant
  },
  {
    id: "sponsorship",
    title: "Sponsorship Deal!",
    description: "A brand wants to sponsor your video!",
    emoji: "💰",
    effect: "money_boost",
    multiplier: 10,
    durationSeconds: 300,
  },
];

/**
 * Roll for a random event. ~2% chance per tick (called every second).
 * Returns an event or null.
 */
export function rollForEvent(): GameEvent | null {
  if (Math.random() > 0.02) return null;
  // weight toward positive events (75% positive, 25% negative)
  const positiveEvents = EVENTS.filter((e) => e.effect !== "subscriber_loss");
  const negativeEvents = EVENTS.filter((e) => e.effect === "subscriber_loss");
  const pool = Math.random() < 0.75 ? positiveEvents : negativeEvents;
  return pool[Math.floor(Math.random() * pool.length)];
}
```

- [ ] **Step 3: Create daily reward system**

Create `game1/src/game/daily.ts`:

```ts
import { GameState } from "./state";

interface DailyReward {
  day: number;
  description: string;
  emoji: string;
  viewsBonus: number;
  subscriberBonus: number;
}

export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, description: "Views Bonus", emoji: "📺", viewsBonus: 1000, subscriberBonus: 0 },
  { day: 2, description: "Views Bonus x2", emoji: "📺", viewsBonus: 2000, subscriberBonus: 0 },
  { day: 3, description: "Subscriber Boost", emoji: "⭐", viewsBonus: 3000, subscriberBonus: 50 },
  { day: 4, description: "Big Views", emoji: "🔥", viewsBonus: 5000, subscriberBonus: 0 },
  { day: 5, description: "Subscriber Boost x2", emoji: "⭐", viewsBonus: 5000, subscriberBonus: 100 },
  { day: 6, description: "Mega Views", emoji: "💥", viewsBonus: 10000, subscriberBonus: 0 },
  { day: 7, description: "JACKPOT!", emoji: "🎰", viewsBonus: 50000, subscriberBonus: 500 },
];

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
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

  // Check streak
  let newStreak: number;
  if (state.lastDailyClaimDate === yesterday) {
    newStreak = state.dailyStreak + 1;
  } else {
    newStreak = 1;
  }

  // Cycle through 7-day rewards
  const rewardIndex = ((newStreak - 1) % 7);
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
```

- [ ] **Step 4: Create prestige system**

Create `game1/src/game/prestige.ts`:

```ts
import { GameState, createInitialState } from "./state";

export const PRESTIGE_THRESHOLD = 10_000_000; // 10M subscribers

export function canPrestige(state: GameState): boolean {
  return state.subscribers >= PRESTIGE_THRESHOLD;
}

interface PrestigeBonus {
  multiplier: number;
  description: string;
}

export const PRESTIGE_BONUSES: PrestigeBonus[] = [
  { multiplier: 1.5, description: "All earnings +50%" },
  { multiplier: 2.0, description: "All earnings +100%, start with Webcam" },
  { multiplier: 3.0, description: "All earnings +200%, start with Webcam + Editor" },
  { multiplier: 4.5, description: "All earnings +350%, start with DSLR + Editor" },
  { multiplier: 7.0, description: "All earnings +600%, start with DSLR + full team" },
];

export function getPrestigeBonus(prestigeCount: number): PrestigeBonus {
  const index = Math.min(prestigeCount, PRESTIGE_BONUSES.length - 1);
  return PRESTIGE_BONUSES[index];
}

export function performPrestige(state: GameState): GameState {
  const newPrestigeCount = state.prestigeCount + 1;
  const bonus = getPrestigeBonus(newPrestigeCount);
  const fresh = createInitialState();

  return {
    ...fresh,
    prestigeCount: newPrestigeCount,
    permanentMultiplier: bonus.multiplier,
    // Apply prestige starting bonuses
    equipmentLevel: newPrestigeCount >= 3 ? 2 : newPrestigeCount >= 1 ? 1 : 0,
    team: {
      editor: newPrestigeCount >= 2,
      thumbnail: newPrestigeCount >= 4,
      manager: newPrestigeCount >= 4,
      pd: newPrestigeCount >= 4,
    },
    // Preserve meta
    lastDailyClaimDate: state.lastDailyClaimDate,
    dailyStreak: state.dailyStreak,
  };
}
```

- [ ] **Step 5: Commit**

```bash
git add game1/src/game/trending.ts game1/src/game/events.ts game1/src/game/daily.ts game1/src/game/prestige.ts
git commit -m "feat: add trending, events, daily rewards, and prestige systems"
```

---

### Task 7: Comment Generation

**Files:**
- Create: `game1/src/game/comments.ts`

- [ ] **Step 1: Create comment generator**

Create `game1/src/game/comments.ts`:

```ts
interface CommentPool {
  maxSubscribers: number;
  comments: string[];
}

const COMMENT_POOLS: CommentPool[] = [
  {
    maxSubscribers: 100,
    comments: [
      "First comment!",
      "Nice video 👍",
      "Keep it up!",
      "Subscribed!",
      "Great content",
      "How do you edit?",
      "Love this",
      "More please!",
      "Found this channel randomly",
      "Underrated creator",
    ],
  },
  {
    maxSubscribers: 10_000,
    comments: [
      "This channel is growing fast",
      "Been here since 100 subs!",
      "The quality is insane",
      "Notification squad 🔔",
      "Who's watching in 2026?",
      "Better than TV honestly",
      "Daily viewer here",
      "Your editing got so much better",
      "Collab with someone!",
      "ㅋㅋㅋ this is so funny",
      "구독 박았습니다",
      "I shared this with everyone",
    ],
  },
  {
    maxSubscribers: 1_000_000,
    comments: [
      "LEGEND",
      "You deserve 10M subs",
      "Watching this for the 5th time",
      "This is peak content",
      "The algorithm brought me here",
      "Bro fell off (jk still goated)",
      "Make this a series PLEASE",
      "I literally can't stop watching",
      "Your old videos were better tbh",
      "Drop the merch already",
      "영상 퀄리티 미쳤다",
      "Real",
    ],
  },
  {
    maxSubscribers: Infinity,
    comments: [
      "WE LOVE YOU",
      "10M LET'S GOOO",
      "Been here since day one 🥹",
      "Greatest creator of all time",
      "This deserves an award",
      "You changed my life honestly",
      "The GOAT",
      "History is being made",
      "I'm crying rn",
      "GOAT GOAT GOAT",
      "전설이다 진짜",
      "King of YouTube 👑",
    ],
  },
];

// Small chance of a hater comment at any tier
const HATER_COMMENTS = [
  "Overrated...",
  "Mid content",
  "I don't get the hype",
  "Unsubscribed",
  "Clickbait...",
  "You sold out",
  "Boring 🥱",
  "Not funny",
];

export function generateComment(subscribers: number): string {
  // 10% chance of hater comment
  if (Math.random() < 0.1) {
    return HATER_COMMENTS[Math.floor(Math.random() * HATER_COMMENTS.length)];
  }

  const pool = COMMENT_POOLS.find((p) => subscribers < p.maxSubscribers) ?? COMMENT_POOLS[COMMENT_POOLS.length - 1];
  return pool.comments[Math.floor(Math.random() * pool.comments.length)];
}

/**
 * How many ms between comments based on subscriber count.
 * More subscribers = faster comments.
 */
export function getCommentInterval(subscribers: number): number {
  if (subscribers < 100) return 5000;
  if (subscribers < 1_000) return 3000;
  if (subscribers < 10_000) return 2000;
  if (subscribers < 100_000) return 1000;
  if (subscribers < 1_000_000) return 500;
  return 200;
}
```

- [ ] **Step 2: Commit**

```bash
git add game1/src/game/comments.ts
git commit -m "feat: add comment generation system"
```

---

### Task 8: React Game Hook (useGame)

**Files:**
- Create: `game1/src/game/useGame.ts`

- [ ] **Step 1: Create the main game hook**

This hook ties all game systems together into a single React hook that components consume.

Create `game1/src/game/useGame.ts`:

```ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GameState, createInitialState } from "./state";
import { handleClick, tick, calcViewsPerClick, calcViewsPerSecond } from "./engine";
import { saveGame, loadGame, calcOfflineEarnings } from "./save";
import { shouldRotateTrending, getNewTrendingCategory } from "./trending";
import { rollForEvent, GameEvent } from "./events";
import { canClaimDaily, claimDaily, DAILY_REWARDS } from "./daily";
import { getNewMilestone, MilestoneDef } from "./milestones";
import { EQUIPMENT, EQUIPMENT_MULTIPLIERS, SPACES, SPACE_MULTIPLIERS, TEAM, TeamMemberDef } from "./upgrades";
import { CATEGORIES } from "./categories";
import { canPrestige, performPrestige } from "./prestige";

export interface OfflineReport {
  offlineViews: number;
  offlineMoney: number;
  offlineSeconds: number;
}

export interface ActiveEvent {
  event: GameEvent;
  expiresAt: number; // timestamp ms
}

export function useGame() {
  const [state, setState] = useState<GameState | null>(null);
  const [offlineReport, setOfflineReport] = useState<OfflineReport | null>(null);
  const [milestone, setMilestone] = useState<MilestoneDef | null>(null);
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);
  const [showDaily, setShowDaily] = useState(false);
  const stateRef = useRef<GameState | null>(null);

  // Keep ref in sync for interval callbacks
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Load game on mount
  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      const offline = calcOfflineEarnings(saved);
      const loaded: GameState = {
        ...saved,
        views: saved.views + offline.offlineViews,
        totalViews: saved.totalViews + offline.offlineViews,
        money: saved.money + offline.offlineMoney,
        lastOnlineTime: Date.now(),
      };
      // Recalculate subscribers after adding offline views
      loaded.subscribers = Math.floor(loaded.totalViews / 1000);
      setState(loaded);
      if (offline.offlineViews > 0) {
        setOfflineReport(offline);
      }
      if (canClaimDaily(loaded)) {
        setShowDaily(true);
      }
    } else {
      const initial = createInitialState();
      setState(initial);
      setShowDaily(true); // First day
    }
  }, []);

  // Game tick loop (1 second)
  useEffect(() => {
    if (!state) return;

    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev) return prev;
        let next = tick(prev);

        // Trending rotation
        if (shouldRotateTrending(next.trendingChangedAt)) {
          next = {
            ...next,
            currentTrending: getNewTrendingCategory(next.currentTrending),
            trendingChangedAt: Date.now(),
          };
        }

        // Random events (only if no active event)
        if (!activeEvent || Date.now() > activeEvent.expiresAt) {
          const event = rollForEvent();
          if (event) {
            if (event.effect === "subscriber_loss") {
              next = {
                ...next,
                subscribers: Math.floor(next.subscribers * event.multiplier),
              };
            }
            if (event.durationSeconds > 0) {
              setActiveEvent({
                event,
                expiresAt: Date.now() + event.durationSeconds * 1000,
              });
            } else {
              setActiveEvent({ event, expiresAt: Date.now() + 3000 }); // show for 3s
            }
          }
        }

        // Check milestones
        const newMilestone = getNewMilestone(next.subscribers, next.celebratedMilestones);
        if (newMilestone) {
          setMilestone(newMilestone);
          next = {
            ...next,
            celebratedMilestones: [...next.celebratedMilestones, newMilestone.subscribers],
          };
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state !== null, activeEvent]);

  // Auto-save every 10 seconds
  useEffect(() => {
    if (!state) return;
    const interval = setInterval(() => {
      if (stateRef.current) saveGame(stateRef.current);
    }, 10000);
    return () => clearInterval(interval);
  }, [state !== null]);

  const click = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      let next = handleClick(prev);

      // Apply active event boost
      if (activeEvent && Date.now() < activeEvent.expiresAt) {
        if (activeEvent.event.effect === "views_boost") {
          const bonus = (next.viewsPerClick ?? 1) * (activeEvent.event.multiplier - 1);
          next = {
            ...next,
            views: next.views + bonus,
            totalViews: next.totalViews + bonus,
          };
        }
      }

      return next;
    });
  }, [activeEvent]);

  const buyEquipment = useCallback((level: number) => {
    setState((prev) => {
      if (!prev) return prev;
      if (level <= prev.equipmentLevel) return prev;
      const cost = EQUIPMENT[level].cost;
      if (prev.money < cost) return prev;
      const next = { ...prev, money: prev.money - cost, equipmentLevel: level };
      next.viewsPerClick = calcViewsPerClick(next);
      return next;
    });
  }, []);

  const buySpace = useCallback((level: number) => {
    setState((prev) => {
      if (!prev) return prev;
      if (level <= prev.spaceLevel) return prev;
      const cost = SPACES[level].cost;
      if (prev.money < cost) return prev;
      return { ...prev, money: prev.money - cost, spaceLevel: level };
    });
  }, []);

  const hireTeam = useCallback((memberId: keyof GameState["team"]) => {
    setState((prev) => {
      if (!prev) return prev;
      if (prev.team[memberId]) return prev;
      const def = TEAM.find((t) => t.id === memberId);
      if (!def) return prev;
      if (prev.money < def.cost) return prev;
      if (prev.subscribers < def.unlockSubscribers) return prev;
      return {
        ...prev,
        money: prev.money - def.cost,
        team: { ...prev.team, [memberId]: true },
      };
    });
  }, []);

  const unlockCategory = useCallback((categoryId: number) => {
    setState((prev) => {
      if (!prev) return prev;
      if (prev.unlockedCategories.includes(categoryId)) return prev;
      const cat = CATEGORIES[categoryId];
      if (!cat) return prev;
      if (prev.subscribers < cat.unlockSubscribers) return prev;
      return {
        ...prev,
        unlockedCategories: [...prev.unlockedCategories, categoryId],
      };
    });
  }, []);

  const setActiveCategory = useCallback((categoryId: number) => {
    setState((prev) => {
      if (!prev) return prev;
      if (!prev.unlockedCategories.includes(categoryId)) return prev;
      return { ...prev, activeCategory: categoryId };
    });
  }, []);

  const claimDailyReward = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      if (!canClaimDaily(prev)) return prev;
      const { state: newState } = claimDaily(prev);
      return newState;
    });
    setShowDaily(false);
  }, []);

  const prestige = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      if (!canPrestige(prev)) return prev;
      return performPrestige(prev);
    });
  }, []);

  const dismissOffline = useCallback(() => setOfflineReport(null), []);
  const dismissMilestone = useCallback(() => setMilestone(null), []);
  const dismissDaily = useCallback(() => setShowDaily(false), []);

  return {
    state,
    offlineReport,
    milestone,
    activeEvent,
    showDaily,
    click,
    buyEquipment,
    buySpace,
    hireTeam,
    unlockCategory,
    setActiveCategory,
    claimDailyReward,
    prestige,
    dismissOffline,
    dismissMilestone,
    dismissDaily,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add game1/src/game/useGame.ts
git commit -m "feat: add useGame hook wiring all game systems together"
```

---

### Task 9: UI Components — StatsBar, ClickButton, MilestoneBar

**Files:**
- Create: `game1/src/components/StatsBar.tsx`
- Create: `game1/src/components/ClickButton.tsx`
- Create: `game1/src/components/MilestoneBar.tsx`

- [ ] **Step 1: Create StatsBar**

Create `game1/src/components/StatsBar.tsx`:

```tsx
"use client";

import { GameState } from "@/game/state";
import { formatNumber, formatMoney } from "@/game/format";
import { CATEGORIES } from "@/game/categories";

interface Props {
  state: GameState;
}

export function StatsBar({ state }: Props) {
  const trending = CATEGORIES[state.currentTrending];

  return (
    <div className="px-4 py-3 bg-gray-800/80 backdrop-blur border-b border-gray-700">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-lg font-bold">
            <span className="text-yellow-400">★</span> {formatNumber(state.subscribers)} subs
          </div>
          <div className="text-sm text-gray-400">
            ▶ {formatNumber(state.views)} views &nbsp;
            {state.subscribers >= 100 && (
              <span className="text-green-400">{formatMoney(state.money)}</span>
            )}
          </div>
        </div>
        <div className="text-right">
          {state.viewsPerSecond > 0 && (
            <div className="text-xs text-gray-400">
              +{formatNumber(state.viewsPerSecond)}/s
            </div>
          )}
          {trending && (
            <div className="text-xs text-orange-400">
              🔥 Trending: {trending.emoji} {trending.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create ClickButton**

Create `game1/src/components/ClickButton.tsx`:

```tsx
"use client";

import { useState, useCallback } from "react";
import { formatNumber } from "@/game/format";

interface FloatingNumber {
  id: number;
  value: number;
  x: number;
  y: number;
}

let nextId = 0;

interface Props {
  viewsPerClick: number;
  onClick: () => void;
}

export function ClickButton({ viewsPerClick, onClick }: Props) {
  const [floats, setFloats] = useState<FloatingNumber[]>([]);

  const handleClick = useCallback(() => {
    onClick();
    const id = nextId++;
    const x = 40 + Math.random() * 20; // 40-60% horizontal
    const y = Math.random() * 20; // 0-20% from top of button area
    setFloats((prev) => [...prev.slice(-10), { id, value: viewsPerClick, x, y }]);
    setTimeout(() => {
      setFloats((prev) => prev.filter((f) => f.id !== id));
    }, 1000);
  }, [viewsPerClick, onClick]);

  return (
    <div className="relative flex items-center justify-center py-4">
      {/* Floating numbers */}
      {floats.map((f) => (
        <span
          key={f.id}
          className="absolute text-yellow-300 font-bold text-lg pointer-events-none animate-float"
          style={{ left: `${f.x}%`, top: `${f.y}%` }}
        >
          +{formatNumber(f.value)}
        </span>
      ))}

      <button
        onClick={handleClick}
        className="
          px-8 py-4 rounded-2xl text-xl font-bold
          bg-gradient-to-b from-red-500 to-red-700
          active:from-red-600 active:to-red-800 active:scale-95
          transition-transform duration-75
          shadow-lg shadow-red-900/50
        "
      >
        📹 Upload Video!
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Create MilestoneBar**

Create `game1/src/components/MilestoneBar.tsx`:

```tsx
"use client";

import { GameState } from "@/game/state";
import { MILESTONES } from "@/game/milestones";
import { formatNumber } from "@/game/format";

interface Props {
  state: GameState;
}

export function MilestoneBar({ state }: Props) {
  // Find next uncelebrated milestone
  const next = MILESTONES.find((m) => state.subscribers < m.subscribers);
  if (!next) return null;

  // Find previous milestone threshold (or 0)
  const prevIdx = MILESTONES.indexOf(next) - 1;
  const prevThreshold = prevIdx >= 0 ? MILESTONES[prevIdx].subscribers : 0;

  const progress = Math.min(
    ((state.subscribers - prevThreshold) / (next.subscribers - prevThreshold)) * 100,
    100
  );

  return (
    <div className="px-4 py-2">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Next: {next.emoji} {next.title}</span>
        <span>{formatNumber(state.subscribers)} / {formatNumber(next.subscribers)}</span>
      </div>
      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Add float animation to globals.css**

Add to end of `game1/src/app/globals.css`:

```css
@keyframes float-up {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px);
  }
}

.animate-float {
  animation: float-up 1s ease-out forwards;
}
```

- [ ] **Step 5: Commit**

```bash
git add game1/src/components/StatsBar.tsx game1/src/components/ClickButton.tsx game1/src/components/MilestoneBar.tsx game1/src/app/globals.css
git commit -m "feat: add StatsBar, ClickButton, and MilestoneBar components"
```

---

### Task 10: UI Components — CommentFeed, StudioView, BottomNav

**Files:**
- Create: `game1/src/components/CommentFeed.tsx`
- Create: `game1/src/components/StudioView.tsx`
- Create: `game1/src/components/BottomNav.tsx`

- [ ] **Step 1: Create CommentFeed**

Create `game1/src/components/CommentFeed.tsx`:

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { generateComment, getCommentInterval } from "@/game/comments";

interface Comment {
  id: number;
  text: string;
}

let commentId = 0;

interface Props {
  subscribers: number;
}

export function CommentFeed({ subscribers }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const text = generateComment(subscribers);
      setComments((prev) => {
        const next = [...prev, { id: commentId++, text }];
        return next.slice(-20); // Keep last 20
      });
    }, getCommentInterval(subscribers));

    return () => clearInterval(interval);
  }, [subscribers]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [comments]);

  return (
    <div
      ref={containerRef}
      className="mx-4 h-28 overflow-hidden rounded-lg bg-gray-800/60 border border-gray-700/50 px-3 py-2"
    >
      {comments.map((c) => (
        <div
          key={c.id}
          className="text-sm py-0.5 animate-fade-in"
        >
          <span className="text-gray-500">●</span>{" "}
          <span className="text-gray-300">{c.text}</span>
        </div>
      ))}
      {comments.length === 0 && (
        <div className="text-gray-500 text-sm">Waiting for comments...</div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create StudioView**

Create `game1/src/components/StudioView.tsx`:

```tsx
"use client";

import { SPACES } from "@/game/upgrades";

interface Props {
  spaceLevel: number;
  equipmentLevel: number;
}

const SPACE_EMOJIS = ["🏠", "🖥️", "🏢", "🎬"];
const EQUIP_EMOJIS = ["📱", "📷", "📸", "🎥"];

export function StudioView({ spaceLevel, equipmentLevel }: Props) {
  const space = SPACES[spaceLevel];
  const spaceEmoji = SPACE_EMOJIS[spaceLevel] ?? "🏠";
  const equipEmoji = EQUIP_EMOJIS[equipmentLevel] ?? "📱";

  return (
    <div className="flex flex-col items-center justify-center py-4 gap-2">
      <div className="text-5xl">{spaceEmoji}</div>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{equipEmoji}</span>
        <span className="text-sm text-gray-400">{space.name}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create BottomNav**

Create `game1/src/components/BottomNav.tsx`:

```tsx
"use client";

export type TabId = "equipment" | "team" | "channel" | "shop";

interface Props {
  activeTab: TabId | null;
  onTabChange: (tab: TabId | null) => void;
}

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: "equipment", label: "Equipment", emoji: "📷" },
  { id: "team", label: "Team", emoji: "👥" },
  { id: "channel", label: "Channel", emoji: "📺" },
  { id: "shop", label: "Shop", emoji: "🛒" },
];

export function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="flex border-t border-gray-700 bg-gray-800/90 backdrop-blur">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(activeTab === tab.id ? null : tab.id)}
          className={`
            flex-1 py-3 text-center text-xs font-medium transition-colors
            ${activeTab === tab.id
              ? "text-red-400 bg-gray-700/50"
              : "text-gray-400 active:text-gray-200"
            }
          `}
        >
          <div className="text-lg">{tab.emoji}</div>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
```

- [ ] **Step 4: Add fade-in animation to globals.css**

Add to end of `game1/src/app/globals.css`:

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
```

- [ ] **Step 5: Commit**

```bash
git add game1/src/components/CommentFeed.tsx game1/src/components/StudioView.tsx game1/src/components/BottomNav.tsx game1/src/app/globals.css
git commit -m "feat: add CommentFeed, StudioView, and BottomNav components"
```

---

### Task 11: Panel Components (Equipment, Team, Channel, Shop)

**Files:**
- Create: `game1/src/components/panels/EquipmentPanel.tsx`
- Create: `game1/src/components/panels/TeamPanel.tsx`
- Create: `game1/src/components/panels/ChannelPanel.tsx`
- Create: `game1/src/components/panels/ShopPanel.tsx`

- [ ] **Step 1: Create EquipmentPanel**

Create `game1/src/components/panels/EquipmentPanel.tsx`:

```tsx
"use client";

import { EQUIPMENT, SPACES } from "@/game/upgrades";
import { formatMoney } from "@/game/format";
import { GameState } from "@/game/state";

interface Props {
  state: GameState;
  onBuyEquipment: (level: number) => void;
  onBuySpace: (level: number) => void;
}

export function EquipmentPanel({ state, onBuyEquipment, onBuySpace }: Props) {
  return (
    <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
      <h3 className="text-sm font-bold text-gray-400 uppercase">Camera</h3>
      {EQUIPMENT.map((eq, i) => {
        const owned = i <= state.equipmentLevel;
        const canBuy = !owned && i === state.equipmentLevel + 1 && state.money >= eq.cost;
        return (
          <button
            key={eq.id}
            disabled={owned || !canBuy}
            onClick={() => canBuy && onBuyEquipment(i)}
            className={`
              w-full text-left p-3 rounded-lg border transition-colors
              ${owned
                ? "border-green-600/50 bg-green-900/20 text-green-400"
                : canBuy
                  ? "border-yellow-600/50 bg-yellow-900/20 text-yellow-300 active:bg-yellow-900/40"
                  : "border-gray-700 bg-gray-800/50 text-gray-500"
              }
            `}
          >
            <div className="flex justify-between">
              <span className="font-medium">{eq.name}</span>
              {owned ? <span className="text-green-400 text-sm">Owned</span> : <span className="text-sm">{formatMoney(eq.cost)}</span>}
            </div>
            <div className="text-xs mt-1 opacity-70">{eq.effect}</div>
          </button>
        );
      })}

      <h3 className="text-sm font-bold text-gray-400 uppercase pt-2">Studio</h3>
      {SPACES.map((sp, i) => {
        const owned = i <= state.spaceLevel;
        const canBuy = !owned && i === state.spaceLevel + 1 && state.money >= sp.cost;
        return (
          <button
            key={sp.id}
            disabled={owned || !canBuy}
            onClick={() => canBuy && onBuySpace(i)}
            className={`
              w-full text-left p-3 rounded-lg border transition-colors
              ${owned
                ? "border-green-600/50 bg-green-900/20 text-green-400"
                : canBuy
                  ? "border-yellow-600/50 bg-yellow-900/20 text-yellow-300 active:bg-yellow-900/40"
                  : "border-gray-700 bg-gray-800/50 text-gray-500"
              }
            `}
          >
            <div className="flex justify-between">
              <span className="font-medium">{sp.name}</span>
              {owned ? <span className="text-green-400 text-sm">Owned</span> : <span className="text-sm">{formatMoney(sp.cost)}</span>}
            </div>
            <div className="text-xs mt-1 opacity-70">{sp.effect}</div>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create TeamPanel**

Create `game1/src/components/panels/TeamPanel.tsx`:

```tsx
"use client";

import { TEAM } from "@/game/upgrades";
import { formatMoney, formatNumber } from "@/game/format";
import { GameState } from "@/game/state";

interface Props {
  state: GameState;
  onHire: (memberId: keyof GameState["team"]) => void;
}

export function TeamPanel({ state, onHire }: Props) {
  return (
    <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
      <h3 className="text-sm font-bold text-gray-400 uppercase">Team Members</h3>
      {TEAM.map((member) => {
        const owned = state.team[member.id];
        const meetsSubscribers = state.subscribers >= member.unlockSubscribers;
        const canAfford = state.money >= member.cost;
        const canBuy = !owned && meetsSubscribers && canAfford;
        const locked = !owned && !meetsSubscribers;

        return (
          <button
            key={member.id}
            disabled={owned || !canBuy}
            onClick={() => canBuy && onHire(member.id)}
            className={`
              w-full text-left p-3 rounded-lg border transition-colors
              ${owned
                ? "border-green-600/50 bg-green-900/20 text-green-400"
                : canBuy
                  ? "border-yellow-600/50 bg-yellow-900/20 text-yellow-300 active:bg-yellow-900/40"
                  : "border-gray-700 bg-gray-800/50 text-gray-500"
              }
            `}
          >
            <div className="flex justify-between">
              <span className="font-medium">{member.name}</span>
              {owned ? (
                <span className="text-green-400 text-sm">Hired</span>
              ) : locked ? (
                <span className="text-sm">🔒 {formatNumber(member.unlockSubscribers)} subs</span>
              ) : (
                <span className="text-sm">{formatMoney(member.cost)}</span>
              )}
            </div>
            <div className="text-xs mt-1 opacity-70">
              {member.description} (+{formatNumber(member.vps)} views/s)
            </div>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Create ChannelPanel**

Create `game1/src/components/panels/ChannelPanel.tsx`:

```tsx
"use client";

import { CATEGORIES } from "@/game/categories";
import { formatNumber } from "@/game/format";
import { GameState } from "@/game/state";

interface Props {
  state: GameState;
  onUnlock: (categoryId: number) => void;
  onSetActive: (categoryId: number) => void;
}

export function ChannelPanel({ state, onUnlock, onSetActive }: Props) {
  return (
    <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
      <h3 className="text-sm font-bold text-gray-400 uppercase">Video Categories</h3>
      {CATEGORIES.map((cat) => {
        const unlocked = state.unlockedCategories.includes(cat.id);
        const active = state.activeCategory === cat.id;
        const canUnlock = !unlocked && state.subscribers >= cat.unlockSubscribers;
        const isTrending = state.currentTrending === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => {
              if (unlocked) onSetActive(cat.id);
              else if (canUnlock) onUnlock(cat.id);
            }}
            disabled={!unlocked && !canUnlock}
            className={`
              w-full text-left p-3 rounded-lg border transition-colors
              ${active
                ? "border-red-500 bg-red-900/30 text-red-300"
                : unlocked
                  ? "border-gray-600 bg-gray-800/50 text-gray-200 active:bg-gray-700/50"
                  : canUnlock
                    ? "border-yellow-600/50 bg-yellow-900/20 text-yellow-300 active:bg-yellow-900/40"
                    : "border-gray-700 bg-gray-800/50 text-gray-500"
              }
            `}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {cat.emoji} {cat.name}
                {isTrending && <span className="ml-2 text-orange-400 text-xs">🔥 TRENDING</span>}
              </span>
              {active ? (
                <span className="text-red-400 text-xs font-bold">ACTIVE</span>
              ) : !unlocked ? (
                <span className="text-sm">🔒 {formatNumber(cat.unlockSubscribers)} subs</span>
              ) : null}
            </div>
            <div className="text-xs mt-1 opacity-70">
              {cat.viewMultiplier}x views {isTrending && "(2x trending bonus!)"}
            </div>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Create ShopPanel**

Create `game1/src/components/panels/ShopPanel.tsx`:

```tsx
"use client";

export function ShopPanel() {
  return (
    <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
      <h3 className="text-sm font-bold text-gray-400 uppercase">Shop</h3>

      <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400">
        <div className="font-medium">🚫 Remove Ads — $2.99</div>
        <div className="text-xs mt-1">Coming soon</div>
      </div>

      <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400">
        <div className="font-medium">⭐ Premium Pass — $4.99/mo</div>
        <div className="text-xs mt-1">2x earnings + exclusive content. Coming soon</div>
      </div>

      <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400">
        <div className="font-medium">🚀 Boost Pack — $0.99</div>
        <div className="text-xs mt-1">Instant subscribers. Coming soon</div>
      </div>

      <p className="text-xs text-gray-500 text-center pt-2">
        Payment integration will be added when the game reaches traction.
      </p>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add game1/src/components/panels/
git commit -m "feat: add Equipment, Team, Channel, and Shop panels"
```

---

### Task 12: Modal Components

**Files:**
- Create: `game1/src/components/modals/OfflineModal.tsx`
- Create: `game1/src/components/modals/MilestoneModal.tsx`
- Create: `game1/src/components/modals/EventModal.tsx`
- Create: `game1/src/components/modals/DailyRewardModal.tsx`
- Create: `game1/src/components/modals/PrestigeModal.tsx`
- Create: `game1/src/components/modals/SettingsModal.tsx`

- [ ] **Step 1: Create a shared Modal wrapper**

Create `game1/src/components/modals/Modal.tsx`:

```tsx
"use client";

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-2xl border border-gray-600 p-6 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create OfflineModal**

Create `game1/src/components/modals/OfflineModal.tsx`:

```tsx
"use client";

import { Modal } from "./Modal";
import { formatNumber } from "@/game/format";
import { OfflineReport } from "@/game/useGame";

interface Props {
  report: OfflineReport;
  onClose: () => void;
}

export function OfflineModal({ report, onClose }: Props) {
  const hours = Math.floor(report.offlineSeconds / 3600);
  const minutes = Math.floor((report.offlineSeconds % 3600) / 60);

  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div className="text-4xl mb-3">💤</div>
        <h2 className="text-xl font-bold mb-2">Welcome Back!</h2>
        <p className="text-gray-400 mb-4">
          While you were away ({hours > 0 ? `${hours}h ` : ""}{minutes}m)...
        </p>
        <div className="bg-gray-700/50 rounded-lg p-4 mb-4 space-y-2">
          <div className="text-lg font-bold text-yellow-400">
            +{formatNumber(report.offlineViews)} views
          </div>
          {report.offlineMoney > 0 && (
            <div className="text-green-400">
              +${formatNumber(report.offlineMoney)}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 bg-red-600 rounded-lg font-bold active:bg-red-700 transition-colors"
        >
          Collect!
        </button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 3: Create MilestoneModal**

Create `game1/src/components/modals/MilestoneModal.tsx`:

```tsx
"use client";

import { Modal } from "./Modal";
import { MilestoneDef } from "@/game/milestones";

interface Props {
  milestone: MilestoneDef;
  onClose: () => void;
}

export function MilestoneModal({ milestone, onClose }: Props) {
  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div className="text-6xl mb-3">{milestone.emoji}</div>
        <h2 className="text-2xl font-bold mb-2">{milestone.title}</h2>
        <p className="text-gray-400 mb-6">{milestone.description}</p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-yellow-600 rounded-lg font-bold active:bg-yellow-700 transition-colors"
        >
          Awesome!
        </button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 4: Create EventModal**

Create `game1/src/components/modals/EventModal.tsx`:

```tsx
"use client";

import { ActiveEvent } from "@/game/useGame";

interface Props {
  activeEvent: ActiveEvent;
}

export function EventModal({ activeEvent }: Props) {
  const { event } = activeEvent;
  const remaining = Math.max(0, Math.floor((activeEvent.expiresAt - Date.now()) / 1000));

  if (remaining <= 0) return null;

  const isNegative = event.effect === "subscriber_loss";

  return (
    <div
      className={`
        mx-4 px-4 py-2 rounded-lg text-sm font-medium text-center
        ${isNegative ? "bg-red-900/60 text-red-300" : "bg-green-900/60 text-green-300"}
      `}
    >
      {event.emoji} {event.title}
      {event.durationSeconds > 0 && (
        <span className="ml-2 opacity-70">({Math.floor(remaining / 60)}:{(remaining % 60).toString().padStart(2, "0")})</span>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create DailyRewardModal**

Create `game1/src/components/modals/DailyRewardModal.tsx`:

```tsx
"use client";

import { Modal } from "./Modal";
import { DAILY_REWARDS } from "@/game/daily";
import { formatNumber } from "@/game/format";

interface Props {
  streak: number;
  onClaim: () => void;
  onClose: () => void;
}

export function DailyRewardModal({ streak, onClaim, onClose }: Props) {
  const rewardIndex = streak % 7; // next reward
  const reward = DAILY_REWARDS[rewardIndex];

  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div className="text-4xl mb-3">🎁</div>
        <h2 className="text-xl font-bold mb-1">Daily Reward!</h2>
        <p className="text-gray-400 text-sm mb-4">Day {streak + 1} streak</p>

        <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
          <div className="text-3xl mb-2">{reward.emoji}</div>
          <div className="font-bold">{reward.description}</div>
          <div className="text-sm text-gray-400 mt-1">
            +{formatNumber(reward.viewsBonus)} views
            {reward.subscriberBonus > 0 && ` +${formatNumber(reward.subscriberBonus)} subs`}
          </div>
        </div>

        <button
          onClick={onClaim}
          className="w-full py-3 bg-green-600 rounded-lg font-bold active:bg-green-700 transition-colors"
        >
          Claim!
        </button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 6: Create PrestigeModal**

Create `game1/src/components/modals/PrestigeModal.tsx`:

```tsx
"use client";

import { Modal } from "./Modal";
import { getPrestigeBonus } from "@/game/prestige";

interface Props {
  prestigeCount: number;
  onPrestige: () => void;
  onClose: () => void;
}

export function PrestigeModal({ prestigeCount, onPrestige, onClose }: Props) {
  const nextBonus = getPrestigeBonus(prestigeCount + 1);

  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div className="text-5xl mb-3">🔄</div>
        <h2 className="text-xl font-bold mb-2">New Channel (Prestige)?</h2>
        <p className="text-gray-400 text-sm mb-4">
          Start over with permanent bonuses. All progress will be reset, but you will grow much faster.
        </p>

        <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
          <div className="font-bold text-yellow-400">{nextBonus.description}</div>
          <div className="text-xs text-gray-400 mt-1">
            Prestige #{prestigeCount + 1}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-600 rounded-lg font-bold active:bg-gray-700 transition-colors"
          >
            Not Yet
          </button>
          <button
            onClick={() => {
              onPrestige();
              onClose();
            }}
            className="flex-1 py-3 bg-purple-600 rounded-lg font-bold active:bg-purple-700 transition-colors"
          >
            Prestige!
          </button>
        </div>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 7: Create SettingsModal**

Create `game1/src/components/modals/SettingsModal.tsx`:

```tsx
"use client";

import { Modal } from "./Modal";
import { deleteSave } from "@/game/save";

interface Props {
  prestigeCount: number;
  totalClicks: number;
  totalPlayTime: number;
  canPrestige: boolean;
  onPrestigeOpen: () => void;
  onClose: () => void;
}

export function SettingsModal({
  prestigeCount,
  totalClicks,
  totalPlayTime,
  canPrestige,
  onPrestigeOpen,
  onClose,
}: Props) {
  const hours = Math.floor(totalPlayTime / 3600);
  const minutes = Math.floor((totalPlayTime % 3600) / 60);

  return (
    <Modal onClose={onClose}>
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">Settings</h2>

        <div className="space-y-2 text-sm text-gray-400 mb-4">
          <div>Prestige: {prestigeCount}x</div>
          <div>Total Clicks: {totalClicks.toLocaleString()}</div>
          <div>Play Time: {hours}h {minutes}m</div>
        </div>

        {canPrestige && (
          <button
            onClick={() => {
              onClose();
              onPrestigeOpen();
            }}
            className="w-full py-3 mb-3 bg-purple-600 rounded-lg font-bold active:bg-purple-700 transition-colors"
          >
            🔄 New Channel (Prestige)
          </button>
        )}

        <button
          onClick={() => {
            if (confirm("Are you sure? This will delete ALL your progress!")) {
              deleteSave();
              window.location.reload();
            }
          }}
          className="w-full py-3 mb-3 bg-red-900/50 text-red-400 rounded-lg font-bold active:bg-red-900 transition-colors"
        >
          Reset All Data
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-600 rounded-lg font-bold active:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add game1/src/components/modals/
git commit -m "feat: add all modal components (offline, milestone, event, daily, prestige, settings)"
```

---

### Task 13: Main Game Component — Wire Everything Together

**Files:**
- Create: `game1/src/components/Game.tsx`
- Modify: `game1/src/app/page.tsx`

- [ ] **Step 1: Create the Game component**

Create `game1/src/components/Game.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useGame } from "@/game/useGame";
import { canPrestige as checkPrestige } from "@/game/prestige";
import { StatsBar } from "./StatsBar";
import { CommentFeed } from "./CommentFeed";
import { StudioView } from "./StudioView";
import { ClickButton } from "./ClickButton";
import { MilestoneBar } from "./MilestoneBar";
import { BottomNav, TabId } from "./BottomNav";
import { EquipmentPanel } from "./panels/EquipmentPanel";
import { TeamPanel } from "./panels/TeamPanel";
import { ChannelPanel } from "./panels/ChannelPanel";
import { ShopPanel } from "./panels/ShopPanel";
import { OfflineModal } from "./modals/OfflineModal";
import { MilestoneModal } from "./modals/MilestoneModal";
import { EventModal } from "./modals/EventModal";
import { DailyRewardModal } from "./modals/DailyRewardModal";
import { PrestigeModal } from "./modals/PrestigeModal";
import { SettingsModal } from "./modals/SettingsModal";

export function Game() {
  const game = useGame();
  const [activeTab, setActiveTab] = useState<TabId | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrestige, setShowPrestige] = useState(false);

  if (!game.state) {
    return (
      <div className="min-h-dvh bg-gray-900 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  const { state } = game;

  return (
    <div className="min-h-dvh bg-gray-900 flex flex-col max-w-md mx-auto">
      {/* Stats */}
      <StatsBar state={state} />

      {/* Active Event Banner */}
      {game.activeEvent && <EventModal activeEvent={game.activeEvent} />}

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-between py-2">
        <CommentFeed subscribers={state.subscribers} />
        <StudioView spaceLevel={state.spaceLevel} equipmentLevel={state.equipmentLevel} />
        <ClickButton viewsPerClick={state.viewsPerClick || 1} onClick={game.click} />
        <MilestoneBar state={state} />
      </div>

      {/* Panel Area */}
      {activeTab === "equipment" && (
        <EquipmentPanel state={state} onBuyEquipment={game.buyEquipment} onBuySpace={game.buySpace} />
      )}
      {activeTab === "team" && (
        <TeamPanel state={state} onHire={game.hireTeam} />
      )}
      {activeTab === "channel" && (
        <ChannelPanel state={state} onUnlock={game.unlockCategory} onSetActive={game.setActiveCategory} />
      )}
      {activeTab === "shop" && <ShopPanel />}

      {/* Settings button */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-3 right-3 text-gray-500 text-xl"
      >
        ⚙️
      </button>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      {game.offlineReport && (
        <OfflineModal report={game.offlineReport} onClose={game.dismissOffline} />
      )}
      {game.milestone && (
        <MilestoneModal milestone={game.milestone} onClose={game.dismissMilestone} />
      )}
      {game.showDaily && (
        <DailyRewardModal
          streak={state.dailyStreak}
          onClaim={game.claimDailyReward}
          onClose={game.dismissDaily}
        />
      )}
      {showPrestige && (
        <PrestigeModal
          prestigeCount={state.prestigeCount}
          onPrestige={game.prestige}
          onClose={() => setShowPrestige(false)}
        />
      )}
      {showSettings && (
        <SettingsModal
          prestigeCount={state.prestigeCount}
          totalClicks={state.totalClicks}
          totalPlayTime={state.totalPlayTime}
          canPrestige={checkPrestige(state)}
          onPrestigeOpen={() => setShowPrestige(true)}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update page.tsx to mount Game**

Replace `game1/src/app/page.tsx` with:

```tsx
import { Game } from "@/components/Game";

export default function Home() {
  return <Game />;
}
```

- [ ] **Step 3: Verify the game loads**

```bash
cd /Users/myeongjeonghyeonmyeongjeonghyeon/earn_money/game1
npm run dev
```

Open http://localhost:3000. Verify:
- Stats bar shows at top (0 subs, 0 views)
- Comment feed area visible
- Studio emoji visible
- "Upload Video!" button visible and clickable
- Clicking increases view count
- Bottom tabs work (Equipment, Team, Channel, Shop)
- Daily reward modal appears on first load

- [ ] **Step 4: Commit**

```bash
git add game1/src/components/Game.tsx game1/src/app/page.tsx
git commit -m "feat: wire up main Game component with all UI systems"
```

---

### Task 14: Polish & Mobile Optimization

**Files:**
- Modify: `game1/src/app/globals.css`
- Modify: `game1/src/app/layout.tsx`

- [ ] **Step 1: Add mobile-specific CSS**

Add to end of `game1/src/app/globals.css`:

```css
/* Prevent pull-to-refresh on mobile */
html, body {
  overscroll-behavior: none;
  overflow: hidden;
  height: 100dvh;
}

/* Safe area for notched phones */
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* Smooth scrolling in panels */
.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
}

/* Prevent text selection during gameplay */
.select-none {
  -webkit-user-select: none;
}
```

- [ ] **Step 2: Add PWA meta tags to layout**

Add inside the `<head>` via metadata in `game1/src/app/layout.tsx`. Update the metadata export:

```tsx
export const metadata: Metadata = {
  title: "YouTuber Tycoon",
  description: "Grow from 0 subscribers to a media empire!",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "YouTuber Tycoon",
  },
};
```

Create `game1/public/manifest.json`:

```json
{
  "name": "YouTuber Tycoon",
  "short_name": "YT Tycoon",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#111827",
  "theme_color": "#111827",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Note: icon-192.png and icon-512.png will need to be created (simple camera emoji on dark background). For now, the manifest works without them — browsers fall back to favicon.

- [ ] **Step 3: Commit**

```bash
git add game1/src/app/globals.css game1/src/app/layout.tsx game1/public/manifest.json
git commit -m "feat: add mobile optimization and PWA manifest"
```

---

### Task 15: Build Verification & Deploy

**Files:** None new — verification only.

- [ ] **Step 1: Run production build**

```bash
cd /Users/myeongjeonghyeonmyeongjeonghyeon/earn_money/game1
npm run build
```

Expected: Build succeeds with no errors. Fix any TypeScript or build errors that appear.

- [ ] **Step 2: Test production build locally**

```bash
npm run start
```

Open http://localhost:3000 and verify all features work:
- Click button increases views
- Stats update in real time
- Comments appear and scroll
- Equipment/Team/Channel/Shop tabs open
- Daily reward modal works
- Close and reopen — offline earnings modal appears (if >1min elapsed)

- [ ] **Step 3: Deploy to Vercel**

```bash
cd /Users/myeongjeonghyeonmyeongjeonghyeon/earn_money/game1
npx vercel --yes
```

Verify the preview URL loads and the game works on mobile.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: YouTuber Tycoon MVP — complete idle clicker game"
```

---

## Summary

| Task | Description | Estimated Steps |
|------|-------------|----------------|
| 1 | Project scaffolding | 4 |
| 2 | Game state & number formatting | 4 |
| 3 | Game data definitions (upgrades, categories, milestones) | 4 |
| 4 | Game engine (tick loop + click handler) | 2 |
| 5 | Save/load & offline earnings | 2 |
| 6 | Trending, events, daily rewards, prestige logic | 5 |
| 7 | Comment generation | 2 |
| 8 | React game hook (useGame) | 2 |
| 9 | UI: StatsBar, ClickButton, MilestoneBar | 5 |
| 10 | UI: CommentFeed, StudioView, BottomNav | 5 |
| 11 | Panel components (Equipment, Team, Channel, Shop) | 5 |
| 12 | Modal components (all 6 modals) | 8 |
| 13 | Main Game component — wire everything | 4 |
| 14 | Polish & mobile optimization | 3 |
| 15 | Build verification & deploy | 4 |
| **Total** | | **59 steps** |
