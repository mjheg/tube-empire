"use client";

import { HamsterState } from "@/game/state";
import { getHappinessEmoji } from "@/game/stats";
import { getGrowthLabel } from "@/game/growth";

interface Props {
  state: HamsterState;
}

export function StatusBar({ state }: Props) {
  return (
    <div className="px-4 py-3 bg-amber-100 border-b border-amber-300">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-lg font-bold text-amber-900">
            {"\u{1F439}"} {state.name}
          </div>
          <div className="text-xs text-amber-700">
            {getGrowthLabel(state.growthStage)} · Lv.{state.intimacyLevel}
          </div>
        </div>
        <div className="flex gap-3 text-sm">
          <span title="Happiness">{getHappinessEmoji(state.happiness)}</span>
          <span title="Hunger">{state.hunger > 50 ? "\u{1F35A}" : "\u{1F37D}\uFE0F"}</span>
          <span title="Energy">{state.energy > 50 ? "\u26A1" : "\u{1F4A4}"}</span>
          <span className="text-amber-800 font-bold">{"\u{1FA99}"}{state.coins}</span>
        </div>
      </div>
    </div>
  );
}
