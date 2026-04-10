"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { HamsterState, createInitialState } from "@/game/state";
import { decayStats, feed, play } from "@/game/stats";
import { updateGrowthStage, checkLevelUp } from "@/game/growth";
import { resetDailyMissions, updateMissionProgress } from "@/game/missions";
import { saveGame, loadGame, calcOfflineChanges, applyOfflineChanges, OfflineReport } from "@/game/save";
import { getHappinessEmoji } from "@/game/stats";
import { getGrowthLabel } from "@/game/growth";
import { GameCanvas } from "./GameCanvas";
import { BottomNav, TabId } from "./BottomNav";
import { FeedPanel } from "./panels/FeedPanel";
import { ShopPanel } from "./panels/ShopPanel";
import { DecoratePanel } from "./panels/DecoratePanel";
import { OfflineModal } from "./modals/OfflineModal";
import { LevelUpModal } from "./modals/LevelUpModal";
import { SettingsModal } from "./modals/SettingsModal";
import { NameInput } from "./NameInput";

export function Game() {
  const [state, setState] = useState<HamsterState | null>(null);
  const [activeTab, setActiveTab] = useState<TabId | null>(null);
  const [offlineReport, setOfflineReport] = useState<OfflineReport | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
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

  const handleFeed = useCallback((foodValue: number, cost: number) => {
    setState((prev) => {
      if (!prev || prev.coins < cost) return prev;
      let next = feed(prev, foodValue);
      next = { ...next, coins: next.coins - cost };
      return next;
    });
  }, []);

  const handlePlay = useCallback(() => {
    setState((prev) => prev ? play(prev) : prev);
  }, []);

  const handleBuyItem = useCallback((itemId: string, cost: number) => {
    setState((prev) => {
      if (!prev || prev.coins < cost) return prev;
      if (prev.placedItems.some((p) => p.itemId === itemId)) return prev;
      return {
        ...prev,
        coins: prev.coins - cost,
        placedItems: [...prev.placedItems, { itemId, x: 0.5, y: 0.5 }],
      };
    });
  }, []);

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
      {/* Canvas takes full screen */}
      <GameCanvas state={state} onStateChange={handleStateChange} />

      {/* Overlay: top status bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-3 pointer-events-none">
        <div className="pointer-events-auto bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 text-white">
          <div className="text-sm font-bold">{"\u{1F439}"} {state.name}</div>
          <div className="text-xs opacity-80">{getGrowthLabel(state.growthStage)} · Lv.{state.intimacyLevel}</div>
        </div>
        <div className="pointer-events-auto flex gap-2 items-center bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
          <span>{getHappinessEmoji(state.happiness)}</span>
          <span>{state.hunger > 50 ? "\u{1F35A}" : "\u{1F37D}\uFE0F"}</span>
          <span>{state.energy > 50 ? "\u26A1" : "\u{1F4A4}"}</span>
          <span className="font-bold">{"\u{1FA99}"}{state.coins}</span>
        </div>
      </div>

      {/* Settings button */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-14 right-3 z-10 bg-black/30 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center text-white"
      >
        {"\u22EE"}
      </button>

      {/* Overlay: bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        {/* Panel area */}
        {activeTab && (
          <div className="bg-white/95 backdrop-blur border-t border-amber-300 rounded-t-xl">
            {activeTab === "feed" && <FeedPanel state={state} onFeed={handleFeed} />}
            {activeTab === "play" && (
              <div className="p-4">
                <button
                  onClick={handlePlay}
                  disabled={state.energy < 10}
                  className={`w-full py-4 rounded-xl text-lg font-bold ${
                    state.energy >= 10 ? "bg-amber-500 text-white active:bg-amber-600" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {state.energy >= 10 ? "\u{1F3BE} Play!" : "\u{1F4A4} Too tired..."}
                </button>
                <p className="text-xs text-amber-500 mt-2 text-center">Energy: {Math.floor(state.energy)}%</p>
              </div>
            )}
            {activeTab === "decorate" && <DecoratePanel state={state} />}
            {activeTab === "shop" && <ShopPanel state={state} onBuyItem={handleBuyItem} />}
          </div>
        )}

        {/* Bottom buttons */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

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
