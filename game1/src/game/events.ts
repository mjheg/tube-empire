export interface GameEvent {
  id: string;
  title: string;
  description: string;
  emoji: string;
  effect: "views_boost" | "subscriber_boost" | "subscriber_loss" | "money_boost";
  multiplier: number;
  durationSeconds: number;
}

export const EVENTS: GameEvent[] = [
  {
    id: "algorithm",
    title: "Algorithm Boost!",
    description: "Your video got picked up by the algorithm!",
    emoji: "\u{1F680}",
    effect: "views_boost",
    multiplier: 10,
    durationSeconds: 600,
  },
  {
    id: "collab",
    title: "Collab Offer!",
    description: "A big creator wants to collab with you!",
    emoji: "\u{1F91D}",
    effect: "subscriber_boost",
    multiplier: 5,
    durationSeconds: 300,
  },
  {
    id: "hater",
    title: "Hater Attack!",
    description: "Trolls are flooding your comments...",
    emoji: "\u{1F621}",
    effect: "subscriber_loss",
    multiplier: 0.95,
    durationSeconds: 0,
  },
  {
    id: "sponsorship",
    title: "Sponsorship Deal!",
    description: "A brand wants to sponsor your video!",
    emoji: "\u{1F4B0}",
    effect: "money_boost",
    multiplier: 10,
    durationSeconds: 300,
  },
];

export function rollForEvent(): GameEvent | null {
  if (Math.random() > 0.02) return null;
  const positiveEvents = EVENTS.filter((e) => e.effect !== "subscriber_loss");
  const negativeEvents = EVENTS.filter((e) => e.effect === "subscriber_loss");
  const pool = Math.random() < 0.75 ? positiveEvents : negativeEvents;
  return pool[Math.floor(Math.random() * pool.length)];
}
