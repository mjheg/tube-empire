export interface Particle {
  x: number;
  y: number;
  emoji: string;
  age: number;
  speed: number;
}

let particles: Particle[] = [];

export function spawnParticle(x: number, y: number, emoji: string) {
  particles.push({ x, y, emoji, age: 0, speed: 0.5 + Math.random() * 0.5 });
}

export function spawnHearts(x: number, y: number, count: number = 3) {
  for (let i = 0; i < count; i++) {
    spawnParticle(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 20, "\u2764\uFE0F");
  }
}

export function spawnStars(x: number, y: number) {
  for (let i = 0; i < 3; i++) {
    spawnParticle(x + (Math.random() - 0.5) * 30, y - 10, "\u2B50");
  }
}

export function spawnZzz(x: number, y: number) {
  spawnParticle(x + 15, y - 10, "\u{1F4A4}");
}

export function updateAndDrawParticles(ctx: CanvasRenderingContext2D, dt: number) {
  particles = particles.filter((p) => p.age < 1);
  for (const p of particles) {
    p.age += dt * p.speed;
    p.y -= dt * 40;
    ctx.globalAlpha = 1 - p.age;
    ctx.font = "20px serif";
    ctx.textAlign = "center";
    ctx.fillText(p.emoji, p.x, p.y);
  }
  ctx.globalAlpha = 1;
}
