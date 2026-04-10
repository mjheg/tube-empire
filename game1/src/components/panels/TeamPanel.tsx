"use client";

import { TEAM } from "@/game/upgrades";
import { formatMoney, formatNumber } from "@/game/format";
import { GameState } from "@/game/state";

interface Props {
  state: GameState;
  onHire: (memberId: keyof GameState["team"]) => void;
}

export function TeamPanel({ state, onHire }: Props) {
  return (
    <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
      <h3 className="text-sm font-bold text-gray-400 uppercase">Team Members</h3>
      {TEAM.map((member) => {
        const owned = state.team[member.id];
        const meetsSubscribers = state.subscribers >= member.unlockSubscribers;
        const canAfford = state.money >= member.cost;
        const canBuy = !owned && meetsSubscribers && canAfford;
        const locked = !owned && !meetsSubscribers;

        return (
          <button
            key={member.id}
            disabled={owned || !canBuy}
            onClick={() => canBuy && onHire(member.id)}
            className={`
              w-full text-left p-3 rounded-lg border transition-colors
              ${owned
                ? "border-green-600/50 bg-green-900/20 text-green-400"
                : canBuy
                  ? "border-yellow-600/50 bg-yellow-900/20 text-yellow-300 active:bg-yellow-900/40"
                  : "border-gray-700 bg-gray-800/50 text-gray-500"
              }
            `}
          >
            <div className="flex justify-between">
              <span className="font-medium">{member.name}</span>
              {owned ? (
                <span className="text-green-400 text-sm">Hired</span>
              ) : locked ? (
                <span className="text-sm">{formatNumber(member.unlockSubscribers)} subs</span>
              ) : (
                <span className="text-sm">{formatMoney(member.cost)}</span>
              )}
            </div>
            <div className="text-xs mt-1 opacity-70">
              {member.description} (+{formatNumber(member.vps)} views/s)
            </div>
          </button>
        );
      })}
    </div>
  );
}
