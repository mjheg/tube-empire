"use client";

import { SPACES } from "@/game/upgrades";

interface Props {
  spaceLevel: number;
  equipmentLevel: number;
}

const SPACE_EMOJIS = ["\u{1F3E0}", "\u{1F5A5}\uFE0F", "\u{1F3E2}", "\u{1F3AC}"];
const EQUIP_EMOJIS = ["\u{1F4F1}", "\u{1F4F7}", "\u{1F4F8}", "\u{1F3A5}"];

export function StudioView({ spaceLevel, equipmentLevel }: Props) {
  const space = SPACES[spaceLevel];
  const spaceEmoji = SPACE_EMOJIS[spaceLevel] ?? "\u{1F3E0}";
  const equipEmoji = EQUIP_EMOJIS[equipmentLevel] ?? "\u{1F4F1}";

  return (
    <div className="flex flex-col items-center justify-center py-4 gap-2">
      <div className="text-5xl">{spaceEmoji}</div>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{equipEmoji}</span>
        <span className="text-sm text-gray-400">{space.name}</span>
      </div>
    </div>
  );
}
