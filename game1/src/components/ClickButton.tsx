"use client";

import { useState, useCallback } from "react";
import { formatNumber } from "@/game/format";
import { generateVideoTitle } from "@/game/videoTitles";
import { playClickSound } from "@/game/sounds";
import { t } from "@/game/i18n";

interface FloatingNumber {
  id: number;
  value: number;
  x: number;
  y: number;
}

let nextId = 0;

interface Props {
  viewsPerClick: number;
  activeCategory: number;
  onClick: () => void;
}

export function ClickButton({ viewsPerClick, activeCategory, onClick }: Props) {
  const [floats, setFloats] = useState<FloatingNumber[]>([]);
  const [lastTitle, setLastTitle] = useState<string | null>(null);

  const handleClick = useCallback(() => {
    onClick();
    playClickSound();
    const id = nextId++;
    const x = 40 + Math.random() * 20;
    const y = Math.random() * 20;
    setFloats((prev) => [...prev.slice(-10), { id, value: viewsPerClick, x, y }]);
    setLastTitle(generateVideoTitle(activeCategory));
    setTimeout(() => {
      setFloats((prev) => prev.filter((f) => f.id !== id));
    }, 1000);
  }, [viewsPerClick, activeCategory, onClick]);

  return (
    <div className="relative flex flex-col items-center justify-center py-4 gap-2">
      {/* Last uploaded video title */}
      {lastTitle && (
        <div className="text-xs text-gray-400 animate-fade-in">
          {t("click.uploading")}: <span className="text-gray-200">{lastTitle}</span>
        </div>
      )}

      {/* Floating numbers */}
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
        {t("click.upload")}
      </button>
    </div>
  );
}
