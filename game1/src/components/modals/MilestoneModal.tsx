"use client";

import { Modal } from "./Modal";
import { MilestoneDef } from "@/game/milestones";
import { useEffect } from "react";
import { playMilestoneSound } from "@/game/sounds";
import { t } from "@/game/i18n";

interface Props {
  milestone: MilestoneDef;
  onClose: () => void;
}

export function MilestoneModal({ milestone, onClose }: Props) {
  useEffect(() => { playMilestoneSound(); }, []);

  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div className="text-6xl mb-3">{milestone.emoji}</div>
        <h2 className="text-2xl font-bold mb-2">{milestone.title}</h2>
        <p className="text-gray-400 mb-6">{milestone.description}</p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-yellow-600 rounded-lg font-bold active:bg-yellow-700 transition-colors"
        >
          {t("modal.awesome")}
        </button>
      </div>
    </Modal>
  );
}
