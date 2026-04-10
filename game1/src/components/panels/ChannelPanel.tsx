"use client";

import { CATEGORIES } from "@/game/categories";
import { formatNumber } from "@/game/format";
import { GameState } from "@/game/state";

interface Props {
  state: GameState;
  onUnlock: (categoryId: number) => void;
  onSetActive: (categoryId: number) => void;
}

export function ChannelPanel({ state, onUnlock, onSetActive }: Props) {
  return (
    <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
      <h3 className="text-sm font-bold text-gray-400 uppercase">Video Categories</h3>
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
            className={`
              w-full text-left p-3 rounded-lg border transition-colors
              ${active
                ? "border-red-500 bg-red-900/30 text-red-300"
                : unlocked
                  ? "border-gray-600 bg-gray-800/50 text-gray-200 active:bg-gray-700/50"
                  : canUnlock
                    ? "border-yellow-600/50 bg-yellow-900/20 text-yellow-300 active:bg-yellow-900/40"
                    : "border-gray-700 bg-gray-800/50 text-gray-500"
              }
            `}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {cat.emoji} {cat.name}
                {isTrending && <span className="ml-2 text-orange-400 text-xs">TRENDING</span>}
              </span>
              {active ? (
                <span className="text-red-400 text-xs font-bold">ACTIVE</span>
              ) : !unlocked ? (
                <span className="text-sm">{formatNumber(cat.unlockSubscribers)} subs</span>
              ) : null}
            </div>
            <div className="text-xs mt-1 opacity-70">
              {cat.viewMultiplier}x views {isTrending && "(2x trending bonus!)"}
            </div>
          </button>
        );
      })}
    </div>
  );
}
