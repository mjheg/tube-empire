import { PlacedItem } from "@/game/state";
import { getItemDef } from "@/game/items";

export function drawItems(ctx: CanvasRenderingContext2D, items: PlacedItem[], w: number, h: number) {
  for (const placed of items) {
    const x = placed.x * w;
    const y = placed.y * h;

    switch (placed.itemId) {
      case "water-bottle": drawWaterBottle(ctx, x, y, w); break;
      case "food-bowl": drawFoodBowl(ctx, x, y, w); break;
      case "wheel": drawWheel(ctx, x, y, w); break;
      case "house": drawHouse(ctx, x, y, w); break;
      case "tunnel": drawTunnel(ctx, x, y, w); break;
      case "seesaw": drawSeesaw(ctx, x, y, w); break;
      case "hammock": drawHammock(ctx, x, y, w); break;
      case "castle": drawCastle(ctx, x, y, w); break;
      default: drawGenericItem(ctx, x, y, w, placed.itemId); break;
    }
  }
}

function drawWaterBottle(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  const scale = w / 400;
  const bw = 30 * scale;
  const bh = 70 * scale;

  ctx.save();
  ctx.translate(x, y);

  // Bottle body (transparent plastic look)
  const bottleGrad = ctx.createLinearGradient(-bw / 2, 0, bw / 2, 0);
  bottleGrad.addColorStop(0, "rgba(180, 210, 240, 0.7)");
  bottleGrad.addColorStop(0.3, "rgba(220, 240, 255, 0.8)");
  bottleGrad.addColorStop(0.7, "rgba(180, 210, 240, 0.7)");
  bottleGrad.addColorStop(1, "rgba(150, 190, 220, 0.6)");
  ctx.fillStyle = bottleGrad;
  ctx.beginPath();
  ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 5 * scale);
  ctx.fill();

  // Water inside
  const waterH = bh * 0.6;
  const waterGrad = ctx.createLinearGradient(0, bh / 2 - waterH, 0, bh / 2);
  waterGrad.addColorStop(0, "#64b5f6");
  waterGrad.addColorStop(1, "#1e88e5");
  ctx.fillStyle = waterGrad;
  ctx.beginPath();
  ctx.roundRect(-bw / 2 + 3 * scale, bh / 2 - waterH, bw - 6 * scale, waterH - 3 * scale, 3 * scale);
  ctx.fill();

  // Spout (metal tube going down)
  ctx.fillStyle = "#b0bec5";
  ctx.fillRect(-3 * scale, bh / 2, 6 * scale, 15 * scale);

  // Highlight reflection
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(-bw / 2 + 4 * scale, -bh / 2 + 4 * scale, 6 * scale, bh * 0.4);

  // Mounting bracket
  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(-bw / 2 - 5 * scale, -bh * 0.15, bw + 10 * scale, 8 * scale);
  ctx.fillRect(-bw / 2 - 5 * scale, bh * 0.15, bw + 10 * scale, 8 * scale);

  ctx.restore();
}

