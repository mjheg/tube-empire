"use client";

import { Modal } from "./Modal";
import { getPrestigeBonus } from "@/game/prestige";

interface Props {
  prestigeCount: number;
  onPrestige: () => void;
  onClose: () => void;
}

export function PrestigeModal({ prestigeCount, onPrestige, onClose }: Props) {
  const nextBonus = getPrestigeBonus(prestigeCount + 1);

  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div className="text-5xl mb-3">&#x1F504;</div>
        <h2 className="text-xl font-bold mb-2">New Channel (Prestige)?</h2>
        <p className="text-gray-400 text-sm mb-4">
          Start over with permanent bonuses. All progress will be reset, but you will grow much faster.
        </p>

        <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
          <div className="font-bold text-yellow-400">{nextBonus.description}</div>
          <div className="text-xs text-gray-400 mt-1">
            Prestige #{prestigeCount + 1}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-600 rounded-lg font-bold active:bg-gray-700 transition-colors"
          >
            Not Yet
          </button>
          <button
            onClick={() => {
              onPrestige();
              onClose();
            }}
            className="flex-1 py-3 bg-purple-600 rounded-lg font-bold active:bg-purple-700 transition-colors"
          >
            Prestige!
          </button>
        </div>
      </div>
    </Modal>
  );
}
