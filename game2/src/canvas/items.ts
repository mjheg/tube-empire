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

    ctx.fillStyle = def.color;
    ctx.beginPath();
    const r = Math.min(iw, ih) * 0.2;
    ctx.roundRect(x - iw / 2, y - ih / 2, iw, ih, r);
    ctx.fill();

    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = `${Math.min(iw, ih) * 0.6}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(def.emoji, x, y);
  }
}
