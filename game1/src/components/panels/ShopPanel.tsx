"use client";

import { t } from "@/game/i18n";

export function ShopPanel() {
  return (
    <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
      <h3 className="text-sm font-bold text-gray-400 uppercase">{t("shop.title")}</h3>

      <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400">
        <div className="font-medium">{t("shop.removeAds")} — $2.99</div>
        <div className="text-xs mt-1">{t("shop.comingSoon")}</div>
      </div>

      <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400">
        <div className="font-medium">{t("shop.premiumPass")} — $4.99/mo</div>
        <div className="text-xs mt-1">{t("shop.premiumDesc")}</div>
      </div>

      <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400">
        <div className="font-medium">{t("shop.boostPack")} — $0.99</div>
        <div className="text-xs mt-1">{t("shop.boostDesc")}</div>
      </div>

      <p className="text-xs text-gray-500 text-center pt-2">{t("shop.footer")}</p>
    </div>
  );
}
