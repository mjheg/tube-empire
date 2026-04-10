let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.1) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available
  }
}

export function playClickSound() {
  playTone(800, 0.08, "square", 0.05);
}

export function playUpgradeSound() {
  playTone(523, 0.1, "sine", 0.08);
  setTimeout(() => playTone(659, 0.1, "sine", 0.08), 100);
  setTimeout(() => playTone(784, 0.15, "sine", 0.08), 200);
}

export function playMilestoneSound() {
  playTone(523, 0.15, "sine", 0.1);
  setTimeout(() => playTone(659, 0.15, "sine", 0.1), 150);
  setTimeout(() => playTone(784, 0.15, "sine", 0.1), 300);
  setTimeout(() => playTone(1047, 0.3, "sine", 0.12), 450);
}

export function playEventSound() {
  playTone(440, 0.1, "triangle", 0.08);
  setTimeout(() => playTone(550, 0.1, "triangle", 0.08), 120);
}

export function playDailySound() {
  playTone(600, 0.12, "sine", 0.08);
  setTimeout(() => playTone(750, 0.12, "sine", 0.08), 130);
  setTimeout(() => playTone(900, 0.2, "sine", 0.1), 260);
}
