"use client";

import { GameState } from "@/game/state";
import { formatNumber, formatMoney } from "@/game/format";
import { CATEGORIES } from "@/game/categories";
import { t } from "@/game/i18n";

interface Props {
  state: GameState;
}

export function StatsBar({ state }: Props) {
  const trending = CATEGORIES[state.currentTrending];

  return (
    <div className="px-4 py-3 bg-gradient-to-r from-[#141b2d] to-[#1a1f3a] border-b border-indigo-900/50">
      <div className="flex justify-between items-center">
        <div>
          {state.channelName && (
            <div className="text-xs font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              {state.channelName}
            </div>
          )}
          <div className="text-lg font-bold">
            <span className="text-yellow-400 text-glow">&#9733;</span>{" "}
            <span className="text-yellow-300">{formatNumber(state.subscribers)}</span>{" "}
            <span className="text-gray-400 text-sm">{t("stats.subs")}</span>
          </div>
          <div className="text-sm">
            <span className="text-cyan-400">&#9654; {formatNumber(state.views)}</span>{" "}
            <span className="text-gray-500">{t("stats.views")}</span>
            {state.subscribers >= 100 && (
              <span className="text-emerald-400 ml-2 font-bold">{formatMoney(state.money)}</span>
            )}
          </div>
        </div>
        <div className="text-right">
          {state.viewsPerSecond > 0 && (
            <div className="text-xs text-cyan-400 font-mono">
              +{formatNumber(state.viewsPerSecond)}/s
            </div>
          )}
          {trending && (
            <div className="text-xs font-bold text-orange-400 text-glow">
              {t("stats.trending")}: {trending.emoji} {trending.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
