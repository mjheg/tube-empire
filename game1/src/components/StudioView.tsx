"use client";

import { SPACES } from "@/game/upgrades";

interface Props {
  spaceLevel: number;
  equipmentLevel: number;
}

const SPACE_COLORS = [
  "from-gray-800 to-gray-900", // room
  "from-slate-700 to-slate-800", // studio
  "from-zinc-600 to-zinc-800", // office
  "from-indigo-900 to-purple-950", // big studio
];

const SPACE_EMOJIS = ["\u{1F3E0}", "\u{1F5A5}\uFE0F", "\u{1F3E2}", "\u{1F3AC}"];
const EQUIP_EMOJIS = ["\u{1F4F1}", "\u{1F4F7}", "\u{1F4F8}", "\u{1F3A5}"];

export function StudioView({ spaceLevel, equipmentLevel }: Props) {
  const space = SPACES[spaceLevel];
  const spaceEmoji = SPACE_EMOJIS[spaceLevel] ?? "\u{1F3E0}";
  const equipEmoji = EQUIP_EMOJIS[equipmentLevel] ?? "\u{1F4F1}";
  const bgGradient = SPACE_COLORS[spaceLevel] ?? SPACE_COLORS[0];

  return (
    <div className={`mx-4 rounded-xl bg-gradient-to-br ${bgGradient} border border-gray-700/50 p-6 relative overflow-hidden`}>
      {/* Decorative elements based on level */}
      <div className="absolute top-2 right-3 opacity-20 text-4xl">
        {spaceLevel >= 1 && "\u{1F4A1}"}
        {spaceLevel >= 2 && " \u{1F3A8}"}
        {spaceLevel >= 3 && " \u2728"}
      </div>

      <div className="flex items-center justify-center gap-6">
        {/* Space */}
        <div className="text-center">
          <div className="text-5xl mb-1 animate-pulse-slow">{spaceEmoji}</div>
          <div className="text-xs text-gray-400">{space.name}</div>
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-gray-600/50" />

        {/* Equipment */}
        <div className="text-center">
          <div className="text-4xl mb-1">{equipEmoji}</div>
          <div className="text-xs text-gray-400">Camera</div>
        </div>

        {/* Team indicator */}
        <div className="w-px h-12 bg-gray-600/50" />

        <div className="text-center">
          <div className="text-2xl mb-1">
            {equipmentLevel >= 3 ? "\u{1F451}" : equipmentLevel >= 2 ? "\u{1F31F}" : equipmentLevel >= 1 ? "\u2B50" : "\u{1F331}"}
          </div>
          <div className="text-xs text-gray-400">Level</div>
        </div>
      </div>
    </div>
  );
}
