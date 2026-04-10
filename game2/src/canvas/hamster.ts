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
  const s = 35 * scale; // base size

  ctx.save();
  ctx.translate(h.x, h.y);
  ctx.scale(h.direction, 1);

  // Walking bounce
  if (h.animation === "walk") {
    const bounce = Math.sin(h.animFrame * 0.4) * 3;
    ctx.translate(0, bounce);
  }

  // Ground shadow
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.beginPath();
  ctx.ellipse(0, s * 0.7, s * 0.9, s * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // === BODY ===
  // Main body - 3D gradient
  const bodyGrad = ctx.createRadialGradient(-s * 0.15, -s * 0.1, s * 0.1, 0, 0, s);
  bodyGrad.addColorStop(0, "#e8c49a");
  bodyGrad.addColorStop(0.4, "#d4a574");
  bodyGrad.addColorStop(0.8, "#b8864a");
  bodyGrad.addColorStop(1, "#9c7040");
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, s, s * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Belly (white patch)
  const bellyGrad = ctx.createRadialGradient(0, s * 0.1, 0, 0, s * 0.1, s * 0.55);
  bellyGrad.addColorStop(0, "#faf0e4");
  bellyGrad.addColorStop(1, "#e8d5b8");
  ctx.fillStyle = bellyGrad;
  ctx.beginPath();
  ctx.ellipse(0, s * 0.12, s * 0.55, s * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();

  // Back stripe (darker fur)
  ctx.fillStyle = "rgba(140, 100, 60, 0.3)";
  ctx.beginPath();
  ctx.ellipse(0, -s * 0.35, s * 0.3, s * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // === EARS ===
  // Left ear
  drawEar(ctx, -s * 0.55, -s * 0.5, s * 0.22, -0.3);
  // Right ear
  drawEar(ctx, s * 0.55, -s * 0.5, s * 0.22, 0.3);

  // === FACE ===
  // Eyes
  if (h.animation === "sleep") {
    drawSleepingEyes(ctx, s);
  } else if (h.animation === "happy") {
    drawHappyEyes(ctx, s);
  } else if (h.animation === "surprised") {
    drawSurprisedEyes(ctx, s);
  } else {
    drawNormalEyes(ctx, s);
  }

  // Nose
  ctx.fillStyle = "#e8888a";
  ctx.beginPath();
  ctx.ellipse(0, s * 0.05, 3.5 * scale, 2.5 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  // Nose highlight
  ctx.fillStyle = "rgba(255,200,200,0.6)";
  ctx.beginPath();
  ctx.ellipse(-1 * scale, s * 0.03, 1.5 * scale, 1 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  if (h.animation === "happy" || h.animation === "eat") {
    ctx.strokeStyle = "#a06050";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-3 * scale, s * 0.12, 3 * scale, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(3 * scale, s * 0.12, 3 * scale, 0, Math.PI);
    ctx.stroke();
  }

  // === CHEEKS ===
  const cheekSize = h.animation === "eat" ? s * 0.38 : s * 0.22;
  // Left cheek
  const cheekGrad = ctx.createRadialGradient(-s * 0.4, s * 0.05, 0, -s * 0.4, s * 0.05, cheekSize);
  cheekGrad.addColorStop(0, "rgba(255, 160, 160, 0.5)");
  cheekGrad.addColorStop(1, "rgba(255, 160, 160, 0)");
  ctx.fillStyle = cheekGrad;
  ctx.beginPath();
  ctx.arc(-s * 0.4, s * 0.05, cheekSize, 0, Math.PI * 2);
  ctx.fill();
  // Right cheek
  const cheekGrad2 = ctx.createRadialGradient(s * 0.4, s * 0.05, 0, s * 0.4, s * 0.05, cheekSize);
  cheekGrad2.addColorStop(0, "rgba(255, 160, 160, 0.5)");
  cheekGrad2.addColorStop(1, "rgba(255, 160, 160, 0)");
  ctx.fillStyle = cheekGrad2;
  ctx.beginPath();
  ctx.arc(s * 0.4, s * 0.05, cheekSize, 0, Math.PI * 2);
  ctx.fill();

  // === WHISKERS ===
  ctx.strokeStyle = "rgba(120, 100, 80, 0.4)";
  ctx.lineWidth = 0.8;
  for (const side of [-1, 1]) {
    for (const angle of [-0.15, 0, 0.15]) {
      ctx.beginPath();
      ctx.moveTo(side * s * 0.2, s * 0.08);
      ctx.lineTo(side * s * 0.7, s * 0.08 + angle * 25);
      ctx.stroke();
    }
  }

  // === TINY PAWS (visible from top) ===
  if (h.animation === "walk") {
    const pawOffset = Math.sin(h.animFrame * 0.4) * 4;
    ctx.fillStyle = "#e8c49a";
    ctx.beginPath();
    ctx.ellipse(-s * 0.35, s * 0.55 + pawOffset, 5 * scale, 3 * scale, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(s * 0.35, s * 0.55 - pawOffset, 5 * scale, 3 * scale, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Zzz for sleep
  if (h.animation === "sleep") {
    const zzAlpha = 0.5 + Math.sin(h.animFrame * 0.2) * 0.3;
    ctx.globalAlpha = zzAlpha;
    ctx.font = `${16 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = "#666";
    ctx.fillText("z", s * 0.5, -s * 0.7);
    ctx.font = `${12 * scale}px sans-serif`;
    ctx.fillText("z", s * 0.7, -s * 0.9);
    ctx.font = `${9 * scale}px sans-serif`;
    ctx.fillText("z", s * 0.85, -s * 1.05);
    ctx.globalAlpha = 1;
  }

  // Tail (tiny)
  ctx.fillStyle = "#c4956a";
  ctx.beginPath();
  ctx.ellipse(-s * 0.05, s * 0.7, 4 * scale, 3 * scale, 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawEar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  // Outer ear
  const earGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  earGrad.addColorStop(0, "#d4a574");
  earGrad.addColorStop(1, "#b8864a");
  ctx.fillStyle = earGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, r, r * 1.1, 0, 0, Math.PI * 2);
  ctx.fill();

  // Inner ear (pink)
  const innerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.65);
  innerGrad.addColorStop(0, "#f8bbd0");
  innerGrad.addColorStop(1, "#f48fb1");
  ctx.fillStyle = innerGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.6, r * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawNormalEyes(ctx: CanvasRenderingContext2D, s: number) {
  for (const side of [-1, 1]) {
    const ex = side * s * 0.25;
    const ey = -s * 0.15;

    // Eye white
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(ex, ey, 4, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine (large)
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ex + side * 1.2, ey - 1.5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine (small)
    ctx.beginPath();
    ctx.arc(ex - side * 0.8, ey + 1, 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHappyEyes(ctx: CanvasRenderingContext2D, s: number) {
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(side * s * 0.25, -s * 0.13, 4, 0.1, Math.PI - 0.1);
    ctx.stroke();
  }
}

function drawSleepingEyes(ctx: CanvasRenderingContext2D, s: number) {
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(side * s * 0.25 - 4, -s * 0.15);
    ctx.lineTo(side * s * 0.25 + 4, -s * 0.15);
    ctx.stroke();
  }
}

function drawSurprisedEyes(ctx: CanvasRenderingContext2D, s: number) {
  for (const side of [-1, 1]) {
    const ex = side * s * 0.25;
    const ey = -s * 0.15;

    // Larger white circle
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ex, ey, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Pupil
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(ex, ey, 3, 0, Math.PI * 2);
    ctx.fill();

    // Shine
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ex + side, ey - 1.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
