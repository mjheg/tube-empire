"use client";

export type TabId = "equipment" | "team" | "channel" | "achievements" | "shop";

interface Props {
  activeTab: TabId | null;
  onTabChange: (tab: TabId | null) => void;
}

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: "equipment", label: "Equipment", emoji: "\u{1F4F7}" },
  { id: "team", label: "Team", emoji: "\u{1F465}" },
  { id: "channel", label: "Channel", emoji: "\u{1F4FA}" },
  { id: "achievements", label: "Trophies", emoji: "\u{1F3C6}" },
  { id: "shop", label: "Shop", emoji: "\u{1F6D2}" },
];

export function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="flex border-t border-gray-700 bg-gray-800/90 backdrop-blur safe-bottom">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(activeTab === tab.id ? null : tab.id)}
          className={`
            flex-1 py-3 text-center text-xs font-medium transition-colors
            ${activeTab === tab.id
              ? "text-red-400 bg-gray-700/50"
              : "text-gray-400 active:text-gray-200"
            }
          `}
        >
          <div className="text-lg">{tab.emoji}</div>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
