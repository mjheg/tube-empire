"use client";

import { SPACES } from "@/game/upgrades";

interface Props {
  spaceLevel: number;
  equipmentLevel: number;
}

const SPACE_GRADIENTS = [
  "from-slate-800/80 to-gray-900/80",
  "from-blue-900/60 to-slate-900/80",
  "from-violet-900/50 to-indigo-950/80",
  "from-purple-900/50 to-fuchsia-950/60",
];

const SPACE_EMOJIS = ["\u{1F3E0}", "\u{1F5A5}\uFE0F", "\u{1F3E2}", "\u{1F3AC}"];
const EQUIP_EMOJIS = ["\u{1F4F1}", "\u{1F4F7}", "\u{1F4F8}", "\u{1F3A5}"];
const LEVEL_EMOJIS = ["\u{1F331}", "\u2B50", "\u{1F31F}", "\u{1F451}"];
const BORDER_COLORS = [
  "border-gray-700/50",
  "border-blue-700/40",
  "border-violet-600/40",
  "border-purple-500/40",
];

export function StudioView({ spaceLevel, equipmentLevel }: Props) {
  const space = SPACES[spaceLevel];
  const bgGradient = SPACE_GRADIENTS[spaceLevel];
  const borderColor = BORDER_COLORS[spaceLevel];

  return (
    <div className={`mx-4 rounded-xl bg-gradient-to-br ${bgGradient} border ${borderColor} p-6 relative overflow-hidden animate-shimmer`}>
      <div className="absolute top-2 right-3 opacity-15 text-4xl">
        {spaceLevel >= 1 && "\u{1F4A1}"}
        {spaceLevel >= 2 && " \u{1F3A8}"}
        {spaceLevel >= 3 && " \u2728"}
      </div>

      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <div className="text-5xl mb-1 animate-pulse-slow">{SPACE_EMOJIS[spaceLevel]}</div>
          <div className="text-xs text-gray-400">{space.name}</div>
        </div>

        <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-500/30 to-transparent" />

        <div className="text-center">
          <div className="text-4xl mb-1">{EQUIP_EMOJIS[equipmentLevel]}</div>
          <div className="text-xs text-gray-400">Camera</div>
        </div>

        <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-500/30 to-transparent" />

        <div className="text-center">
          <div className="text-2xl mb-1">{LEVEL_EMOJIS[equipmentLevel]}</div>
          <div className="text-xs text-gray-400">Level</div>
        </div>
      </div>
    </div>
  );
}
