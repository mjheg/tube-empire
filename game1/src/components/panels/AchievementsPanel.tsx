"use client";

import { ACHIEVEMENTS } from "@/game/achievements";
import { GameState } from "@/game/state";
import { t } from "@/game/i18n";

interface Props {
  state: GameState;
}

export function AchievementsPanel({ state }: Props) {
  return (
    <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
      <h3 className="text-sm font-bold text-gray-400 uppercase">
        {t("achievements.title")} ({state.achievements.length}/{ACHIEVEMENTS.length})
      </h3>
      {ACHIEVEMENTS.map((a) => {
        const unlocked = state.achievements.includes(a.id);
        return (
          <div
            key={a.id}
            className={`p-3 rounded-lg border transition-colors ${unlocked ? "border-yellow-600/50 bg-yellow-900/20 text-yellow-300" : "border-gray-700 bg-gray-800/50 text-gray-500"}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{unlocked ? a.emoji : "?"}</span>
              <div>
                <div className="font-medium">{unlocked ? a.title : "???"}</div>
                <div className="text-xs opacity-70">{unlocked ? a.description : t("achievements.locked")}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
