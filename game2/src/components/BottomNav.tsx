"use client";

export type ModeId = "move" | "interact" | "customize" | "feed";

interface Props {
  activeMode: ModeId;
  onModeChange: (mode: ModeId) => void;
}

const MODES: { id: ModeId; emoji: string; label: string }[] = [
  { id: "move", emoji: "\u271A", label: "Move" },
  { id: "interact", emoji: "\u{1F449}", label: "Pet" },
  { id: "feed", emoji: "\u{1F955}", label: "Feed" },
  { id: "customize", emoji: "\u{1F9E9}", label: "Customize" },
];

export function BottomNav({ activeMode, onModeChange }: Props) {
  return (
    <nav className="flex justify-center gap-4 py-3 px-4">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center text-2xl
            transition-all shadow-lg border-2
            ${activeMode === mode.id
              ? "bg-white text-amber-700 border-amber-400 scale-110"
              : "bg-white/80 text-gray-600 border-transparent active:bg-white active:scale-105"
            }
          `}
          title={mode.label}
        >
          {mode.emoji}
        </button>
      ))}
    </nav>
  );
}
