"use client";

import { Modal } from "./Modal";

interface Props {
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ level, onClose }: Props) {
  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div className="text-5xl mb-3">{"\u2B50"}</div>
        <h2 className="text-xl font-bold text-amber-900 mb-2">Level Up!</h2>
        <p className="text-amber-700 mb-4">Intimacy Level {level} reached!</p>
        <div className="bg-amber-50 rounded-lg p-3 mb-4 text-sm text-amber-800">
          Your hamster trusts you more now!
        </div>
        <button onClick={onClose} className="w-full py-3 bg-amber-500 text-white rounded-lg font-bold active:bg-amber-600">
          Yay!
        </button>
      </div>
    </Modal>
  );
}
