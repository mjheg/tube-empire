"use client";

import { t } from "@/game/i18n";

export type TabId = "equipment" | "team" | "channel" | "achievements" | "shop";

interface Props {
  activeTab: TabId | null;
  onTabChange: (tab: TabId | null) => void;
}

const TABS: { id: TabId; labelKey: "nav.equipment" | "nav.team" | "nav.channel" | "nav.trophies" | "nav.shop"; emoji: string }[] = [
  { id: "equipment", labelKey: "nav.equipment", emoji: "\u{1F4F7}" },
  { id: "team", labelKey: "nav.team", emoji: "\u{1F465}" },
  { id: "channel", labelKey: "nav.channel", emoji: "\u{1F4FA}" },
  { id: "achievements", labelKey: "nav.trophies", emoji: "\u{1F3C6}" },
  { id: "shop", labelKey: "nav.shop", emoji: "\u{1F6D2}" },
];

export function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="flex border-t border-indigo-900/50 bg-gradient-to-t from-[#0a0e1a] to-[#141b2d] safe-bottom">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(activeTab === tab.id ? null : tab.id)}
          className={`
            flex-1 py-3 text-center text-xs font-medium transition-all
            ${activeTab === tab.id
              ? "text-cyan-400 bg-cyan-500/10"
              : "text-gray-500 active:text-gray-300"
            }
          `}
        >
          <div className={`text-lg ${activeTab === tab.id ? "scale-110" : ""} transition-transform`}>
            {tab.emoji}
          </div>
          {t(tab.labelKey)}
        </button>
      ))}
    </nav>
  );
}
