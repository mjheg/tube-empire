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
      <div className="flex justify-between text-xs mb-1">
        <span className="text-purple-300">{t("milestone.next")}: {next.emoji} {next.title}</span>
        <span className="text-gray-400 font-mono">{formatNumber(state.subscribers)} / {formatNumber(next.subscribers)}</span>
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #f59e0b, #ef4444, #ec4899)",
            boxShadow: progress > 5 ? "0 0 10px rgba(239,68,68,0.5)" : "none",
          }}
        />
      </div>
    </div>
  );
}
