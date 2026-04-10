export function drawCage(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Outer shadow (3D depth)
  ctx.fillStyle = "#8B7355";
  ctx.fillRect(0, 0, w, h);

  // Wooden frame - outer
  const frame = 12;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#c9a96e");
  grad.addColorStop(0.3, "#b8944f");
  grad.addColorStop(0.7, "#a07840");
  grad.addColorStop(1, "#8B6914");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Inner frame highlight
  ctx.fillStyle = "#d4b87a";
  ctx.fillRect(3, 3, w - 6, frame - 3);
  ctx.fillRect(3, 3, frame - 3, h - 6);

  // Inner frame shadow
  ctx.fillStyle = "#7a5c2e";
  ctx.fillRect(frame, h - frame, w - frame, frame);
  ctx.fillRect(w - frame, frame, frame, h - frame);

  // Cage floor (bedding)
  const innerX = frame;
  const innerY = frame;
  const innerW = w - frame * 2;
  const innerH = h - frame * 2;

  // Base bedding color
  ctx.fillStyle = "#f5e6c8";
  ctx.fillRect(innerX, innerY, innerW, innerH);

  // Bedding texture - wood chips
  for (let i = 0; i < 80; i++) {
    const x = innerX + (i * 73 + 17) % innerW;
    const y = innerY + (i * 97 + 31) % innerH;
    const angle = (i * 47) % 360;
    const len = 4 + (i % 3) * 2;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.fillStyle = i % 3 === 0 ? "#e8d5b0" : i % 3 === 1 ? "#dcc49a" : "#f0dfc0";
    ctx.fillRect(-len / 2, -1, len, 2);
    ctx.restore();
  }

  // Subtle inner shadow on edges
  const shadowGrad = ctx.createLinearGradient(innerX, innerY, innerX, innerY + 20);
  shadowGrad.addColorStop(0, "rgba(0,0,0,0.12)");
  shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(innerX, innerY, innerW, 20);

  const shadowGradL = ctx.createLinearGradient(innerX, innerY, innerX + 15, innerY);
  shadowGradL.addColorStop(0, "rgba(0,0,0,0.08)");
  shadowGradL.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shadowGradL;
  ctx.fillRect(innerX, innerY, 15, innerH);
}
