"use client";

import { useState } from "react";
import { t } from "@/game/i18n";

interface Props {
  onSubmit: (name: string) => void;
}

export function ChannelNameInput({ onSubmit }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed.length > 0) {
      onSubmit(trimmed);
    }
  };

  return (
    <div className="min-h-dvh bg-gray-900 flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              animationDelay: `${(i * 0.3) % 3}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <div className="text-7xl mb-4 animate-bounce-slow">&#x1F3AC;</div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
          {t("start.title")}
        </h1>
        <p className="text-gray-400 mb-2">{t("start.subtitle")}</p>
        <p className="text-sm text-gray-500 mb-8">{t("start.flow")}</p>

        <div className="w-full max-w-sm space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-2">{t("start.nameLabel")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={t("start.namePlaceholder")}
              maxLength={20}
              className="
                w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600
                text-white text-lg text-center placeholder-gray-500
                focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                select-text
              "
              autoFocus
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={name.trim().length === 0}
            className="
              w-full py-4 rounded-xl text-xl font-bold transition-all
              bg-gradient-to-r from-red-500 to-red-600
              disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400
              active:from-red-600 active:to-red-800 active:scale-95
              shadow-lg shadow-red-900/30
            "
          >
            {t("start.button")} &#x1F680;
          </button>
        </div>
      </div>
    </div>
  );
}
