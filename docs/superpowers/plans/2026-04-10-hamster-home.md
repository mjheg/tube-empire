# Hamster Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first healing virtual pet web game where you raise a hamster in a cage with touch interactions, decoration, and growth systems.

**Architecture:** Single-page Next.js app. Canvas 2D renders the cage, hamster, and items in a top-down view. React handles UI overlays (status bar, menus, modals). Game state lives in LocalStorage. The hamster is drawn procedurally using Canvas shapes (no external sprite assets needed for MVP). A game loop runs at 60fps for smooth animation, with a 1-second tick for stats.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, HTML Canvas 2D, LocalStorage, Vercel (free tier)

---

## File Structure

```
game2/
  src/
    app/
      layout.tsx            — Root layout, viewport, meta
      page.tsx              — Mounts <Game />
      globals.css           — Global styles, animations
    components/
      Game.tsx              — Top-level game shell, orchestrates everything
      NameInput.tsx          — Hamster naming screen (first launch)
      StatusBar.tsx          — Top bar: name, happiness, hunger, energy icons
      BottomNav.tsx          — Tab navigation: feed, play, decorate, shop
      GameCanvas.tsx         — Canvas wrapper component, handles resize + input events
      panels/
        FeedPanel.tsx        — Food selection panel
        DecoratePanel.tsx    — Item placement panel
        ShopPanel.tsx        — Coin shop / IAP placeholders
      modals/
        OfflineModal.tsx     — "Your hamster was alone" popup
        MissionModal.tsx     — Daily missions popup
        LevelUpModal.tsx     — Intimacy level up popup
        SettingsModal.tsx    — Settings + reset
    game/
      state.ts              — HamsterState type + createInitialState
      stats.ts              — Emotion/stats logic (happiness, hunger, energy)
      growth.ts             — Growth stages + intimacy levels
      missions.ts           — Daily mission definitions + tracking
      coins.ts              — Coin earning logic
      save.ts               — LocalStorage save/load + offline calc
      items.ts              — Item/furniture definitions + prices
    canvas/
      renderer.ts           — Main Canvas render loop (draws cage, items, hamster)
      cage.ts               — Draw cage background + borders
      hamster.ts            — Draw hamster (procedural shapes) + animations
      hamsterAI.ts          — Hamster movement AI + auto behaviors
      interactions.ts       — Handle click/drag/longpress → hamster reactions
      effects.ts            — Particle effects (hearts, zzz, sparkles)
      items.ts              — Draw placed items in cage
  public/
    favicon.ico
    manifest.json
  package.json
  tsconfig.json
  next.config.ts
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `game2/package.json`, `game2/tsconfig.json`, `game2/next.config.ts`
- Create: `game2/src/app/layout.tsx`, `game2/src/app/page.tsx`, `game2/src/app/globals.css`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/myeongjeonghyeonmyeongjeonghyeon/earn_money/game2
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm --yes
```

- [ ] **Step 2: Replace boilerplate files**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hamster Home",
  description: "Raise your own adorable hamster!",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fef3c7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="overscroll-none overflow-hidden">{children}</body>
    </html>
  );
}
```

Replace `src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="h-dvh bg-amber-50 flex items-center justify-center">
      <h1 className="text-2xl font-bold text-amber-800">Hamster Home</h1>
    </main>
  );
}
```

Replace `src/app/globals.css`:

```css
@import "tailwindcss";

* {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

body {
  background: #fef3c7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  touch-action: none;
}

html, body {
  overscroll-behavior: none;
  overflow: hidden;
  height: 100dvh;
}

@keyframes float-up {
  0% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-40px) scale(0.5); }
}

.animate-float { animation: float-up 1s ease-out forwards; }

@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.animate-bounce-in { animation: bounce-in 0.3s ease-out; }
```

Create `public/manifest.json`:

```json
{
  "name": "Hamster Home",
  "short_name": "Hamster",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fef3c7",
  "theme_color": "#fef3c7"
}
```

- [ ] **Step 3: Verify dev server runs**

```bash
cd /Users/myeongjeonghyeonmyeongjeonghyeon/earn_money/game2
npm run dev
```

Open http://localhost:3000, verify "Hamster Home" text on warm background.

- [ ] **Step 4: Commit**

```bash
git add game2/
git commit -m "feat: scaffold Next.js project for Hamster Home"
```

---

### Task 2: Game State & Stats

**Files:**
- Create: `game2/src/game/state.ts`
- Create: `game2/src/game/stats.ts`

- [ ] **Step 1: Create HamsterState type and initial state**

Create `game2/src/game/state.ts`:

```ts
export interface HamsterState {
  name: string;

  // Stats (0-100)
  happiness: number;
  hunger: number;    // 100 = full, 0 = starving
  energy: number;    // 100 = rested, 0 = exhausted

  // Growth
  birthTime: number;        // timestamp ms
  growthStage: "baby" | "teen" | "adult";
  intimacyLevel: number;    // 0+
  intimacyXP: number;       // XP toward next level

  // Economy
  coins: number;

  // Decoration
  placedItems: PlacedItem[];

  // Missions
  dailyMissions: DailyMissionProgress[];
  lastMissionResetDate: string; // "YYYY-MM-DD"

  // Daily login
  lastLoginDate: string | null;
  loginStreak: number;

  // Meta
  totalPets: number;     // total times petted
  totalFeeds: number;    // total times fed
  lastSaveTime: number;
  lastOnlineTime: number;
}

