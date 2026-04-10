"use client";

export type TabId = "feed" | "play" | "decorate" | "shop";

interface Props {
  activeTab: TabId | null;
  onTabChange: (tab: TabId | null) => void;
}

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: "feed", label: "Feed", emoji: "\u{1F955}" },
  { id: "play", label: "Play", emoji: "\u{1F3BE}" },
  { id: "decorate", label: "Decorate", emoji: "\u{1F3A8}" },
  { id: "shop", label: "Shop", emoji: "\u{1F6D2}" },
];

export function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="flex border-t border-amber-300 bg-amber-50">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(activeTab === tab.id ? null : tab.id)}
          className={`flex-1 py-3 text-center text-xs font-medium transition-colors ${
            activeTab === tab.id
              ? "text-amber-700 bg-amber-200/60"
              : "text-amber-500 active:text-amber-700"
          }`}
        >
          <div className="text-lg">{tab.emoji}</div>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
