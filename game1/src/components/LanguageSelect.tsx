"use client";

import { Lang } from "@/game/i18n";

interface Props {
  onSelect: (lang: Lang) => void;
}

export function LanguageSelect({ onSelect }: Props) {
  return (
    <div className="min-h-dvh bg-gray-900 flex flex-col items-center justify-center px-6">
      <div className="text-6xl mb-6">&#x1F30F;</div>
      <h1 className="text-2xl font-bold mb-8">Select Language / 언어 선택</h1>

      <div className="w-full max-w-xs space-y-4">
        <button
          onClick={() => onSelect("en")}
          className="
            w-full py-5 rounded-xl text-xl font-bold transition-all
            bg-gray-800 border-2 border-gray-600
            active:border-red-500 active:bg-gray-700 active:scale-95
          "
        >
          &#x1F1FA;&#x1F1F8; English
        </button>

        <button
          onClick={() => onSelect("ko")}
          className="
            w-full py-5 rounded-xl text-xl font-bold transition-all
            bg-gray-800 border-2 border-gray-600
            active:border-red-500 active:bg-gray-700 active:scale-95
          "
        >
          &#x1F1F0;&#x1F1F7; 한국어
        </button>
      </div>
    </div>
  );
}
