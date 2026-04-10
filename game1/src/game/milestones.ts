export interface MilestoneDef {
  subscribers: number;
  title: string;
  description: string;
  emoji: string;
}

export const MILESTONES: MilestoneDef[] = [
  { subscribers: 100, title: "First Monetization!", emoji: "\u{1F4B0}", description: "You can now earn money from views!" },
  { subscribers: 1_000, title: "Silver Button!", emoji: "\u{1F948}", description: "YouTube sent you a Silver Play Button!" },
  { subscribers: 100_000, title: "Gold Button!", emoji: "\u{1F947}", description: "Gold Play Button! You can hire an editor now!" },
  { subscribers: 1_000_000, title: "Diamond Button!", emoji: "\u{1F48E}", description: "Diamond Play Button! Time to build an MCN!" },
  { subscribers: 10_000_000, title: "Media Empire!", emoji: "\u{1F451}", description: "You've built a media empire! Prestige available!" },
];

export function getNewMilestone(
  subscribers: number,
  celebrated: number[]
): MilestoneDef | null {
  return (
    MILESTONES.find(
      (m) => subscribers >= m.subscribers && !celebrated.includes(m.subscribers)
    ) ?? null
  );
}