export interface PlacedItem {
  itemId: string;
  x: number; // 0-1 normalized position
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
    coins: 50, // starting coins
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
```

- [ ] **Step 2: Create stats logic**

Create `game2/src/game/stats.ts`:

```ts
import { HamsterState } from "./state";

/** Decay stats over time. Called every second. */
export function decayStats(state: HamsterState): HamsterState {
  return {
    ...state,
    hunger: Math.max(0, state.hunger - 0.02),     // ~2 per 100 seconds
    happiness: Math.max(0, state.happiness - 0.01), // slow decay
    energy: state.energy < 100
      ? Math.min(100, state.energy + 0.05)          // slowly recovers
      : state.energy,
  };
}

/** Pet the hamster: boost happiness, earn XP */
export function pet(state: HamsterState): HamsterState {
  return {
    ...state,
    happiness: Math.min(100, state.happiness + 5),
    intimacyXP: state.intimacyXP + 2,
    totalPets: state.totalPets + 1,
    coins: state.coins + 1,
  };
}

/** Feed the hamster */
export function feed(state: HamsterState, foodValue: number): HamsterState {
  return {
    ...state,
    hunger: Math.min(100, state.hunger + foodValue),
    happiness: Math.min(100, state.happiness + 2),
    intimacyXP: state.intimacyXP + 1,
    totalFeeds: state.totalFeeds + 1,
  };
}

/** Play with hamster: uses energy, boosts happiness */
export function play(state: HamsterState): HamsterState {
  if (state.energy < 10) return state; // too tired
  return {
    ...state,
    energy: Math.max(0, state.energy - 15),
    happiness: Math.min(100, state.happiness + 10),
    intimacyXP: state.intimacyXP + 3,
    coins: state.coins + 2,
  };
}

/** Get emoji for stat level */
export function getStatEmoji(value: number): string {
  if (value >= 80) return "\u{1F60A}"; // happy
  if (value >= 50) return "\u{1F610}"; // neutral
  if (value >= 20) return "\u{1F61F}"; // worried
  return "\u{1F622}";                  // crying
}

/** Get happiness emoji */
export function getHappinessEmoji(value: number): string {
  if (value >= 80) return "\u2764\uFE0F";
  if (value >= 50) return "\u{1F9E1}";
  if (value >= 20) return "\u{1F494}";
  return "\u{1F5A4}";
}
```

- [ ] **Step 3: Commit**

```bash
git add game2/src/game/state.ts game2/src/game/stats.ts
git commit -m "feat: add hamster state type and stats logic"
```

---

### Task 3: Growth, Missions, Coins, Items

**Files:**
- Create: `game2/src/game/growth.ts`
- Create: `game2/src/game/missions.ts`
- Create: `game2/src/game/coins.ts`
- Create: `game2/src/game/items.ts`

- [ ] **Step 1: Create growth system**

Create `game2/src/game/growth.ts`:

```ts
import { HamsterState } from "./state";

const DAY_MS = 24 * 60 * 60 * 1000;

export function updateGrowthStage(state: HamsterState): HamsterState {
  const ageDays = (Date.now() - state.birthTime) / DAY_MS;

  let stage: HamsterState["growthStage"];
  if (ageDays < 3) stage = "baby";
  else if (ageDays < 7) stage = "teen";
  else stage = "adult";

  if (stage === state.growthStage) return state;
  return { ...state, growthStage: stage };
}

/** XP needed for next intimacy level */
export function xpForLevel(level: number): number {
  return 20 + level * 15;
}

/** Check and apply level up */
export function checkLevelUp(state: HamsterState): { state: HamsterState; leveledUp: boolean } {
  const needed = xpForLevel(state.intimacyLevel);
  if (state.intimacyXP < needed) return { state, leveledUp: false };

  return {
    state: {
      ...state,
      intimacyLevel: state.intimacyLevel + 1,
      intimacyXP: state.intimacyXP - needed,
    },
    leveledUp: true,
  };
}

export function getGrowthLabel(stage: HamsterState["growthStage"]): string {
  switch (stage) {
    case "baby": return "Baby";
    case "teen": return "Teen";
    case "adult": return "Adult";
  }
}

export function getHamsterSize(stage: HamsterState["growthStage"]): number {
  switch (stage) {
    case "baby": return 0.6;
    case "teen": return 0.8;
    case "adult": return 1.0;
  }
}
```

- [ ] **Step 2: Create missions system**

Create `game2/src/game/missions.ts`:

```ts
import { HamsterState, DailyMissionProgress } from "./state";

interface MissionDef {
  id: string;
  description: string;
  target: number;
  reward: number; // coins
  check: (state: HamsterState) => number; // current progress
}

export const DAILY_MISSIONS: MissionDef[] = [
  { id: "pet3", description: "Pet your hamster 3 times", target: 3, reward: 10, check: (s) => s.totalPets },
  { id: "feed3", description: "Feed your hamster 3 times", target: 3, reward: 10, check: (s) => s.totalFeeds },
  { id: "login", description: "Log in today", target: 1, reward: 5, check: () => 1 },
];

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function resetDailyMissions(state: HamsterState): HamsterState {
  const today = getTodayString();
  if (state.lastMissionResetDate === today) return state;

  const basePets = state.totalPets;
  const baseFeeds = state.totalFeeds;

  return {
    ...state,
    lastMissionResetDate: today,
    dailyMissions: DAILY_MISSIONS.map((m) => ({
      missionId: m.id,
      current: 0,
      target: m.target,
      claimed: false,
    })),
    // Store baseline for today's counting — we track delta via totalPets/totalFeeds
  };
}

export function updateMissionProgress(state: HamsterState): HamsterState {
  const missions = state.dailyMissions.map((mp) => {
    const def = DAILY_MISSIONS.find((d) => d.id === mp.missionId);
    if (!def || mp.claimed) return mp;

    let current = mp.current;
    if (mp.missionId === "pet3") current = Math.min(def.target, state.totalPets % 1000); // simplified
    if (mp.missionId === "feed3") current = Math.min(def.target, state.totalFeeds % 1000);
    if (mp.missionId === "login") current = 1;

    return { ...mp, current };
  });

  return { ...state, dailyMissions: missions };
}

export function claimMissionReward(state: HamsterState, missionId: string): HamsterState {
  const def = DAILY_MISSIONS.find((d) => d.id === missionId);
  if (!def) return state;

  const missions = state.dailyMissions.map((mp) => {
    if (mp.missionId !== missionId) return mp;
    if (mp.claimed || mp.current < mp.target) return mp;
    return { ...mp, claimed: true };
  });

  const wasClaimed = state.dailyMissions.find((m) => m.missionId === missionId);
  if (wasClaimed?.claimed) return state;

  return {
    ...state,
    dailyMissions: missions,
    coins: state.coins + def.reward,
  };
}
```

- [ ] **Step 3: Create items definitions**

Create `game2/src/game/items.ts`:

```ts
export interface ItemDef {
  id: string;
  name: string;
  emoji: string;
  category: "basic" | "furniture" | "house" | "food";
  price: number; // 0 = free/default
  premium: boolean;
  width: number;  // normalized 0-1
  height: number;
  color: string;  // for Canvas drawing
}

export const ITEMS: ItemDef[] = [
  // Basic (included)
  { id: "water-bottle", name: "Water Bottle", emoji: "\u{1F4A7}", category: "basic", price: 0, premium: false, width: 0.08, height: 0.15, color: "#60a5fa" },
  { id: "food-bowl", name: "Food Bowl", emoji: "\u{1F35A}", category: "basic", price: 0, premium: false, width: 0.1, height: 0.08, color: "#f97316" },
  { id: "wheel", name: "Hamster Wheel", emoji: "\u{1F3A1}", category: "basic", price: 0, premium: false, width: 0.2, height: 0.2, color: "#818cf8" },
  { id: "house", name: "Wooden House", emoji: "\u{1F3E0}", category: "house", price: 0, premium: false, width: 0.15, height: 0.15, color: "#a3e635" },

  // Furniture (coin purchase)
  { id: "tunnel", name: "Tunnel", emoji: "\u{1F573}\uFE0F", category: "furniture", price: 30, premium: false, width: 0.2, height: 0.06, color: "#fbbf24" },
  { id: "seesaw", name: "Seesaw", emoji: "\u{1F3A2}", category: "furniture", price: 50, premium: false, width: 0.15, height: 0.08, color: "#f472b6" },
  { id: "hammock", name: "Hammock", emoji: "\u{1F6CC}", category: "furniture", price: 80, premium: false, width: 0.12, height: 0.08, color: "#34d399" },
  { id: "slide", name: "Slide", emoji: "\u{1F6DD}", category: "furniture", price: 100, premium: false, width: 0.1, height: 0.15, color: "#f87171" },

  // Premium houses
  { id: "castle", name: "Castle", emoji: "\u{1F3F0}", category: "house", price: 200, premium: true, width: 0.18, height: 0.18, color: "#c084fc" },
  { id: "tent", name: "Tent", emoji: "\u26FA", category: "house", price: 150, premium: true, width: 0.14, height: 0.14, color: "#fb923c" },
];

export const FOODS = [
  { id: "sunflower", name: "Sunflower Seed", emoji: "\u{1F33B}", value: 20, price: 0 },
  { id: "carrot", name: "Carrot", emoji: "\u{1F955}", value: 35, price: 5 },
  { id: "cheese", name: "Cheese", emoji: "\u{1F9C0}", value: 50, price: 10 },
  { id: "strawberry", name: "Strawberry", emoji: "\u{1F353}", value: 70, price: 20 },
];

export function getItemDef(id: string): ItemDef | undefined {
  return ITEMS.find((i) => i.id === id);
}
```

- [ ] **Step 4: Commit**

```bash
git add game2/src/game/growth.ts game2/src/game/missions.ts game2/src/game/items.ts
git commit -m "feat: add growth, missions, and item definitions"
```

---

### Task 4: Save/Load & Offline

**Files:**
- Create: `game2/src/game/save.ts`

- [ ] **Step 1: Create save system**

Create `game2/src/game/save.ts`:

```ts
import { HamsterState, createInitialState } from "./state";

const SAVE_KEY = "hamster-home-save";

export function saveGame(state: HamsterState): void {
  const toSave = { ...state, lastSaveTime: Date.now(), lastOnlineTime: Date.now() };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage full or unavailable
  }
}

