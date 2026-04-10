"use client";

import { Modal } from "./Modal";
import { deleteSave } from "@/game/save";

interface Props {
  hamsterName: string;
  intimacyLevel: number;
  totalPets: number;
  onClose: () => void;
}

export function SettingsModal({ hamsterName, intimacyLevel, totalPets, onClose }: Props) {
  return (
    <Modal onClose={onClose}>
      <div>
        <h2 className="text-xl font-bold text-amber-900 mb-4 text-center">Settings</h2>
        <div className="space-y-2 text-sm text-amber-700 mb-4">
          <div>Hamster: {hamsterName}</div>
          <div>Intimacy Level: {intimacyLevel}</div>
          <div>Total Pets: {totalPets}</div>
        </div>
        <button
          onClick={() => {
            if (confirm("Reset all data? Your hamster will be gone!")) {
              deleteSave();
              window.location.reload();
            }
          }}
          className="w-full py-3 mb-3 bg-red-100 text-red-600 rounded-lg font-bold active:bg-red-200"
        >
          Reset All Data
        </button>
        <button onClick={onClose} className="w-full py-3 bg-amber-100 text-amber-700 rounded-lg font-bold active:bg-amber-200">
          Close
        </button>
      </div>
    </Modal>
  );
}
