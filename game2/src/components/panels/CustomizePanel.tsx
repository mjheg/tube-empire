"use client";

interface Props {
  currentColor: string;
  onColorChange: (color: string) => void;
}

const HAMSTER_COLORS = [
  { id: "golden", name: "Golden", fur: "#d4a060", label: "\u{1F7E1}" },
  { id: "brown", name: "Brown", fur: "#8B6914", label: "\u{1F7E4}" },
  { id: "white", name: "White", fur: "#f0e8d8", label: "\u26AA" },
  { id: "gray", name: "Gray", fur: "#9e9e9e", label: "\u{26AB}" },
  { id: "cream", name: "Cream", fur: "#e8c890", label: "\u{1F7E0}" },
  { id: "dark", name: "Dark Brown", fur: "#5D4037", label: "\u{1F534}" },
];

export function CustomizePanel({ currentColor, onColorChange }: Props) {
  return (
    <div className="p-4 bg-white/95 backdrop-blur rounded-t-xl">
      <h3 className="text-sm font-bold text-amber-700 uppercase mb-3">Hamster Color</h3>
      <div className="flex gap-3 justify-center">
        {HAMSTER_COLORS.map((c) => (
          <button
            key={c.id}
            onClick={() => onColorChange(c.id)}
            className={`
              w-12 h-12 rounded-full border-3 transition-all flex items-center justify-center text-lg
              ${currentColor === c.id
                ? "border-amber-500 scale-110 shadow-lg"
                : "border-gray-300 active:scale-105"
              }
            `}
            style={{ backgroundColor: c.fur }}
            title={c.name}
          >
            {currentColor === c.id ? "\u2714" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

export const HAMSTER_COLOR_MAP: Record<string, { fur: number[]; dark: number[]; belly: number[] }> = {
  golden: { fur: [0.82, 0.62, 0.38], dark: [0.6, 0.4, 0.22], belly: [0.97, 0.94, 0.89] },
  brown: { fur: [0.55, 0.41, 0.08], dark: [0.35, 0.25, 0.05], belly: [0.9, 0.85, 0.75] },
  white: { fur: [0.94, 0.91, 0.85], dark: [0.82, 0.78, 0.72], belly: [0.98, 0.97, 0.95] },
  gray: { fur: [0.62, 0.62, 0.62], dark: [0.42, 0.42, 0.42], belly: [0.88, 0.88, 0.88] },
  cream: { fur: [0.91, 0.78, 0.56], dark: [0.72, 0.58, 0.36], belly: [0.97, 0.95, 0.90] },
  dark: { fur: [0.36, 0.25, 0.22], dark: [0.22, 0.15, 0.12], belly: [0.75, 0.65, 0.55] },
};
