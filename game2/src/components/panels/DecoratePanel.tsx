"use client";

import { HamsterState } from "@/game/state";
import { getItemDef } from "@/game/items";

interface Props {
  state: HamsterState;
}

export function DecoratePanel({ state }: Props) {
  return (
    <div className="p-4 bg-amber-50">
      <h3 className="text-sm font-bold text-amber-700 uppercase">Placed Items</h3>
      <div className="mt-2 space-y-1">
        {state.placedItems.map((item, i) => {
          const def = getItemDef(item.itemId);
          return (
            <div key={i} className="text-sm text-amber-800">
              {def ? `${def.emoji} ${def.name}` : item.itemId}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-amber-500 mt-3">Drag items in the cage to rearrange (coming soon)</p>
    </div>
  );
}
