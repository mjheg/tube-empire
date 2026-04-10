import { HamsterAIState, triggerReaction } from "./hamsterAI";
import { spawnHearts, spawnStars } from "./effects";

function isOnHamster(ai: HamsterAIState, x: number, y: number): boolean {
  const dx = x - ai.x;
  const dy = y - ai.y;
  return dx * dx + dy * dy < 40 * 40;
}

export function handleTap(ai: HamsterAIState, x: number, y: number): { ai: HamsterAIState; action: "poke" | null } {
  if (!isOnHamster(ai, x, y)) return { ai, action: null };
  const newAI = triggerReaction(ai, "surprised", 1);
  spawnStars(ai.x, ai.y - 20);
  return { ai: newAI, action: "poke" };
}

export function handleDrag(ai: HamsterAIState, x: number, y: number): { ai: HamsterAIState; action: "pet" | null } {
  if (!isOnHamster(ai, x, y)) return { ai, action: null };
  const newAI = triggerReaction(ai, "happy", 1.5);
  spawnHearts(ai.x, ai.y - 20);
  return { ai: newAI, action: "pet" };
}
