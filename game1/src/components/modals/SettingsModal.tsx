"use client";

import { Modal } from "./Modal";
import { deleteSave } from "@/game/save";
import { formatNumber } from "@/game/format";

interface Props {
  channelName: string;
  subscribers: number;
  prestigeCount: number;
  totalClicks: number;
  totalPlayTime: number;
  canPrestige: boolean;
  onPrestigeOpen: () => void;
  onClose: () => void;
}

export function SettingsModal({
  channelName,
  subscribers,
  prestigeCount,
  totalClicks,
  totalPlayTime,
  canPrestige,
  onPrestigeOpen,
  onClose,
}: Props) {
  const hours = Math.floor(totalPlayTime / 3600);
  const minutes = Math.floor((totalPlayTime % 3600) / 60);

  const handleShare = async () => {
    const text = `My channel "${channelName}" just hit ${formatNumber(subscribers)} subscribers in YouTuber Tycoon! Can you beat me?`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "YouTuber Tycoon", text });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  return (
    <Modal onClose={onClose}>
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">Settings</h2>

        <div className="space-y-2 text-sm text-gray-400 mb-4">
          <div>Channel: {channelName}</div>
          <div>Prestige: {prestigeCount}x</div>
          <div>Total Clicks: {totalClicks.toLocaleString()}</div>
          <div>Play Time: {hours}h {minutes}m</div>
        </div>

        <button
          onClick={handleShare}
          className="w-full py-3 mb-3 bg-blue-600 rounded-lg font-bold active:bg-blue-700 transition-colors"
        >
          Share Progress
        </button>

        {canPrestige && (
          <button
            onClick={() => {
              onClose();
              onPrestigeOpen();
            }}
            className="w-full py-3 mb-3 bg-purple-600 rounded-lg font-bold active:bg-purple-700 transition-colors"
          >
            New Channel (Prestige)
          </button>
        )}

        <button
          onClick={() => {
            if (confirm("Are you sure? This will delete ALL your progress!")) {
              deleteSave();
              window.location.reload();
            }
          }}
          className="w-full py-3 mb-3 bg-red-900/50 text-red-400 rounded-lg font-bold active:bg-red-900 transition-colors"
        >
          Reset All Data
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-600 rounded-lg font-bold active:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
