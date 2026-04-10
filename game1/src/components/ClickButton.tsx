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
  const [pressing, setPressing] = useState(false);

  const handleClick = useCallback(() => {
    onClick();
    playClickSound();
    const id = nextId++;
    const x = 30 + Math.random() * 40;
    const y = Math.random() * 30;
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
          {t("click.uploading")}: <span className="text-cyan-300">{lastTitle}</span>
        </div>
      )}

      {/* Floating numbers */}
      {floats.map((f) => (
        <span
          key={f.id}
          className="absolute text-yellow-300 font-bold text-lg pointer-events-none animate-float text-glow"
          style={{ left: `${f.x}%`, top: `${f.y}%` }}
        >
          +{formatNumber(f.value)}
        </span>
      ))}

      <button
        onClick={handleClick}
        onPointerDown={() => setPressing(true)}
        onPointerUp={() => setPressing(false)}
        onPointerLeave={() => setPressing(false)}
        className={`
          px-10 py-5 rounded-2xl text-xl font-bold
          bg-gradient-to-b from-red-500 via-red-600 to-red-700
          border border-red-400/30
          transition-all duration-75
          ${pressing ? "scale-90 from-red-600 to-red-800 shadow-red-900/80" : "shadow-lg shadow-red-600/40"}
        `}
        style={{
          boxShadow: pressing
            ? "0 0 20px rgba(255,50,50,0.5), inset 0 2px 4px rgba(0,0,0,0.3)"
            : "0 0 30px rgba(255,50,50,0.3), 0 4px 15px rgba(255,50,50,0.2)",
        }}
      >
        {t("click.upload")}
      </button>
    </div>
  );
}
