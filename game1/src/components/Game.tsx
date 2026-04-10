"use client";

import { useState, useCallback } from "react";
import { useGame } from "@/game/useGame";
import { canPrestige as checkPrestige } from "@/game/prestige";
import { StatsBar } from "./StatsBar";
import { CommentFeed } from "./CommentFeed";
import { StudioView } from "./StudioView";
import { ClickButton } from "./ClickButton";
import { MilestoneBar } from "./MilestoneBar";
import { BottomNav, TabId } from "./BottomNav";
import { EquipmentPanel } from "./panels/EquipmentPanel";
import { TeamPanel } from "./panels/TeamPanel";
import { ChannelPanel } from "./panels/ChannelPanel";
import { ShopPanel } from "./panels/ShopPanel";
import { OfflineModal } from "./modals/OfflineModal";
import { MilestoneModal } from "./modals/MilestoneModal";
import { EventModal } from "./modals/EventModal";
import { DailyRewardModal } from "./modals/DailyRewardModal";
import { PrestigeModal } from "./modals/PrestigeModal";
import { SettingsModal } from "./modals/SettingsModal";
import { ChannelNameInput } from "./ChannelNameInput";
import { playUpgradeSound } from "@/game/sounds";

export function Game() {
  const game = useGame();
  const [activeTab, setActiveTab] = useState<TabId | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrestige, setShowPrestige] = useState(false);

  if (!game.state) {
    return (
      <div className="min-h-dvh bg-gray-900 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  const { state } = game;

  const buyEquipmentWithSound = useCallback((level: number) => {
    game.buyEquipment(level);
    playUpgradeSound();
  }, [game]);

  const buySpaceWithSound = useCallback((level: number) => {
    game.buySpace(level);
    playUpgradeSound();
  }, [game]);

  const hireTeamWithSound = useCallback((id: keyof typeof state.team) => {
    game.hireTeam(id);
    playUpgradeSound();
  }, [game]);

  // Show channel name input for new players
  if (!state.channelName) {
    return <ChannelNameInput onSubmit={game.setChannelName} />;
  }

  return (
    <div className="min-h-dvh bg-gray-900 flex flex-col max-w-md mx-auto relative">
      {/* Stats */}
      <StatsBar state={state} />

      {/* Active Event Banner */}
      {game.activeEvent && <EventModal activeEvent={game.activeEvent} />}

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-between py-2">
        <CommentFeed subscribers={state.subscribers} />
        <StudioView spaceLevel={state.spaceLevel} equipmentLevel={state.equipmentLevel} />
        <ClickButton viewsPerClick={state.viewsPerClick || 1} activeCategory={state.activeCategory} onClick={game.click} />
        <MilestoneBar state={state} />
      </div>

      {/* Panel Area */}
      {activeTab === "equipment" && (
        <EquipmentPanel state={state} onBuyEquipment={buyEquipmentWithSound} onBuySpace={buySpaceWithSound} />
      )}
      {activeTab === "team" && (
        <TeamPanel state={state} onHire={hireTeamWithSound} />
      )}
      {activeTab === "channel" && (
        <ChannelPanel state={state} onUnlock={game.unlockCategory} onSetActive={game.setActiveCategory} />
      )}
      {activeTab === "shop" && <ShopPanel />}

      {/* Settings button */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-3 right-3 text-gray-500 text-xl z-10"
      >
        &#x2699;&#xFE0F;
      </button>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      {game.offlineReport && (
        <OfflineModal report={game.offlineReport} onClose={game.dismissOffline} />
      )}
      {game.milestone && (
        <MilestoneModal milestone={game.milestone} onClose={game.dismissMilestone} />
      )}
      {game.showDaily && (
        <DailyRewardModal
          streak={state.dailyStreak}
          onClaim={game.claimDailyReward}
          onClose={game.dismissDaily}
        />
      )}
      {showPrestige && (
        <PrestigeModal
          prestigeCount={state.prestigeCount}
          onPrestige={game.prestige}
          onClose={() => setShowPrestige(false)}
        />
      )}
      {showSettings && (
        <SettingsModal
          prestigeCount={state.prestigeCount}
          totalClicks={state.totalClicks}
          totalPlayTime={state.totalPlayTime}
          canPrestige={checkPrestige(state)}
          onPrestigeOpen={() => setShowPrestige(true)}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
