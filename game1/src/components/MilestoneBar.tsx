"use client";

import { GameState } from "@/game/state";
import { MILESTONES } from "@/game/milestones";
import { formatNumber } from "@/game/format";
import { t } from "@/game/i18n";

interface Props {
  state: GameState;
}

export function MilestoneBar({ state }: Props) {
  const next = MILESTONES.find((m) => state.subscribers < m.subscribers);
  if (!next) return null;

  const prevIdx = MILESTONES.indexOf(next) - 1;
  const prevThreshold = prevIdx >= 0 ? MILESTONES[prevIdx].subscribers : 0;

  const progress = Math.min(
    ((state.subscribers - prevThreshold) / (next.subscribers - prevThreshold)) * 100,
    100
  );

  return (
    <div className="px-4 py-2">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{t("milestone.next")}: {next.emoji} {next.title}</span>
        <span>{formatNumber(state.subscribers)} / {formatNumber(next.subscribers)}</span>
      </div>
      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