export function loadGame(): HamsterState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed.happiness !== "number") return null;
    // Backfill new fields
    if (!Array.isArray(parsed.placedItems)) parsed.placedItems = [];
    if (!Array.isArray(parsed.dailyMissions)) parsed.dailyMissions = [];
    return parsed as HamsterState;
  } catch {
    return null;
  }
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export interface OfflineReport {
  offlineMinutes: number;
  hungerLost: number;
  happinessLost: number;
}

export function calcOfflineChanges(state: HamsterState): OfflineReport {
  const now = Date.now();
  const elapsed = Math.floor((now - state.lastOnlineTime) / 1000);
  const cappedSeconds = Math.min(elapsed, 86400); // max 24h
  const minutes = Math.floor(cappedSeconds / 60);

  if (minutes < 1) {
    return { offlineMinutes: 0, hungerLost: 0, happinessLost: 0 };
  }

  // Stats decay while offline
  const hungerLost = Math.min(state.hunger, minutes * 0.02 * 60); // same rate as online
  const happinessLost = Math.min(state.happiness, minutes * 0.01 * 60);

  return { offlineMinutes: minutes, hungerLost, happinessLost };
}

export function applyOfflineChanges(state: HamsterState, report: OfflineReport): HamsterState {
  return {
    ...state,
    hunger: Math.max(0, state.hunger - report.hungerLost),
    happiness: Math.max(0, state.happiness - report.happinessLost),
    lastOnlineTime: Date.now(),
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add game2/src/game/save.ts
git commit -m "feat: add save/load system with offline calculations"
```

---

### Task 5: Canvas — Cage & Item Rendering

**Files:**
- Create: `game2/src/canvas/cage.ts`
- Create: `game2/src/canvas/items.ts`
- Create: `game2/src/canvas/effects.ts`

- [ ] **Step 1: Create cage renderer**

Create `game2/src/canvas/cage.ts`:

```ts
export function drawCage(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Cage background (bedding)
  ctx.fillStyle = "#fef9ee";
  ctx.fillRect(0, 0, w, h);

  // Bedding texture (small dots)
  ctx.fillStyle = "#f5e6c8";
  for (let i = 0; i < 60; i++) {
    const x = (i * 73 + 17) % w;
    const y = (i * 97 + 31) % h;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cage border (wooden frame)
  const border = 8;
  ctx.strokeStyle = "#b8860b";
  ctx.lineWidth = border;
  ctx.strokeRect(border / 2, border / 2, w - border, h - border);

  // Inner shadow
  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 2;
  ctx.strokeRect(border + 2, border + 2, w - border * 2 - 4, h - border * 2 - 4);
}
```

- [ ] **Step 2: Create item renderer**

Create `game2/src/canvas/items.ts`:

```ts
import { PlacedItem } from "@/game/state";
import { getItemDef } from "@/game/items";

export function drawItems(ctx: CanvasRenderingContext2D, items: PlacedItem[], w: number, h: number) {
  for (const placed of items) {
    const def = getItemDef(placed.itemId);
    if (!def) continue;

    const x = placed.x * w;
    const y = placed.y * h;
    const iw = def.width * w;
    const ih = def.height * h;

    // Draw item as rounded rectangle with color
    ctx.fillStyle = def.color;
    ctx.beginPath();
    const r = Math.min(iw, ih) * 0.2;
    ctx.roundRect(x - iw / 2, y - ih / 2, iw, ih, r);
    ctx.fill();

    // Border
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Emoji label
    ctx.font = `${Math.min(iw, ih) * 0.6}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(def.emoji, x, y);
  }
}
```

- [ ] **Step 3: Create effects system**

Create `game2/src/canvas/effects.ts`:

```ts
export interface Particle {
  x: number;
  y: number;
  emoji: string;
  age: number;    // 0-1
  speed: number;
}

let particles: Particle[] = [];

export function spawnParticle(x: number, y: number, emoji: string) {
  particles.push({ x, y, emoji, age: 0, speed: 0.5 + Math.random() * 0.5 });
}

export function spawnHearts(x: number, y: number, count: number = 3) {
  for (let i = 0; i < count; i++) {
    spawnParticle(
      x + (Math.random() - 0.5) * 40,
      y + (Math.random() - 0.5) * 20,
      "\u2764\uFE0F"
    );
  }
}

export function spawnStars(x: number, y: number) {
  for (let i = 0; i < 3; i++) {
    spawnParticle(x + (Math.random() - 0.5) * 30, y - 10, "\u2B50");
  }
}

export function spawnZzz(x: number, y: number) {
  spawnParticle(x + 15, y - 10, "\u{1F4A4}");
}

export function updateAndDrawParticles(ctx: CanvasRenderingContext2D, dt: number) {
  particles = particles.filter((p) => p.age < 1);

  for (const p of particles) {
    p.age += dt * p.speed;
    p.y -= dt * 40;

    const alpha = 1 - p.age;
    ctx.globalAlpha = alpha;
    ctx.font = "20px serif";
    ctx.textAlign = "center";
    ctx.fillText(p.emoji, p.x, p.y);
  }

  ctx.globalAlpha = 1;
}

export function clearParticles() {
  particles = [];
}
```

- [ ] **Step 4: Commit**

```bash
git add game2/src/canvas/
git commit -m "feat: add cage, item, and particle rendering"
```

---

### Task 6: Canvas — Hamster Drawing & AI

**Files:**
- Create: `game2/src/canvas/hamster.ts`
- Create: `game2/src/canvas/hamsterAI.ts`

- [ ] **Step 1: Create procedural hamster drawing**

Create `game2/src/canvas/hamster.ts`:

```ts
import { getHamsterSize } from "@/game/growth";

export type HamsterAnimation = "idle" | "walk" | "eat" | "sleep" | "happy" | "surprised" | "wheel";

interface HamsterVisual {
  x: number;
  y: number;
  direction: number; // -1 left, 1 right
  animation: HamsterAnimation;
  animFrame: number;
  stage: "baby" | "teen" | "adult";
}

export function drawHamster(ctx: CanvasRenderingContext2D, h: HamsterVisual) {
  const scale = getHamsterSize(h.stage);
  const baseSize = 30 * scale;

  ctx.save();
  ctx.translate(h.x, h.y);
  ctx.scale(h.direction, 1);

  // Body (oval)
  ctx.fillStyle = "#d4a574";
  ctx.beginPath();
  ctx.ellipse(0, 0, baseSize, baseSize * 0.75, 0, 0, Math.PI * 2);
  ctx.fill();

  // Belly (lighter)
  ctx.fillStyle = "#f5e6c8";
  ctx.beginPath();
  ctx.ellipse(0, baseSize * 0.1, baseSize * 0.6, baseSize * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = "#c4956a";
  ctx.beginPath();
  ctx.ellipse(-baseSize * 0.5, -baseSize * 0.55, baseSize * 0.2, baseSize * 0.25, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(baseSize * 0.5, -baseSize * 0.55, baseSize * 0.2, baseSize * 0.25, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Inner ears
  ctx.fillStyle = "#f5b0b0";
  ctx.beginPath();
  ctx.ellipse(-baseSize * 0.5, -baseSize * 0.55, baseSize * 0.12, baseSize * 0.15, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(baseSize * 0.5, -baseSize * 0.55, baseSize * 0.12, baseSize * 0.15, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  if (h.animation === "sleep" || h.animation === "happy") {
    // Closed eyes (arcs)
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-baseSize * 0.25, -baseSize * 0.15, 4, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(baseSize * 0.25, -baseSize * 0.15, 4, 0, Math.PI);
    ctx.stroke();
  } else {
    // Open eyes
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(-baseSize * 0.25, -baseSize * 0.15, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(baseSize * 0.25, -baseSize * 0.15, 3, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(-baseSize * 0.23, -baseSize * 0.18, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(baseSize * 0.27, -baseSize * 0.18, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Nose
  ctx.fillStyle = "#ff9999";
  ctx.beginPath();
  ctx.arc(0, baseSize * 0.05, 3, 0, Math.PI * 2);
  ctx.fill();

  // Cheeks (puffy when eating)
  const cheekSize = h.animation === "eat" ? baseSize * 0.35 : baseSize * 0.2;
  ctx.fillStyle = "rgba(255, 180, 180, 0.5)";
  ctx.beginPath();
  ctx.arc(-baseSize * 0.4, baseSize * 0.05, cheekSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(baseSize * 0.4, baseSize * 0.05, cheekSize, 0, Math.PI * 2);
  ctx.fill();

  // Whiskers
  ctx.strokeStyle = "#999";
  ctx.lineWidth = 1;
  for (const side of [-1, 1]) {
    for (const angle of [-0.2, 0, 0.2]) {
      ctx.beginPath();
      ctx.moveTo(side * baseSize * 0.15, baseSize * 0.1);
      ctx.lineTo(side * baseSize * 0.6, baseSize * 0.1 + angle * 20);
      ctx.stroke();
    }
  }

  // Walking bounce
  if (h.animation === "walk") {
    const bounce = Math.sin(h.animFrame * 0.3) * 3;
    ctx.translate(0, bounce);
  }

  // Zzz for sleep
  if (h.animation === "sleep") {
    ctx.font = "14px serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#333";
    ctx.fillText("\u{1F4A4}", baseSize * 0.6, -baseSize * 0.8);
  }

  ctx.restore();
}
```

- [ ] **Step 2: Create hamster AI**

Create `game2/src/canvas/hamsterAI.ts`:

```ts
import { HamsterAnimation } from "./hamster";
import { HamsterState, PlacedItem } from "@/game/state";
import { getItemDef } from "@/game/items";

export interface HamsterAIState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  direction: number;
  animation: HamsterAnimation;
  animFrame: number;
  stateTimer: number;    // seconds until next behavior change
  reactionTimer: number; // seconds of reaction animation remaining
  reactionAnim: HamsterAnimation | null;
}

export function createHamsterAI(cageW: number, cageH: number): HamsterAIState {
  return {
    x: cageW / 2,
    y: cageH / 2,
    targetX: cageW / 2,
    targetY: cageH / 2,
    direction: 1,
    animation: "idle",
    animFrame: 0,
    stateTimer: 3,
    reactionTimer: 0,
    reactionAnim: null,
  };
}

export function updateHamsterAI(
  ai: HamsterAIState,
  state: HamsterState,
  items: PlacedItem[],
  cageW: number,
  cageH: number,
  dt: number
): HamsterAIState {
  let next = { ...ai };
  next.animFrame += dt * 10;

  // Handle reaction (from player interaction)
  if (next.reactionTimer > 0) {
    next.reactionTimer -= dt;
    if (next.reactionAnim) next.animation = next.reactionAnim;
    if (next.reactionTimer <= 0) {
      next.reactionAnim = null;
    }
    return next;
  }

  // Auto behavior timer
  next.stateTimer -= dt;
  if (next.stateTimer <= 0) {
    next = pickNewBehavior(next, state, items, cageW, cageH);
  }

  // Move toward target
  const dx = next.targetX - next.x;
  const dy = next.targetY - next.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > 5) {
    const speed = 40; // pixels per second
    next.x += (dx / dist) * speed * dt;
    next.y += (dy / dist) * speed * dt;
    next.direction = dx > 0 ? 1 : -1;
    next.animation = "walk";
  } else {
    if (next.animation === "walk") {
      next.animation = "idle";
    }
  }

  // Clamp to cage
  const margin = 30;
  next.x = Math.max(margin, Math.min(cageW - margin, next.x));
  next.y = Math.max(margin, Math.min(cageH - margin, next.y));

  return next;
}

function pickNewBehavior(
  ai: HamsterAIState,
  state: HamsterState,
  items: PlacedItem[],
  cageW: number,
  cageH: number
): HamsterAIState {
  const next = { ...ai };
  next.stateTimer = 3 + Math.random() * 5; // 3-8 seconds

  // If hungry, go to food bowl
  if (state.hunger < 30) {
    const bowl = items.find((i) => i.itemId === "food-bowl");
    if (bowl) {
      next.targetX = bowl.x * cageW;
      next.targetY = bowl.y * cageH;
      next.animation = "eat";
      return next;
    }
  }

  // If tired, go sleep
  if (state.energy < 20) {
    const house = items.find((i) => i.itemId === "house" || i.itemId === "castle" || i.itemId === "tent");
    if (house) {
      next.targetX = house.x * cageW;
      next.targetY = house.y * cageH;
      next.animation = "sleep";
      next.stateTimer = 8;
      return next;
    }
  }

  // If happy, might go to wheel
  if (state.happiness > 60 && state.energy > 40 && Math.random() < 0.3) {
    const wheel = items.find((i) => i.itemId === "wheel");
    if (wheel) {
      next.targetX = wheel.x * cageW;
      next.targetY = wheel.y * cageH;
      next.animation = "wheel";
      next.stateTimer = 5;
      return next;
    }
  }

  // Otherwise wander randomly
  next.targetX = 40 + Math.random() * (cageW - 80);
  next.targetY = 40 + Math.random() * (cageH - 80);
  return next;
}

/** Trigger a reaction from player interaction */
export function triggerReaction(ai: HamsterAIState, anim: HamsterAnimation, duration: number): HamsterAIState {
  return {
    ...ai,
    reactionTimer: duration,
    reactionAnim: anim,
    stateTimer: duration + 2, // don't interrupt reaction
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add game2/src/canvas/hamster.ts game2/src/canvas/hamsterAI.ts
git commit -m "feat: add procedural hamster drawing and AI movement"
```

---

### Task 7: Canvas — Main Renderer & Interactions

**Files:**
- Create: `game2/src/canvas/renderer.ts`
- Create: `game2/src/canvas/interactions.ts`

- [ ] **Step 1: Create main renderer**

Create `game2/src/canvas/renderer.ts`:

```ts
import { HamsterState } from "@/game/state";
import { drawCage } from "./cage";
import { drawItems } from "./items";
import { drawHamster } from "./hamster";
import { HamsterAIState } from "./hamsterAI";
import { updateAndDrawParticles } from "./effects";

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  state: HamsterState,
  ai: HamsterAIState,
  w: number,
  h: number,
  dt: number
) {
  ctx.clearRect(0, 0, w, h);

  // Draw cage background
  drawCage(ctx, w, h);

  // Draw placed items
  drawItems(ctx, state.placedItems, w, h);

  // Draw hamster
  drawHamster(ctx, {
    x: ai.x,
    y: ai.y,
    direction: ai.direction,
    animation: ai.animation,
    animFrame: ai.animFrame,
    stage: state.growthStage,
  });

  // Draw particles (hearts, stars, zzz)
  updateAndDrawParticles(ctx, dt);
}
```

- [ ] **Step 2: Create interaction handler**

Create `game2/src/canvas/interactions.ts`:

```ts
import { HamsterAIState, triggerReaction } from "./hamsterAI";
import { spawnHearts, spawnStars } from "./effects";

export type InteractionType = "tap" | "drag" | "longpress";

interface InteractionResult {
  ai: HamsterAIState;
  action: "pet" | "poke" | "pickup" | null;
}

function isOnHamster(ai: HamsterAIState, x: number, y: number): boolean {
  const dx = x - ai.x;
  const dy = y - ai.y;
  return dx * dx + dy * dy < 40 * 40; // 40px radius
}

export function handleTap(ai: HamsterAIState, x: number, y: number): InteractionResult {
  if (!isOnHamster(ai, x, y)) return { ai, action: null };

  // Poke — surprised reaction
  const newAI = triggerReaction(ai, "surprised", 1);
  spawnStars(ai.x, ai.y - 20);
  return { ai: newAI, action: "poke" };
}

export function handleDrag(ai: HamsterAIState, x: number, y: number): InteractionResult {
  if (!isOnHamster(ai, x, y)) return { ai, action: null };

  // Pet — happy reaction
  const newAI = triggerReaction(ai, "happy", 1.5);
  spawnHearts(ai.x, ai.y - 20);
  return { ai: newAI, action: "pet" };
}

export function handleLongPress(ai: HamsterAIState, x: number, y: number): InteractionResult {
  if (!isOnHamster(ai, x, y)) return { ai, action: null };

  // Pick up — surprised then calm
  const newAI = triggerReaction(ai, "surprised", 2);
  spawnStars(ai.x, ai.y - 20);
  return { ai: newAI, action: "pickup" };
}
```

- [ ] **Step 3: Commit**

```bash
git add game2/src/canvas/renderer.ts game2/src/canvas/interactions.ts
git commit -m "feat: add main renderer and interaction handler"
```

---

### Task 8: GameCanvas Component

**Files:**
- Create: `game2/src/components/GameCanvas.tsx`

- [ ] **Step 1: Create GameCanvas**

Create `game2/src/components/GameCanvas.tsx`:

```tsx
"use client";

import { useRef, useEffect, useCallback } from "react";
import { HamsterState } from "@/game/state";
import { renderFrame } from "@/canvas/renderer";
import { HamsterAIState, updateHamsterAI, createHamsterAI } from "@/canvas/hamsterAI";
import { handleTap, handleDrag } from "@/canvas/interactions";
import { pet } from "@/game/stats";

interface Props {
  state: HamsterState;
  onStateChange: (updater: (prev: HamsterState) => HamsterState) => void;
}

export function GameCanvas({ state, onStateChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aiRef = useRef<HamsterAIState | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Initialize AI
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    aiRef.current = createHamsterAI(canvas.width, canvas.height);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const loop = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      // Resize canvas to container
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        if (aiRef.current) {
          aiRef.current.x = Math.min(aiRef.current.x, rect.width - 30);
          aiRef.current.y = Math.min(aiRef.current.y, rect.height - 30);
        }
      }

      // Update AI
      if (aiRef.current) {
        aiRef.current = updateHamsterAI(
          aiRef.current, state, state.placedItems,
          canvas.width, canvas.height, dt
        );

        // Render
        renderFrame(ctx, state, aiRef.current, canvas.width, canvas.height, dt);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [state]);

  const getCanvasPos = useCallback((e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = false;
    const pos = getCanvasPos(e);
    dragStartRef.current = pos;
  }, [getCanvasPos]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const pos = getCanvasPos(e);
    const dx = pos.x - dragStartRef.current.x;
    const dy = pos.y - dragStartRef.current.y;
    if (dx * dx + dy * dy > 100) { // moved more than 10px
      isDraggingRef.current = true;
    }

    if (isDraggingRef.current && aiRef.current) {
      const result = handleDrag(aiRef.current, pos.x, pos.y);
      if (result.action === "pet") {
        aiRef.current = result.ai;
        onStateChange((prev) => pet(prev));
        isDraggingRef.current = false; // reset so it doesn't spam
        dragStartRef.current = pos;
      }
    }
  }, [getCanvasPos, onStateChange]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isDraggingRef.current) return;

    const pos = getCanvasPos(e);
    if (aiRef.current) {
      const result = handleTap(aiRef.current, pos.x, pos.y);
      if (result.action === "poke") {
        aiRef.current = result.ai;
        onStateChange((prev) => ({ ...prev, happiness: Math.min(100, prev.happiness + 1) }));
      }
    }
  }, [getCanvasPos, onStateChange]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full flex-1 cursor-pointer"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: "none" }}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add game2/src/components/GameCanvas.tsx
git commit -m "feat: add GameCanvas component with render loop and interactions"
```

---

### Task 9: UI Components (StatusBar, BottomNav, Panels)

**Files:**
- Create: `game2/src/components/StatusBar.tsx`
- Create: `game2/src/components/BottomNav.tsx`
- Create: `game2/src/components/panels/FeedPanel.tsx`
- Create: `game2/src/components/panels/ShopPanel.tsx`
- Create: `game2/src/components/panels/DecoratePanel.tsx`

- [ ] **Step 1: Create StatusBar**

Create `game2/src/components/StatusBar.tsx`:

```tsx
"use client";

import { HamsterState } from "@/game/state";
import { getHappinessEmoji, getStatEmoji } from "@/game/stats";
import { getGrowthLabel } from "@/game/growth";

interface Props {
  state: HamsterState;
}

export function StatusBar({ state }: Props) {
  return (
    <div className="px-4 py-3 bg-amber-100 border-b border-amber-300">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-lg font-bold text-amber-900">
            {"\u{1F439}"} {state.name}
          </div>
          <div className="text-xs text-amber-700">
            {getGrowthLabel(state.growthStage)} · Lv.{state.intimacyLevel}
          </div>
        </div>
        <div className="flex gap-3 text-sm">
          <span title="Happiness">{getHappinessEmoji(state.happiness)}</span>
          <span title="Hunger">{state.hunger > 50 ? "\u{1F35A}" : "\u{1F37D}\uFE0F"}</span>
          <span title="Energy">{state.energy > 50 ? "\u26A1" : "\u{1F4A4}"}</span>
          <span className="text-amber-800 font-bold">{"\u{1FA99}"}{state.coins}</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create BottomNav**

Create `game2/src/components/BottomNav.tsx`:

```tsx
"use client";

export type TabId = "feed" | "play" | "decorate" | "shop";

interface Props {
  activeTab: TabId | null;
  onTabChange: (tab: TabId | null) => void;
}

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: "feed", label: "Feed", emoji: "\u{1F955}" },
  { id: "play", label: "Play", emoji: "\u{1F3BE}" },
  { id: "decorate", label: "Decorate", emoji: "\u{1F3A8}" },
  { id: "shop", label: "Shop", emoji: "\u{1F6D2}" },
];

export function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="flex border-t border-amber-300 bg-amber-50">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(activeTab === tab.id ? null : tab.id)}
          className={`flex-1 py-3 text-center text-xs font-medium transition-colors ${
            activeTab === tab.id
              ? "text-amber-700 bg-amber-200/60"
              : "text-amber-500 active:text-amber-700"
          }`}
        >
          <div className="text-lg">{tab.emoji}</div>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
```

- [ ] **Step 3: Create FeedPanel**

Create `game2/src/components/panels/FeedPanel.tsx`:

```tsx
"use client";

import { FOODS } from "@/game/items";
import { HamsterState } from "@/game/state";

interface Props {
  state: HamsterState;
  onFeed: (foodValue: number, cost: number) => void;
}

export function FeedPanel({ state, onFeed }: Props) {
  return (
    <div className="p-4 space-y-2 max-h-48 overflow-y-auto bg-amber-50">
      <h3 className="text-sm font-bold text-amber-700 uppercase">Food</h3>
      {FOODS.map((food) => {
        const canAfford = state.coins >= food.price;
        return (
          <button
            key={food.id}
            disabled={!canAfford}
            onClick={() => canAfford && onFeed(food.value, food.price)}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              canAfford
                ? "border-amber-300 bg-white text-amber-900 active:bg-amber-100"
                : "border-gray-200 bg-gray-50 text-gray-400"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{food.emoji} {food.name}</span>
              <span className="text-sm">{food.price === 0 ? "Free" : `\u{1FA99}${food.price}`}</span>
            </div>
            <div className="text-xs mt-1 opacity-70">Hunger +{food.value}</div>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Create ShopPanel**

Create `game2/src/components/panels/ShopPanel.tsx`:

```tsx
"use client";

import { ITEMS } from "@/game/items";
import { HamsterState } from "@/game/state";

interface Props {
  state: HamsterState;
  onBuyItem: (itemId: string, cost: number) => void;
}

export function ShopPanel({ state, onBuyItem }: Props) {
  const buyableItems = ITEMS.filter((i) => i.price > 0);
  const ownedIds = state.placedItems.map((p) => p.itemId);

  return (
    <div className="p-4 space-y-2 max-h-48 overflow-y-auto bg-amber-50">
      <h3 className="text-sm font-bold text-amber-700 uppercase">Shop</h3>
      {buyableItems.map((item) => {
        const owned = ownedIds.includes(item.id);
        const canAfford = state.coins >= item.price;
        return (
          <button
            key={item.id}
            disabled={owned || !canAfford}
            onClick={() => !owned && canAfford && onBuyItem(item.id, item.price)}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              owned
                ? "border-green-300 bg-green-50 text-green-700"
                : canAfford
                  ? "border-amber-300 bg-white text-amber-900 active:bg-amber-100"
                  : "border-gray-200 bg-gray-50 text-gray-400"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{item.emoji} {item.name}</span>
              {owned ? (
                <span className="text-green-600 text-sm">Placed</span>
              ) : (
                <span className="text-sm">{"\u{1FA99}"}{item.price}</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 5: Create DecoratePanel (placeholder)**

Create `game2/src/components/panels/DecoratePanel.tsx`:

```tsx
"use client";

import { HamsterState } from "@/game/state";

interface Props {
  state: HamsterState;
}

export function DecoratePanel({ state }: Props) {
  return (
    <div className="p-4 bg-amber-50">
      <h3 className="text-sm font-bold text-amber-700 uppercase">Placed Items</h3>
      <div className="mt-2 space-y-1">
        {state.placedItems.map((item, i) => (
          <div key={i} className="text-sm text-amber-800">
            {item.itemId}
          </div>
        ))}
      </div>
      <p className="text-xs text-amber-500 mt-3">Drag items in the cage to rearrange (coming soon)</p>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add game2/src/components/StatusBar.tsx game2/src/components/BottomNav.tsx game2/src/components/panels/
git commit -m "feat: add StatusBar, BottomNav, and panel components"
```

---

### Task 10: Modals (Offline, LevelUp, Settings)

**Files:**
- Create: `game2/src/components/modals/Modal.tsx`
- Create: `game2/src/components/modals/OfflineModal.tsx`
- Create: `game2/src/components/modals/LevelUpModal.tsx`
- Create: `game2/src/components/modals/SettingsModal.tsx`

- [ ] **Step 1: Create Modal wrapper**

Create `game2/src/components/modals/Modal.tsx`:

```tsx
"use client";

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-amber-200 p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create OfflineModal**

Create `game2/src/components/modals/OfflineModal.tsx`:

```tsx
"use client";

import { Modal } from "./Modal";
import { OfflineReport } from "@/game/save";

interface Props {
  report: OfflineReport;
  hamsterName: string;
  onClose: () => void;
}

export function OfflineModal({ report, hamsterName, onClose }: Props) {
  const hours = Math.floor(report.offlineMinutes / 60);
  const mins = report.offlineMinutes % 60;

  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div className="text-5xl mb-3">{"\u{1F439}"}</div>
        <h2 className="text-xl font-bold text-amber-900 mb-2">Welcome back!</h2>
        <p className="text-amber-700 mb-4">
          {hamsterName} was alone for {hours > 0 ? `${hours}h ` : ""}{mins}m
        </p>
        <div className="bg-amber-50 rounded-lg p-3 mb-4 text-sm text-amber-800">
          <div>Hunger decreased a bit</div>
          <div>Happiness went down slightly</div>
          <div className="mt-1 font-bold">Go pet and feed {hamsterName}!</div>
        </div>
        <button onClick={onClose} className="w-full py-3 bg-amber-500 text-white rounded-lg font-bold active:bg-amber-600">
          Let&apos;s go!
        </button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 3: Create LevelUpModal**

Create `game2/src/components/modals/LevelUpModal.tsx`:

```tsx
"use client";

import { Modal } from "./Modal";

interface Props {
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ level, onClose }: Props) {
  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div className="text-5xl mb-3">{"\u2B50"}</div>
        <h2 className="text-xl font-bold text-amber-900 mb-2">Level Up!</h2>
        <p className="text-amber-700 mb-4">Intimacy Level {level} reached!</p>
        <div className="bg-amber-50 rounded-lg p-3 mb-4 text-sm text-amber-800">
          Your hamster trusts you more now!
        </div>
        <button onClick={onClose} className="w-full py-3 bg-amber-500 text-white rounded-lg font-bold active:bg-amber-600">
          Yay!
        </button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 4: Create SettingsModal**

Create `game2/src/components/modals/SettingsModal.tsx`:

```tsx
"use client";

import { Modal } from "./Modal";
import { deleteSave } from "@/game/save";

interface Props {
  hamsterName: string;
  intimacyLevel: number;
  totalPets: number;
  onClose: () => void;
}

export function SettingsModal({ hamsterName, intimacyLevel, totalPets, onClose }: Props) {
  return (
    <Modal onClose={onClose}>
      <div>
        <h2 className="text-xl font-bold text-amber-900 mb-4 text-center">Settings</h2>
        <div className="space-y-2 text-sm text-amber-700 mb-4">
          <div>Hamster: {hamsterName}</div>
          <div>Intimacy Level: {intimacyLevel}</div>
          <div>Total Pets: {totalPets}</div>
        </div>
        <button
          onClick={() => {
            if (confirm("Reset all data? Your hamster will be gone!")) {
              deleteSave();
              window.location.reload();
            }
          }}
          className="w-full py-3 mb-3 bg-red-100 text-red-600 rounded-lg font-bold active:bg-red-200"
        >
          Reset All Data
        </button>
        <button onClick={onClose} className="w-full py-3 bg-amber-100 text-amber-700 rounded-lg font-bold active:bg-amber-200">
          Close
        </button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add game2/src/components/modals/
git commit -m "feat: add modal components (offline, level up, settings)"
```

---

### Task 11: NameInput & Main Game Component

**Files:**
- Create: `game2/src/components/NameInput.tsx`
- Create: `game2/src/components/Game.tsx`
- Modify: `game2/src/app/page.tsx`

- [ ] **Step 1: Create NameInput**

Create `game2/src/components/NameInput.tsx`:

```tsx
"use client";

import { useState } from "react";

interface Props {
  onSubmit: (name: string) => void;
}

export function NameInput({ onSubmit }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed.length > 0) onSubmit(trimmed);
  };

  return (
    <div className="h-dvh bg-amber-50 flex flex-col items-center justify-center px-6">
      <div className="text-7xl mb-4">{"\u{1F439}"}</div>
      <h1 className="text-3xl font-bold text-amber-800 mb-2">Hamster Home</h1>
      <p className="text-amber-600 mb-8">Raise your own adorable hamster!</p>

      <div className="w-full max-w-sm space-y-4">
        <div>
          <label className="text-sm text-amber-700 block mb-2">Name your hamster</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="e.g. Mochi"
            maxLength={15}
            className="w-full px-4 py-3 rounded-xl bg-white border border-amber-300 text-amber-900 text-lg text-center placeholder-amber-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 select-text"
            autoFocus
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={name.trim().length === 0}
          className="w-full py-4 rounded-xl text-xl font-bold bg-amber-500 text-white disabled:bg-gray-300 disabled:text-gray-400 active:bg-amber-600 active:scale-95 transition-all"
        >
          Start!
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Game component**

Create `game2/src/components/Game.tsx`:

```tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { HamsterState, createInitialState } from "@/game/state";
import { decayStats, feed, play } from "@/game/stats";
import { updateGrowthStage, checkLevelUp } from "@/game/growth";
import { resetDailyMissions, updateMissionProgress } from "@/game/missions";
import { saveGame, loadGame, calcOfflineChanges, applyOfflineChanges, OfflineReport } from "@/game/save";
import { StatusBar } from "./StatusBar";
import { GameCanvas } from "./GameCanvas";
import { BottomNav, TabId } from "./BottomNav";
import { FeedPanel } from "./panels/FeedPanel";
import { ShopPanel } from "./panels/ShopPanel";
import { DecoratePanel } from "./panels/DecoratePanel";
import { OfflineModal } from "./modals/OfflineModal";
import { LevelUpModal } from "./modals/LevelUpModal";
import { SettingsModal } from "./modals/SettingsModal";
import { NameInput } from "./NameInput";

export function Game() {
  const [state, setState] = useState<HamsterState | null>(null);
  const [activeTab, setActiveTab] = useState<TabId | null>(null);
  const [offlineReport, setOfflineReport] = useState<OfflineReport | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const stateRef = useRef<HamsterState | null>(null);

  useEffect(() => { stateRef.current = state; }, [state]);

  // Load on mount
  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      const offline = calcOfflineChanges(saved);
      let loaded = applyOfflineChanges(saved, offline);
      loaded = updateGrowthStage(loaded);
      loaded = resetDailyMissions(loaded);
      setState(loaded);
      if (offline.offlineMinutes >= 1) {
        setOfflineReport(offline);
      }
    } else {
      setState(createInitialState());
    }
  }, []);

  // 1-second tick for stats decay + growth + missions
  useEffect(() => {
    if (!state) return;
    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev) return prev;
        let next = decayStats(prev);
        next = updateGrowthStage(next);
        next = updateMissionProgress(next);

        const levelResult = checkLevelUp(next);
        if (levelResult.leveledUp) {
          setLevelUp(levelResult.state.intimacyLevel);
          next = levelResult.state;
        }

        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state !== null]);

  // Auto-save every 10 seconds
  useEffect(() => {
    if (!state) return;
    const interval = setInterval(() => {
      if (stateRef.current) saveGame(stateRef.current);
    }, 10000);
    return () => clearInterval(interval);
  }, [state !== null]);

  const handleStateChange = useCallback((updater: (prev: HamsterState) => HamsterState) => {
    setState((prev) => prev ? updater(prev) : prev);
  }, []);

  const handleFeed = useCallback((foodValue: number, cost: number) => {
    setState((prev) => {
      if (!prev) return prev;
      if (prev.coins < cost) return prev;
      let next = feed(prev, foodValue);
      next = { ...next, coins: next.coins - cost };
      return next;
    });
  }, []);

  const handlePlay = useCallback(() => {
    setState((prev) => prev ? play(prev) : prev);
  }, []);

  const handleBuyItem = useCallback((itemId: string, cost: number) => {
    setState((prev) => {
      if (!prev) return prev;
      if (prev.coins < cost) return prev;
      if (prev.placedItems.some((p) => p.itemId === itemId)) return prev;
      return {
        ...prev,
        coins: prev.coins - cost,
        placedItems: [...prev.placedItems, { itemId, x: 0.5, y: 0.5 }],
      };
    });
  }, []);

  const handleSetName = useCallback((name: string) => {
    setState((prev) => prev ? { ...prev, name } : prev);
  }, []);

  if (!state) {
    return <div className="h-dvh bg-amber-50 flex items-center justify-center text-amber-400">Loading...</div>;
  }

  if (!state.name) {
    return <NameInput onSubmit={handleSetName} />;
  }

  return (
    <div className="h-dvh bg-amber-50 flex flex-col max-w-md mx-auto relative overflow-hidden">
      <StatusBar state={state} />

      <GameCanvas state={state} onStateChange={handleStateChange} />

      {/* Panel area */}
      {activeTab && (
        <div className="absolute bottom-14 left-0 right-0 z-20 border-t border-amber-300">
          {activeTab === "feed" && <FeedPanel state={state} onFeed={handleFeed} />}
          {activeTab === "play" && (
            <div className="p-4 bg-amber-50">
              <button
                onClick={handlePlay}
                disabled={state.energy < 10}
                className={`w-full py-4 rounded-xl text-lg font-bold ${
                  state.energy >= 10
                    ? "bg-amber-500 text-white active:bg-amber-600"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {state.energy >= 10 ? "\u{1F3BE} Play with hamster!" : "\u{1F4A4} Too tired..."}
              </button>
              <p className="text-xs text-amber-500 mt-2 text-center">Energy: {Math.floor(state.energy)}%</p>
            </div>
          )}
          {activeTab === "decorate" && <DecoratePanel state={state} />}
          {activeTab === "shop" && <ShopPanel state={state} onBuyItem={handleBuyItem} />}
        </div>
      )}

      {/* Settings button */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-3 right-3 text-amber-400 text-xl z-10"
      >
        {"\u2699\uFE0F"}
      </button>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      {offlineReport && offlineReport.offlineMinutes >= 1 && (
        <OfflineModal report={offlineReport} hamsterName={state.name} onClose={() => setOfflineReport(null)} />
      )}
      {levelUp !== null && (
        <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />
      )}
      {showSettings && (
        <SettingsModal
          hamsterName={state.name}
          intimacyLevel={state.intimacyLevel}
          totalPets={state.totalPets}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Update page.tsx**

Replace `game2/src/app/page.tsx`:

```tsx
import { Game } from "@/components/Game";

export default function Home() {
  return <Game />;
}
```

- [ ] **Step 4: Commit**

```bash
git add game2/src/components/NameInput.tsx game2/src/components/Game.tsx game2/src/app/page.tsx
git commit -m "feat: wire up main Game component with NameInput and all panels"
```

---

### Task 12: Build Verification & Deploy

**Files:** None new — verification only.

- [ ] **Step 1: Run production build**

```bash
cd /Users/myeongjeonghyeonmyeongjeonghyeon/earn_money/game2
npm run build
```

Fix any TypeScript or build errors.

- [ ] **Step 2: Test locally**

```bash
npm run start
```

Open http://localhost:3000 and verify:
- Name input screen appears
- After naming, cage with hamster appears
- Hamster walks around
- Clicking hamster shows reaction
- Dragging on hamster shows hearts
- Feed/Play/Decorate/Shop tabs work
- Stats display correctly

- [ ] **Step 3: Push to GitHub**

```bash
cd /Users/myeongjeonghyeonmyeongjeonghyeon/earn_money
git add game2/
git commit -m "feat: Hamster Home MVP complete"
git push
```

- [ ] **Step 4: Deploy to Vercel**

Create new Vercel project linked to same repo, with Root Directory set to `game2`.

---

## Summary

| Task | Description | Steps |
|------|-------------|-------|
| 1 | Project scaffolding | 4 |
| 2 | Game state & stats | 3 |
| 3 | Growth, missions, items | 4 |
| 4 | Save/load & offline | 2 |
| 5 | Canvas: cage, items, effects | 4 |
| 6 | Canvas: hamster drawing & AI | 3 |
| 7 | Canvas: renderer & interactions | 3 |
| 8 | GameCanvas component | 2 |
| 9 | UI: StatusBar, BottomNav, panels | 6 |
| 10 | Modals | 5 |
| 11 | NameInput & Game component | 4 |
| 12 | Build & deploy | 4 |
| **Total** | | **44 steps** |
