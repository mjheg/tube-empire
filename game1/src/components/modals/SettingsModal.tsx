"use client";

import { Modal } from "./Modal";
import { deleteSave } from "@/game/save";
import { formatNumber } from "@/game/format";
import { t } from "@/game/i18n";

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
    const text = t("share.text", { name: channelName, subs: formatNumber(subscribers) });

    if (navigator.share) {
      try {
        await navigator.share({ title: "YouTuber Tycoon", text });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert(t("share.copied"));
    }
  };

  return (
    <Modal onClose={onClose}>
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">{t("settings.title")}</h2>

        <div className="space-y-2 text-sm text-gray-400 mb-4">
          <div>{t("settings.channel")}: {channelName}</div>
          <div>{t("settings.prestige")}: {prestigeCount}x</div>
          <div>{t("settings.totalClicks")}: {totalClicks.toLocaleString()}</div>
          <div>{t("settings.playTime")}: {hours}h {minutes}m</div>
        </div>

        <button
          onClick={handleShare}
          className="w-full py-3 mb-3 bg-blue-600 rounded-lg font-bold active:bg-blue-700 transition-colors"
        >
          {t("settings.share")}
        </button>

        {canPrestige && (
          <button
            onClick={() => { onClose(); onPrestigeOpen(); }}
            className="w-full py-3 mb-3 bg-purple-600 rounded-lg font-bold active:bg-purple-700 transition-colors"
          >
            {t("settings.newChannel")}
          </button>
        )}

        <button
          onClick={() => {
            if (confirm(t("settings.resetConfirm"))) {
              deleteSave();
              localStorage.removeItem("yt-tycoon-lang");
              window.location.reload();
            }
          }}
          className="w-full py-3 mb-3 bg-red-900/50 text-red-400 rounded-lg font-bold active:bg-red-900 transition-colors"
        >
          {t("settings.reset")}
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-600 rounded-lg font-bold active:bg-gray-700 transition-colors"
        >
          {t("settings.close")}
        </button>
      </div>
    </Modal>
  );
}
