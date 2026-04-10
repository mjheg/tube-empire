"use client";

import { GameState } from "@/game/state";
import { formatNumber, formatMoney } from "@/game/format";
import { CATEGORIES } from "@/game/categories";

interface Props {
  state: GameState;
}

export function StatsBar({ state }: Props) {
  const trending = CATEGORIES[state.currentTrending];

  return (
    <div className="px-4 py-3 bg-gray-800/80 backdrop-blur border-b border-gray-700">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-lg font-bold">
            <span className="text-yellow-400">&#9733;</span> {formatNumber(state.subscribers)} subs
          </div>
          <div className="text-sm text-gray-400">
            &#9654; {formatNumber(state.views)} views&nbsp;
            {state.subscribers >= 100 && (
              <span className="text-green-400">{formatMoney(state.money)}</span>
            )}
          </div>
        </div>
        <div className="text-right">
          {state.viewsPerSecond > 0 && (
            <div className="text-xs text-gray-400">
              +{formatNumber(state.viewsPerSecond)}/s
            </div>
          )}
          {trending && (
            <div className="text-xs text-orange-400">
              Trending: {trending.emoji} {trending.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