function drawFoodBowl(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  const scale = w / 400;
  const r = 22 * scale;

  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.beginPath();
  ctx.ellipse(3 * scale, 5 * scale, r + 2, r * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bowl outer
  const bowlGrad = ctx.createRadialGradient(0, 0, r * 0.3, 0, 0, r);
  bowlGrad.addColorStop(0, "#ff8a65");
  bowlGrad.addColorStop(1, "#e64a19");
  ctx.fillStyle = bowlGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, r, r * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bowl inner
  ctx.fillStyle = "#ffab91";
  ctx.beginPath();
  ctx.ellipse(0, -2 * scale, r * 0.7, r * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Seeds inside
  ctx.fillStyle = "#8d6e63";
  for (let i = 0; i < 5; i++) {
    const sx = (i - 2) * 5 * scale;
    const sy = -3 * scale + (i % 2) * 3 * scale;
    ctx.beginPath();
    ctx.ellipse(sx, sy, 3 * scale, 2 * scale, i * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawWheel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  const scale = w / 400;
  const r = 50 * scale;

  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.beginPath();
  ctx.ellipse(4 * scale, 6 * scale, r + 5, r * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stand
  ctx.fillStyle = "#78909c";
  ctx.fillRect(-5 * scale, r * 0.3, 10 * scale, r * 0.5);

  // Wheel outer ring
  const wheelGrad = ctx.createRadialGradient(0, 0, r * 0.7, 0, 0, r);
  wheelGrad.addColorStop(0, "#9fa8da");
  wheelGrad.addColorStop(1, "#5c6bc0");
  ctx.fillStyle = wheelGrad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Wheel inner (lighter)
  ctx.fillStyle = "#c5cae9";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
  ctx.fill();

  // Spokes
  ctx.strokeStyle = "#7986cb";
  ctx.lineWidth = 2 * scale;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * r * 0.85, Math.sin(angle) * r * 0.85);
    ctx.stroke();
  }

  // Center hub
  ctx.fillStyle = "#3949ab";
  ctx.beginPath();
  ctx.arc(0, 0, 5 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Highlight
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.beginPath();
  ctx.arc(-r * 0.2, -r * 0.2, r * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawHouse(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  const scale = w / 400;
  const hw = 55 * scale;
  const hh = 45 * scale;

  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.beginPath();
  ctx.ellipse(3 * scale, hh / 2 + 3 * scale, hw * 0.7, 8 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // House body
  const houseGrad = ctx.createLinearGradient(-hw / 2, 0, hw / 2, 0);
  houseGrad.addColorStop(0, "#66bb6a");
  houseGrad.addColorStop(0.5, "#81c784");
  houseGrad.addColorStop(1, "#4caf50");
  ctx.fillStyle = houseGrad;
  ctx.beginPath();
  ctx.roundRect(-hw / 2, -hh / 2, hw, hh, 8 * scale);
  ctx.fill();

  // Roof
  ctx.fillStyle = "#43a047";
  ctx.beginPath();
  ctx.roundRect(-hw / 2, -hh / 2, hw, hh * 0.3, [8 * scale, 8 * scale, 0, 0]);
  ctx.fill();

  // Door (dark hole)
  ctx.fillStyle = "#1b5e20";
  ctx.beginPath();
  ctx.arc(0, hh * 0.15, 12 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Door depth
  ctx.fillStyle = "#0d3010";
  ctx.beginPath();
  ctx.arc(0, hh * 0.15, 9 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Window
  ctx.fillStyle = "#ffee58";
  ctx.beginPath();
  ctx.roundRect(hw * 0.15, -hh * 0.15, 10 * scale, 8 * scale, 2 * scale);
  ctx.fill();

  ctx.restore();
}

function drawTunnel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  const scale = w / 400;
  const tw = 70 * scale;
  const th = 18 * scale;

  ctx.save();
  ctx.translate(x, y);

  const tunnelGrad = ctx.createLinearGradient(0, -th / 2, 0, th / 2);
  tunnelGrad.addColorStop(0, "#fdd835");
  tunnelGrad.addColorStop(1, "#f9a825");
  ctx.fillStyle = tunnelGrad;
  ctx.beginPath();
  ctx.roundRect(-tw / 2, -th / 2, tw, th, th / 2);
  ctx.fill();

  // Openings
  ctx.fillStyle = "#5d4037";
  ctx.beginPath();
  ctx.arc(-tw / 2 + 2, 0, th / 2 - 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(tw / 2 - 2, 0, th / 2 - 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawSeesaw(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  const scale = w / 400;

  ctx.save();
  ctx.translate(x, y);

  // Pivot
  ctx.fillStyle = "#8d6e63";
  ctx.beginPath();
  ctx.moveTo(0, 10 * scale);
  ctx.lineTo(-8 * scale, 20 * scale);
  ctx.lineTo(8 * scale, 20 * scale);
  ctx.fill();

  // Board
  const boardGrad = ctx.createLinearGradient(-30 * scale, 0, 30 * scale, 0);
  boardGrad.addColorStop(0, "#f48fb1");
  boardGrad.addColorStop(1, "#ec407a");
  ctx.fillStyle = boardGrad;
  ctx.save();
  ctx.rotate(-0.1);
  ctx.beginPath();
  ctx.roundRect(-35 * scale, -3 * scale, 70 * scale, 6 * scale, 3 * scale);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

function drawHammock(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  const scale = w / 400;

  ctx.save();
  ctx.translate(x, y);

  // Posts
  ctx.fillStyle = "#8d6e63";
  ctx.fillRect(-25 * scale, -15 * scale, 4 * scale, 30 * scale);
  ctx.fillRect(21 * scale, -15 * scale, 4 * scale, 30 * scale);

  // Hammock fabric
  ctx.strokeStyle = "#26a69a";
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.moveTo(-23 * scale, -10 * scale);
  ctx.quadraticCurveTo(0, 10 * scale, 23 * scale, -10 * scale);
  ctx.stroke();

  ctx.fillStyle = "rgba(38, 166, 154, 0.3)";
  ctx.beginPath();
  ctx.moveTo(-23 * scale, -10 * scale);
  ctx.quadraticCurveTo(0, 10 * scale, 23 * scale, -10 * scale);
  ctx.lineTo(23 * scale, -8 * scale);
  ctx.quadraticCurveTo(0, 12 * scale, -23 * scale, -8 * scale);
  ctx.fill();

  ctx.restore();
}

function drawCastle(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  const scale = w / 400;
  const cw = 60 * scale;
  const ch = 55 * scale;

  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.beginPath();
  ctx.ellipse(3 * scale, ch / 2, cw * 0.6, 8 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Main body
  const castleGrad = ctx.createLinearGradient(0, -ch / 2, 0, ch / 2);
  castleGrad.addColorStop(0, "#ce93d8");
  castleGrad.addColorStop(1, "#9c27b0");
  ctx.fillStyle = castleGrad;
  ctx.fillRect(-cw / 2, -ch / 2, cw, ch);

  // Towers
  const tw = 12 * scale;
  ctx.fillStyle = "#ab47bc";
  ctx.fillRect(-cw / 2 - 2, -ch / 2 - 15 * scale, tw, ch + 15 * scale);
  ctx.fillRect(cw / 2 - tw + 2, -ch / 2 - 15 * scale, tw, ch + 15 * scale);

  // Battlements
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = "#ba68c8";
    ctx.fillRect(-cw / 2 + i * 14 * scale, -ch / 2 - 8 * scale, 8 * scale, 8 * scale);
  }

  // Door
  ctx.fillStyle = "#4a148c";
  ctx.beginPath();
  ctx.arc(0, ch * 0.2, 10 * scale, Math.PI, 0);
  ctx.fillRect(-10 * scale, ch * 0.2, 20 * scale, ch * 0.3 - ch * 0.2);
  ctx.fill();

  ctx.restore();
}

function drawGenericItem(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, itemId: string) {
  const def = getItemDef(itemId);
  if (!def) return;

  const scale = w / 400;
  const iw = def.width * w;
  const ih = def.height * w;

  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = def.color;
  ctx.beginPath();
  ctx.roundRect(-iw / 2, -ih / 2, iw, ih, 5 * scale);
  ctx.fill();

  ctx.font = `${Math.min(iw, ih) * 0.5}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(def.emoji, 0, 0);

  ctx.restore();
}
