import { HamsterState } from "@/game/state";
import { drawCage } from "./cage";
import { drawItems } from "./items";
import { drawHamster } from "./hamster";
import { HamsterAIState } from "./hamsterAI";
import { updateAndDrawParticles } from "./effects";

export function renderFrame(
  ctx: CanvasRenderingContext2D, state: HamsterState,
  ai: HamsterAIState, w: number, h: number, dt: number
) {
  ctx.clearRect(0, 0, w, h);
  drawCage(ctx, w, h);
  drawItems(ctx, state.placedItems, w, h);
  drawHamster(ctx, {
    x: ai.x, y: ai.y, direction: ai.direction,
    animation: ai.animation, animFrame: ai.animFrame, stage: state.growthStage,
  });
  updateAndDrawParticles(ctx, dt);
}
