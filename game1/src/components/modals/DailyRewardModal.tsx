"use client";

import { Modal } from "./Modal";
import { DAILY_REWARDS } from "@/game/daily";
import { formatNumber } from "@/game/format";
import { useEffect } from "react";
import { playDailySound } from "@/game/sounds";
import { t } from "@/game/i18n";

interface Props {
  streak: number;
  onClaim: () => void;
  onClose: () => void;
}

export function DailyRewardModal({ streak, onClaim, onClose }: Props) {
  useEffect(() => { playDailySound(); }, []);

  const rewardIndex = streak % 7;
  const reward = DAILY_REWARDS[rewardIndex];

  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div className="text-4xl mb-3">&#x1F381;</div>
        <h2 className="text-xl font-bold mb-1">{t("modal.dailyReward")}</h2>
        <p className="text-gray-400 text-sm mb-4">{streak + 1} {t("modal.dayStreak")}</p>

        <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
          <div className="text-3xl mb-2">{reward.emoji}</div>
          <div className="font-bold">{reward.description}</div>
          <div className="text-sm text-gray-400 mt-1">
            +{formatNumber(reward.viewsBonus)} {t("stats.views")}
            {reward.subscriberBonus > 0 && ` +${formatNumber(reward.subscriberBonus)} ${t("stats.subs")}`}
          </div>
        </div>

        <button
          onClick={onClaim}
          className="w-full py-3 bg-green-600 rounded-lg font-bold active:bg-green-700 transition-colors"
        >
          {t("modal.claim")}
        </button>
      </div>
    </Modal>
  );
}
