"use client";

import { CATEGORIES } from "@/game/categories";
import { formatNumber } from "@/game/format";
import { GameState } from "@/game/state";
import { t } from "@/game/i18n";

interface Props {
  state: GameState;
  onUnlock: (categoryId: number) => void;
  onSetActive: (categoryId: number) => void;
}

export function ChannelPanel({ state, onUnlock, onSetActive }: Props) {
  return (
    <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
      <h3 className="text-sm font-bold text-gray-400 uppercase">{t("panel.categories")}</h3>
      {CATEGORIES.map((cat) => {
        const unlocked = state.unlockedCategories.includes(cat.id);
        const active = state.activeCategory === cat.id;
        const canUnlock = !unlocked && state.subscribers >= cat.unlockSubscribers;
        const isTrending = state.currentTrending === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => {
              if (unlocked) onSetActive(cat.id);
              else if (canUnlock) onUnlock(cat.id);
            }}
            disabled={!unlocked && !canUnlock}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${active ? "border-red-500 bg-red-900/30 text-red-300" : unlocked ? "border-gray-600 bg-gray-800/50 text-gray-200 active:bg-gray-700/50" : canUnlock ? "border-amber-500/50 bg-amber-900/20 text-amber-300 active:bg-amber-800/40 glow-yellow" : "border-gray-700 bg-gray-800/50 text-gray-500"}`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {cat.emoji} {cat.name}
                {isTrending && <span className="ml-2 text-orange-400 text-xs">{t("stats.trending").toUpperCase()}</span>}
              </span>
              {active ? (
                <span className="text-red-400 text-xs font-bold">{t("panel.active")}</span>
              ) : !unlocked ? (
                <span className="text-sm">{formatNumber(cat.unlockSubscribers)} {t("stats.subs")}</span>
              ) : null}
            </div>
            <div className="text-xs mt-1 opacity-70">
              {cat.viewMultiplier}x {t("stats.views")} {isTrending && "(2x bonus!)"}
            </div>
          </button>
        );
      })}
    </div>
  );
}
