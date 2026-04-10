"use client";

import { Modal } from "./Modal";
import { DAILY_REWARDS } from "@/game/daily";
import { formatNumber } from "@/game/format";

interface Props {
  streak: number;
  onClaim: () => void;
  onClose: () => void;
}

export function DailyRewardModal({ streak, onClaim, onClose }: Props) {
  const rewardIndex = streak % 7;
  const reward = DAILY_REWARDS[rewardIndex];

  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div className="text-4xl mb-3">&#x1F381;</div>
        <h2 className="text-xl font-bold mb-1">Daily Reward!</h2>
        <p className="text-gray-400 text-sm mb-4">Day {streak + 1} streak</p>

        <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
          <div className="text-3xl mb-2">{reward.emoji}</div>
          <div className="font-bold">{reward.description}</div>
          <div className="text-sm text-gray-400 mt-1">
            +{formatNumber(reward.viewsBonus)} views
            {reward.subscriberBonus > 0 && ` +${formatNumber(reward.subscriberBonus)} subs`}
          </div>
        </div>

        <button
          onClick={onClaim}
          className="w-full py-3 bg-green-600 rounded-lg font-bold active:bg-green-700 transition-colors"
        >
          Claim!
        </button>
      </div>
    </Modal>
  );
}
