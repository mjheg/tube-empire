"use client";

import { useState } from "react";

interface Props {
  onSubmit: (name: string) => void;
}

export function NameInput({ onSubmit }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed.length > 0) onSubmit(trimmed);
  };

  return (
    <div className="h-dvh bg-amber-50 flex flex-col items-center justify-center px-6">
      <div className="text-7xl mb-4">{"\u{1F439}"}</div>
      <h1 className="text-3xl font-bold text-amber-800 mb-2">Hamster Home</h1>
      <p className="text-amber-600 mb-8">Raise your own adorable hamster!</p>

      <div className="w-full max-w-sm space-y-4">
        <div>
          <label className="text-sm text-amber-700 block mb-2">Name your hamster</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="e.g. Mochi"
            maxLength={15}
            className="w-full px-4 py-3 rounded-xl bg-white border border-amber-300 text-amber-900 text-lg text-center placeholder-amber-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 select-text"
            autoFocus
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={name.trim().length === 0}
          className="w-full py-4 rounded-xl text-xl font-bold bg-amber-500 text-white disabled:bg-gray-300 disabled:text-gray-400 active:bg-amber-600 active:scale-95 transition-all"
        >
          Start!
        </button>
      </div>
    </div>
  );
}
