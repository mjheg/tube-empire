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
    <nav className="flex justify-center gap-3 py-3 px-4 bg-black/20 backdrop-blur-sm">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(activeTab === tab.id ? null : tab.id)}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center text-xl
            transition-all shadow-lg
            ${activeTab === tab.id
              ? "bg-white text-amber-700 scale-110"
              : "bg-white/70 text-amber-600 active:bg-white active:scale-105"
            }
          `}
          title={tab.label}
        >
          {tab.emoji}
        </button>
      ))}
    </nav>
  );
}
