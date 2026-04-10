import { HamsterAnimation } from "./hamster";
import { HamsterState, PlacedItem } from "@/game/state";

export interface HamsterAIState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  direction: number;
  animation: HamsterAnimation;
  animFrame: number;
  stateTimer: number;
  reactionTimer: number;
  reactionAnim: HamsterAnimation | null;
}

export function createHamsterAI(cageW: number, cageH: number): HamsterAIState {
  return {
    x: cageW / 2, y: cageH / 2,
    targetX: cageW / 2, targetY: cageH / 2,
    direction: 1, animation: "idle", animFrame: 0,
    stateTimer: 3, reactionTimer: 0, reactionAnim: null,
  };
}

export function updateHamsterAI(
  ai: HamsterAIState, state: HamsterState, items: PlacedItem[],
  cageW: number, cageH: number, dt: number
): HamsterAIState {
  let next = { ...ai };
  next.animFrame += dt * 10;

  if (next.reactionTimer > 0) {
    next.reactionTimer -= dt;
    if (next.reactionAnim) next.animation = next.reactionAnim;
    if (next.reactionTimer <= 0) next.reactionAnim = null;
    return next;
  }

  next.stateTimer -= dt;
  if (next.stateTimer <= 0) {
    next = pickNewBehavior(next, state, items, cageW, cageH);
  }

  const dx = next.targetX - next.x;
  const dy = next.targetY - next.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > 5) {
    const speed = 40;
    next.x += (dx / dist) * speed * dt;
    next.y += (dy / dist) * speed * dt;
    next.direction = dx > 0 ? 1 : -1;
    next.animation = "walk";
  } else if (next.animation === "walk") {
    next.animation = "idle";
  }

  const margin = 30;
  next.x = Math.max(margin, Math.min(cageW - margin, next.x));
  next.y = Math.max(margin, Math.min(cageH - margin, next.y));

  return next;
}

function pickNewBehavior(
  ai: HamsterAIState, state: HamsterState, items: PlacedItem[],
  cageW: number, cageH: number
): HamsterAIState {
  const next = { ...ai };
  next.stateTimer = 3 + Math.random() * 5;

  if (state.hunger < 30) {
    const bowl = items.find((i) => i.itemId === "food-bowl");
    if (bowl) { next.targetX = bowl.x * cageW; next.targetY = bowl.y * cageH; next.animation = "eat"; return next; }
  }

  if (state.energy < 20) {
    const house = items.find((i) => ["house", "castle", "tent"].includes(i.itemId));
    if (house) { next.targetX = house.x * cageW; next.targetY = house.y * cageH; next.animation = "sleep"; next.stateTimer = 8; return next; }
  }

  if (state.happiness > 60 && state.energy > 40 && Math.random() < 0.3) {
    const wheel = items.find((i) => i.itemId === "wheel");
    if (wheel) { next.targetX = wheel.x * cageW; next.targetY = wheel.y * cageH; next.animation = "wheel"; next.stateTimer = 5; return next; }
  }

  next.targetX = 40 + Math.random() * (cageW - 80);
  next.targetY = 40 + Math.random() * (cageH - 80);
  return next;
}

export function triggerReaction(ai: HamsterAIState, anim: HamsterAnimation, duration: number): HamsterAIState {
  return { ...ai, reactionTimer: duration, reactionAnim: anim, stateTimer: duration + 2 };
}
