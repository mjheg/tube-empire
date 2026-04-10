"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { HamsterState, createInitialState } from "@/game/state";
import { decayStats, feed, play } from "@/game/stats";
import { updateGrowthStage, checkLevelUp } from "@/game/growth";
import { resetDailyMissions, updateMissionProgress } from "@/game/missions";
import { saveGame, loadGame, calcOfflineChanges, applyOfflineChanges, OfflineReport } from "@/game/save";
import { GameCanvas } from "./GameCanvas";
import { OfflineModal } from "./modals/OfflineModal";
import { LevelUpModal } from "./modals/LevelUpModal";
import { SettingsModal } from "./modals/SettingsModal";
import { NameInput } from "./NameInput";
import { FOODS } from "@/game/items";

export type InteractMode = "move" | "touch" | "feed";

export function Game() {
  const [state, setState] = useState<HamsterState | null>(null);
  const [mode, setMode] = useState<InteractMode>("touch");
  const [showEdit, setShowEdit] = useState(false);
  const [offlineReport, setOfflineReport] = useState<OfflineReport | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const stateRef = useRef<HamsterState | null>(null);

  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      const offline = calcOfflineChanges(saved);
      let loaded = applyOfflineChanges(saved, offline);
      loaded = updateGrowthStage(loaded);
      loaded = resetDailyMissions(loaded);
      setState(loaded);
      if (offline.offlineMinutes >= 1) setOfflineReport(offline);
    } else {
      setState(createInitialState());
    }
  }, []);

  useEffect(() => {
    if (!state) return;
    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev) return prev;
        let next = decayStats(prev);
        next = updateGrowthStage(next);
        next = updateMissionProgress(next);
        const levelResult = checkLevelUp(next);
        if (levelResult.leveledUp) {
          setLevelUp(levelResult.state.intimacyLevel);
          next = levelResult.state;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state !== null]);

  useEffect(() => {
    if (!state) return;
    const interval = setInterval(() => {
      if (stateRef.current) saveGame(stateRef.current);
    }, 10000);
    return () => clearInterval(interval);
  }, [state !== null]);

  const handleStateChange = useCallback((updater: (prev: HamsterState) => HamsterState) => {
    setState((prev) => prev ? updater(prev) : prev);
  }, []);

  const handleFeed = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      return feed(prev, FOODS[0].value); // free sunflower seed
    });
  }, []);

  const handleSave = useCallback(() => {
    if (stateRef.current) {
      saveGame(stateRef.current);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!state) return;
    const text = `Check out my hamster "${state.name}" in Hamster Home!`;
    if (navigator.share) {
      try { await navigator.share({ title: "Hamster Home", text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  }, [state]);

  const handleSetName = useCallback((name: string) => {
    setState((prev) => prev ? { ...prev, name } : prev);
  }, []);

  if (!state) {
    return <div className="h-dvh bg-amber-50 flex items-center justify-center text-amber-400">Loading...</div>;
  }

  if (!state.name) {
    return <NameInput onSubmit={handleSetName} />;
  }

  return (
    <div className="h-dvh w-full bg-[#c9a96e] relative overflow-hidden">
      {/* 3D Canvas - full screen */}
      <GameCanvas state={state} mode={mode} onStateChange={handleStateChange} onFeed={handleFeed} />

      {/* Header - like hammyhome */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-3 py-2">
        {/* Left: cage name */}
        <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-sm font-bold">
          {state.name}
        </div>

        {/* Right: share + settings */}
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="bg-black/40 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center text-white text-sm"
          >
            {"\u{1F517}"}
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="bg-black/40 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center text-white text-lg"
          >
            {"\u22EE"}
          </button>
        </div>
      </div>

      {/* Bottom interaction menu - like hammyhome */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="flex justify-center items-end gap-3 pb-6 px-4">
          {/* Move button */}
          <button
            onClick={() => setMode("move")}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition-all ${
              mode === "move"
                ? "bg-white text-gray-700 scale-110 ring-2 ring-amber-400"
                : "bg-white/70 text-gray-500"
            }`}
          >
            {"\u271A"}
          </button>

          {/* Touch/Pet button */}
          <button
            onClick={() => setMode("touch")}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition-all ${
              mode === "touch"
                ? "bg-white text-gray-700 scale-110 ring-2 ring-amber-400"
                : "bg-white/70 text-gray-500"
            }`}
          >
            {"\u{1F446}"}
          </button>

          {/* Feed button */}
          <button
            onClick={() => setMode("feed")}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition-all ${
              mode === "feed"
                ? "bg-white text-gray-700 scale-110 ring-2 ring-amber-400"
                : "bg-white/70 text-gray-500"
            }`}
          >
            {"\u{1F36A}"}
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Save button - like hammyhome */}
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-1.5 active:bg-green-600"
          >
            {"\u2714"} save
          </button>
        </div>
      </div>

      {/* Edit FAB button - like hammyhome */}
      <button
        onClick={() => setShowEdit(!showEdit)}
        className={`absolute bottom-20 right-4 z-10 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-xl transition-all ${
          showEdit
            ? "bg-amber-500 text-white rotate-45"
            : "bg-amber-500 text-white"
        }`}
      >
        {showEdit ? "\u2716" : "\u{270F}\uFE0F"}
      </button>

      {/* Edit panel - item categories like hammyhome */}
      {showEdit && (
        <div className="absolute bottom-36 left-0 right-0 z-10 flex justify-center">
          <div className="bg-white/95 backdrop-blur rounded-xl shadow-xl px-3 py-2 flex gap-2">
            {[
              { id: "bowls", icon: "\u{1F963}", label: "Bowls" },
              { id: "bottles", icon: "\u{1F4A7}", label: "Bottles" },
              { id: "houses", icon: "\u{1F3E0}", label: "Houses" },
              { id: "wheels", icon: "\u{1F3A1}", label: "Wheels" },
              { id: "tubes", icon: "\u{1F573}\uFE0F", label: "Tubes" },
              { id: "hams", icon: "\u{1F439}", label: "Hamster" },
            ].map((cat) => (
              <button
                key={cat.id}
                className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center text-lg active:bg-amber-100 transition-colors"
                title={cat.label}
              >
                {cat.icon}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Saved notification */}
      {showSaved && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
          Saved!
        </div>
      )}

      {/* Modals */}
      {offlineReport && offlineReport.offlineMinutes >= 1 && (
        <OfflineModal report={offlineReport} hamsterName={state.name} onClose={() => setOfflineReport(null)} />
      )}
      {levelUp !== null && <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />}
      {showSettings && (
        <SettingsModal hamsterName={state.name} intimacyLevel={state.intimacyLevel} totalPets={state.totalPets} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
