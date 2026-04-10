"use client";

import { useState, useCallback } from "react";
import { formatNumber } from "@/game/format";

interface FloatingNumber {
  id: number;
  value: number;
  x: number;
  y: number;
}

let nextId = 0;

interface Props {
  viewsPerClick: number;
  onClick: () => void;
}

export function ClickButton({ viewsPerClick, onClick }: Props) {
  const [floats, setFloats] = useState<FloatingNumber[]>([]);

  const handleClick = useCallback(() => {
    onClick();
    const id = nextId++;
    const x = 40 + Math.random() * 20;
    const y = Math.random() * 20;
    setFloats((prev) => [...prev.slice(-10), { id, value: viewsPerClick, x, y }]);
    setTimeout(() => {
      setFloats((prev) => prev.filter((f) => f.id !== id));
    }, 1000);
  }, [viewsPerClick, onClick]);

  return (
    <div className="relative flex items-center justify-center py-4">
      {floats.map((f) => (
        <span
          key={f.id}
          className="absolute text-yellow-300 font-bold text-lg pointer-events-none animate-float"
          style={{ left: `${f.x}%`, top: `${f.y}%` }}
        >
          +{formatNumber(f.value)}
        </span>
      ))}

      <button
        onClick={handleClick}
        className="
          px-8 py-4 rounded-2xl text-xl font-bold
          bg-gradient-to-b from-red-500 to-red-700
          active:from-red-600 active:to-red-800 active:scale-95
          transition-transform duration-75
          shadow-lg shadow-red-900/50
        "
      >
        Upload Video!
      </button>
    </div>
  );
}
