"use client";

import { FOODS } from "@/game/items";
import { HamsterState } from "@/game/state";

interface Props {
  state: HamsterState;
  onFeed: (foodValue: number, cost: number) => void;
}

export function FeedPanel({ state, onFeed }: Props) {
  return (
    <div className="p-4 space-y-2 max-h-48 overflow-y-auto bg-amber-50">
      <h3 className="text-sm font-bold text-amber-700 uppercase">Food</h3>
      {FOODS.map((food) => {
        const canAfford = state.coins >= food.price;
        return (
          <button
            key={food.id}
            disabled={!canAfford}
            onClick={() => canAfford && onFeed(food.value, food.price)}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              canAfford
                ? "border-amber-300 bg-white text-amber-900 active:bg-amber-100"
                : "border-gray-200 bg-gray-50 text-gray-400"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{food.emoji} {food.name}</span>
              <span className="text-sm">{food.price === 0 ? "Free" : `\u{1FA99}${food.price}`}</span>
            </div>
            <div className="text-xs mt-1 opacity-70">Hunger +{food.value}</div>
          </button>
        );
      })}
    </div>
  );
}
