export function drawCage(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Cage background (bedding)
  ctx.fillStyle = "#fef9ee";
  ctx.fillRect(0, 0, w, h);

  // Bedding texture
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

  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 2;
  ctx.strokeRect(border + 2, border + 2, w - border * 2 - 4, h - border * 2 - 4);
}
