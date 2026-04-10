"use client";

import { Modal } from "./Modal";
import { formatNumber } from "@/game/format";
import { OfflineReport } from "@/game/useGame";
import { t } from "@/game/i18n";

interface Props {
  report: OfflineReport;
  onClose: () => void;
}

export function OfflineModal({ report, onClose }: Props) {
  const hours = Math.floor(report.offlineSeconds / 3600);
  const minutes = Math.floor((report.offlineSeconds % 3600) / 60);

  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div className="text-4xl mb-3">&#x1F4A4;</div>
        <h2 className="text-xl font-bold mb-2">{t("modal.welcomeBack")}</h2>
        <p className="text-gray-400 mb-4">
          {t("modal.whileAway")} ({hours > 0 ? `${hours}h ` : ""}{minutes}m)...
        </p>
        <div className="bg-gray-700/50 rounded-lg p-4 mb-4 space-y-2">
          <div className="text-lg font-bold text-yellow-400">
            +{formatNumber(report.offlineViews)} {t("stats.views")}
          </div>
          {report.offlineMoney > 0 && (
            <div className="text-green-400">
              +${formatNumber(report.offlineMoney)}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 bg-red-600 rounded-lg font-bold active:bg-red-700 transition-colors"
        >
          {t("modal.collect")}
        </button>
      </div>
    </Modal>
  );
}
