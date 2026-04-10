import { getHamsterSize } from "@/game/growth";

export type HamsterAnimation = "idle" | "walk" | "eat" | "sleep" | "happy" | "surprised" | "wheel";

interface HamsterVisual {
  x: number;
  y: number;
  direction: number;
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

  // Walking bounce
  if (h.animation === "walk") {
    const bounce = Math.sin(h.animFrame * 0.3) * 3;
    ctx.translate(0, bounce);
  }

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.beginPath();
  ctx.ellipse(0, baseSize * 0.6, baseSize * 0.8, baseSize * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = "#d4a574";
  ctx.beginPath();
  ctx.ellipse(0, 0, baseSize, baseSize * 0.75, 0, 0, Math.PI * 2);
  ctx.fill();

  // Belly
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
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-baseSize * 0.25, -baseSize * 0.15, 4, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(baseSize * 0.25, -baseSize * 0.15, 4, 0, Math.PI);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(-baseSize * 0.25, -baseSize * 0.15, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(baseSize * 0.25, -baseSize * 0.15, 3 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(-baseSize * 0.23, -baseSize * 0.18, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(baseSize * 0.27, -baseSize * 0.18, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Surprised eyes bigger
    if (h.animation === "surprised") {
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(-baseSize * 0.25, -baseSize * 0.15, 6 * scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(baseSize * 0.25, -baseSize * 0.15, 6 * scale, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Nose
  ctx.fillStyle = "#ff9999";
  ctx.beginPath();
  ctx.arc(0, baseSize * 0.05, 3, 0, Math.PI * 2);
  ctx.fill();

  // Cheeks
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

  // Zzz for sleep
  if (h.animation === "sleep") {
    ctx.font = `${14 * scale}px serif`;
    ctx.textAlign = "center";
    ctx.fillText("\u{1F4A4}", baseSize * 0.6, -baseSize * 0.8);
  }

  ctx.restore();
}
