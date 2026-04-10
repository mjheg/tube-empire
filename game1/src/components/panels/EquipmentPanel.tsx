"use client";

import { EQUIPMENT, SPACES } from "@/game/upgrades";
import { formatMoney } from "@/game/format";
import { GameState } from "@/game/state";
import { t } from "@/game/i18n";

interface Props {
  state: GameState;
  onBuyEquipment: (level: number) => void;
  onBuySpace: (level: number) => void;
}

export function EquipmentPanel({ state, onBuyEquipment, onBuySpace }: Props) {
  return (
    <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
      <h3 className="text-sm font-bold text-gray-400 uppercase">{t("panel.camera")}</h3>
      {EQUIPMENT.map((eq, i) => {
        const owned = i <= state.equipmentLevel;
        const canBuy = !owned && i === state.equipmentLevel + 1 && state.money >= eq.cost;
        return (
          <button
            key={eq.id}
            disabled={owned || !canBuy}
            onClick={() => canBuy && onBuyEquipment(i)}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${owned ? "border-green-600/50 bg-green-900/20 text-green-400" : canBuy ? "border-yellow-600/50 bg-yellow-900/20 text-yellow-300 active:bg-yellow-900/40" : "border-gray-700 bg-gray-800/50 text-gray-500"}`}
          >
            <div className="flex justify-between">
              <span className="font-medium">{eq.name}</span>
              {owned ? <span className="text-green-400 text-sm">{t("panel.owned")}</span> : <span className="text-sm">{formatMoney(eq.cost)}</span>}
            </div>
            <div className="text-xs mt-1 opacity-70">{eq.effect}</div>
          </button>
        );
      })}

      <h3 className="text-sm font-bold text-gray-400 uppercase pt-2">{t("panel.studio")}</h3>
      {SPACES.map((sp, i) => {
        const owned = i <= state.spaceLevel;
        const canBuy = !owned && i === state.spaceLevel + 1 && state.money >= sp.cost;
        return (
          <button
            key={sp.id}
            disabled={owned || !canBuy}
            onClick={() => canBuy && onBuySpace(i)}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${owned ? "border-green-600/50 bg-green-900/20 text-green-400" : canBuy ? "border-yellow-600/50 bg-yellow-900/20 text-yellow-300 active:bg-yellow-900/40" : "border-gray-700 bg-gray-800/50 text-gray-500"}`}
          >
            <div className="flex justify-between">
              <span className="font-medium">{sp.name}</span>
              {owned ? <span className="text-green-400 text-sm">{t("panel.owned")}</span> : <span className="text-sm">{formatMoney(sp.cost)}</span>}
            </div>
            <div className="text-xs mt-1 opacity-70">{sp.effect}</div>
          </button>
        );
      })}
    </div>
  );
}
