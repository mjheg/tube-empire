"use client";

import { useEffect } from "react";
import { Modal } from "./Modal";
import { AchievementDef } from "@/game/achievements";
import { playMilestoneSound } from "@/game/sounds";
import { t } from "@/game/i18n";

interface Props {
  achievement: AchievementDef;
  onClose: () => void;
}

export function AchievementModal({ achievement, onClose }: Props) {
  useEffect(() => { playMilestoneSound(); }, []);

  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div className="text-xs text-yellow-400 uppercase font-bold mb-2">{t("modal.achievementUnlocked")}</div>
        <div className="text-5xl mb-3">{achievement.emoji}</div>
        <h2 className="text-xl font-bold mb-1">{achievement.title}</h2>
        <p className="text-gray-400 mb-6">{achievement.description}</p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-yellow-600 rounded-lg font-bold active:bg-yellow-700 transition-colors"
        >
          {t("modal.nice")}
        </button>
      </div>
    </Modal>
  );
}
