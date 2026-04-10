import { PlacedItem } from "@/game/state";
import { getItemDef } from "@/game/items";
import { getSprite } from "./sprites";

const ITEM_SPRITES: Record<string, { src: string; w: number; h: number }> = {
  "water-bottle": { src: "/sprites/water-bottle.svg", w: 45, h: 90 },
  "food-bowl": { src: "/sprites/food-bowl.svg", w: 60, h: 38 },
  "wheel": { src: "/sprites/wheel.svg", w: 90, h: 90 },
  "house": { src: "/sprites/house.svg", w: 75, h: 68 },
};

export function drawItems(ctx: CanvasRenderingContext2D, items: PlacedItem[], w: number, h: number) {
  const scale = w / 400;

  for (const placed of items) {
    const x = placed.x * w;
    const y = placed.y * h;
    const spriteInfo = ITEM_SPRITES[placed.itemId];

    if (spriteInfo) {
      const img = getSprite(spriteInfo.src);
      const iw = spriteInfo.w * scale;
      const ih = spriteInfo.h * scale;

      if (img) {
        // Shadow
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.beginPath();
        ctx.ellipse(x + 2 * scale, y + ih / 2, iw * 0.4, 5 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.drawImage(img, x - iw / 2, y - ih / 2, iw, ih);
      } else {
        drawFallbackItem(ctx, x, y, placed.itemId, scale);
      }
    } else {
      drawFallbackItem(ctx, x, y, placed.itemId, scale);
    }
  }
}

function drawFallbackItem(ctx: CanvasRenderingContext2D, x: number, y: number, itemId: string, scale: number) {
  const def = getItemDef(itemId);
  if (!def) return;

  const iw = 50 * scale;
  const ih = 40 * scale;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.beginPath();
  ctx.ellipse(x + 2, y + ih / 2, iw * 0.35, 4 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body with gradient
  const grad = ctx.createLinearGradient(x - iw / 2, y - ih / 2, x + iw / 2, y + ih / 2);
  grad.addColorStop(0, def.color);
  grad.addColorStop(1, adjustColor(def.color, -30));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(x - iw / 2, y - ih / 2, iw, ih, 8 * scale);
  ctx.fill();

  // Highlight
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.beginPath();
  ctx.roundRect(x - iw / 2 + 3, y - ih / 2 + 3, iw * 0.4, ih * 0.3, 4 * scale);
  ctx.fill();

  // Emoji
  ctx.font = `${Math.min(iw, ih) * 0.5}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(def.emoji, x, y);
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `rgb(${r},${g},${b})`;
}
