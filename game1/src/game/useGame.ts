"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GameState, createInitialState } from "./state";
import { handleClick, tick, calcViewsPerClick, calcViewsPerSecond } from "./engine";
import { saveGame, loadGame, calcOfflineEarnings } from "./save";
import { shouldRotateTrending, getNewTrendingCategory } from "./trending";
import { rollForEvent, GameEvent } from "./events";
import { canClaimDaily, claimDaily } from "./daily";
import { getNewMilestone, MilestoneDef } from "./milestones";
import { EQUIPMENT, SPACES, TEAM } from "./upgrades";
import { CATEGORIES } from "./categories";
import { canPrestige, performPrestige } from "./prestige";

export interface OfflineReport {
  offlineViews: number;
  offlineMoney: number;
  offlineSeconds: number;
}

export interface ActiveEvent {
  event: GameEvent;
  expiresAt: number;
}

export function useGame() {
  const [state, setState] = useState<GameState | null>(null);
  const [offlineReport, setOfflineReport] = useState<OfflineReport | null>(null);
  const [milestone, setMilestone] = useState<MilestoneDef | null>(null);
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);
  const [showDaily, setShowDaily] = useState(false);
  const stateRef = useRef<GameState | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Load game on mount
  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      const offline = calcOfflineEarnings(saved);
      const loaded: GameState = {
        ...saved,
        views: saved.views + offline.offlineViews,
        totalViews: saved.totalViews + offline.offlineViews,
        money: saved.money + offline.offlineMoney,
        lastOnlineTime: Date.now(),
      };
      loaded.subscribers = Math.floor(loaded.totalViews / 1000);
      setState(loaded);
      if (offline.offlineViews > 0) {
        setOfflineReport(offline);
      }
      if (canClaimDaily(loaded)) {
        setShowDaily(true);
      }
    } else {
      const initial = createInitialState();
      setState(initial);
      setShowDaily(true);
    }
  }, []);

  // Game tick loop (1 second)
  useEffect(() => {
    if (!state) return;

    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev) return prev;
        let next = tick(prev);

        // Trending rotation
        if (shouldRotateTrending(next.trendingChangedAt)) {
          next = {
            ...next,
            currentTrending: getNewTrendingCategory(next.currentTrending),
            trendingChangedAt: Date.now(),
          };
        }

        // Random events (only if no active event)
        if (!activeEvent || Date.now() > activeEvent.expiresAt) {
          const event = rollForEvent();
          if (event) {
            if (event.effect === "subscriber_loss") {
              next = {
                ...next,
                subscribers: Math.floor(next.subscribers * event.multiplier),
              };
            }
            if (event.durationSeconds > 0) {
              setActiveEvent({
                event,
                expiresAt: Date.now() + event.durationSeconds * 1000,
              });
            } else {
              setActiveEvent({ event, expiresAt: Date.now() + 3000 });
            }
          }
        }

        // Check milestones
        const newMilestone = getNewMilestone(next.subscribers, next.celebratedMilestones);
        if (newMilestone) {
          setMilestone(newMilestone);
          next = {
            ...next,
            celebratedMilestones: [...next.celebratedMilestones, newMilestone.subscribers],
          };
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state !== null, activeEvent]);

  // Auto-save every 10 seconds
  useEffect(() => {
    if (!state) return;
    const interval = setInterval(() => {
      if (stateRef.current) saveGame(stateRef.current);
    }, 10000);
    return () => clearInterval(interval);
  }, [state !== null]);

  const click = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      let next = handleClick(prev);

      if (activeEvent && Date.now() < activeEvent.expiresAt) {
        if (activeEvent.event.effect === "views_boost") {
          const bonus = (next.viewsPerClick ?? 1) * (activeEvent.event.multiplier - 1);
          next = {
            ...next,
            views: next.views + bonus,
            totalViews: next.totalViews + bonus,
          };
        }
      }

      return next;
    });
  }, [activeEvent]);

  const buyEquipment = useCallback((level: number) => {
    setState((prev) => {
      if (!prev) return prev;
      if (level <= prev.equipmentLevel) return prev;
      const cost = EQUIPMENT[level].cost;
      if (prev.money < cost) return prev;
      const next = { ...prev, money: prev.money - cost, equipmentLevel: level };
      next.viewsPerClick = calcViewsPerClick(next);
      return next;
    });
  }, []);

  const buySpace = useCallback((level: number) => {
    setState((prev) => {
      if (!prev) return prev;
      if (level <= prev.spaceLevel) return prev;
      const cost = SPACES[level].cost;
      if (prev.money < cost) return prev;
      return { ...prev, money: prev.money - cost, spaceLevel: level };
    });
  }, []);

  const hireTeam = useCallback((memberId: keyof GameState["team"]) => {
    setState((prev) => {
      if (!prev) return prev;
      if (prev.team[memberId]) return prev;
      const def = TEAM.find((t) => t.id === memberId);
      if (!def) return prev;
      if (prev.money < def.cost) return prev;
      if (prev.subscribers < def.unlockSubscribers) return prev;
      return {
        ...prev,
        money: prev.money - def.cost,
        team: { ...prev.team, [memberId]: true },
      };
    });
  }, []);

  const unlockCategory = useCallback((categoryId: number) => {
    setState((prev) => {
      if (!prev) return prev;
      if (prev.unlockedCategories.includes(categoryId)) return prev;
      const cat = CATEGORIES[categoryId];
      if (!cat) return prev;
      if (prev.subscribers < cat.unlockSubscribers) return prev;
      return {
        ...prev,
        unlockedCategories: [...prev.unlockedCategories, categoryId],
      };
    });
  }, []);

  const setActiveCategory = useCallback((categoryId: number) => {
    setState((prev) => {
      if (!prev) return prev;
      if (!prev.unlockedCategories.includes(categoryId)) return prev;
      return { ...prev, activeCategory: categoryId };
    });
  }, []);

  const claimDailyReward = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      if (!canClaimDaily(prev)) return prev;
      const { state: newState } = claimDaily(prev);
      return newState;
    });
    setShowDaily(false);
  }, []);

  const prestige = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      if (!canPrestige(prev)) return prev;
      return performPrestige(prev);
    });
  }, []);

  const setChannelName = useCallback((name: string) => {
    setState((prev) => {
      if (!prev) return prev;
      return { ...prev, channelName: name };
    });
  }, []);

  const dismissOffline = useCallback(() => setOfflineReport(null), []);
  const dismissMilestone = useCallback(() => setMilestone(null), []);
  const dismissDaily = useCallback(() => setShowDaily(false), []);

  return {
    state,
    offlineReport,
    milestone,
    activeEvent,
    showDaily,
    click,
    buyEquipment,
    buySpace,
    hireTeam,
    unlockCategory,
    setActiveCategory,
    claimDailyReward,
    prestige,
    setChannelName,
    dismissOffline,
    dismissMilestone,
    dismissDaily,
  };
}
