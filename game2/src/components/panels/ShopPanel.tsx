"use client";

import { ITEMS } from "@/game/items";
import { HamsterState } from "@/game/state";

interface Props {
  state: HamsterState;
  onBuyItem: (itemId: string, cost: number) => void;
}

export function ShopPanel({ state, onBuyItem }: Props) {
  const buyableItems = ITEMS.filter((i) => i.price > 0);
  const ownedIds = state.placedItems.map((p) => p.itemId);

  return (
    <div className="p-4 space-y-2 max-h-48 overflow-y-auto bg-amber-50">
      <h3 className="text-sm font-bold text-amber-700 uppercase">Shop</h3>
      {buyableItems.map((item) => {
        const owned = ownedIds.includes(item.id);
        const canAfford = state.coins >= item.price;
        return (
          <button
            key={item.id}
            disabled={owned || !canAfford}
            onClick={() => !owned && canAfford && onBuyItem(item.id, item.price)}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              owned
                ? "border-green-300 bg-green-50 text-green-700"
                : canAfford
                  ? "border-amber-300 bg-white text-amber-900 active:bg-amber-100"
                  : "border-gray-200 bg-gray-50 text-gray-400"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{item.emoji} {item.name}</span>
              {owned ? <span className="text-green-600 text-sm">Placed</span> : <span className="text-sm">{"\u{1FA99}"}{item.price}</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
