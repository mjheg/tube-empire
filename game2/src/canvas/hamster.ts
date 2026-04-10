import { getHamsterSize } from "@/game/growth";
import { getSprite } from "./sprites";

export type HamsterAnimation = "idle" | "walk" | "eat" | "sleep" | "happy" | "surprised" | "wheel";

interface HamsterVisual {
  x: number;
  y: number;
  direction: number;
  animation: HamsterAnimation;
  animFrame: number;
  stage: "baby" | "teen" | "adult";
}

function getSpriteForAnimation(anim: HamsterAnimation): string {
  switch (anim) {
    case "sleep": return "/sprites/hamster-sleep.svg";
    case "happy": return "/sprites/hamster-happy.svg";
    case "eat": return "/sprites/hamster-eat.svg";
    default: return "/sprites/hamster.svg";
  }
}

export function drawHamster(ctx: CanvasRenderingContext2D, h: HamsterVisual) {
  const scale = getHamsterSize(h.stage);
  const spriteW = 90 * scale;
  const spriteH = 75 * scale;

  const spriteSrc = getSpriteForAnimation(h.animation);
  const img = getSprite(spriteSrc);

  ctx.save();
  ctx.translate(h.x, h.y);

  // Walking bounce
  if (h.animation === "walk") {
    const bounce = Math.sin(h.animFrame * 0.4) * 3;
    ctx.translate(0, bounce);
  }

  // Flip direction
  ctx.scale(h.direction, 1);

  if (img) {
    // Draw sprite image
    ctx.drawImage(img, -spriteW / 2, -spriteH / 2, spriteW, spriteH);
  } else {
    // Fallback: simple circle while loading
    ctx.fillStyle = "#d4a574";
    ctx.beginPath();
    ctx.arc(0, 0, spriteW * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(-8 * scale, -5 * scale, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8 * scale, -5 * scale, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
