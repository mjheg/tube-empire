"use client";

import { Modal } from "./Modal";
import { OfflineReport } from "@/game/save";

interface Props {
  report: OfflineReport;
  hamsterName: string;
  onClose: () => void;
}

export function OfflineModal({ report, hamsterName, onClose }: Props) {
  const hours = Math.floor(report.offlineMinutes / 60);
  const mins = report.offlineMinutes % 60;

  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div className="text-5xl mb-3">{"\u{1F439}"}</div>
        <h2 className="text-xl font-bold text-amber-900 mb-2">Welcome back!</h2>
        <p className="text-amber-700 mb-4">
          {hamsterName} was alone for {hours > 0 ? `${hours}h ` : ""}{mins}m
        </p>
        <div className="bg-amber-50 rounded-lg p-3 mb-4 text-sm text-amber-800">
          <div>Hunger decreased a bit</div>
          <div className="mt-1 font-bold">Go pet and feed {hamsterName}!</div>
        </div>
        <button onClick={onClose} className="w-full py-3 bg-amber-500 text-white rounded-lg font-bold active:bg-amber-600">
          Let&apos;s go!
        </button>
      </div>
    </Modal>
  );
}
