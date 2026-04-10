"use client";

import { useState, useCallback } from "react";
import { useGame } from "@/game/useGame";
import { canPrestige as checkPrestige } from "@/game/prestige";
import { TUTORIAL_STEPS } from "@/game/tutorial";
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
import { AchievementsPanel } from "./panels/AchievementsPanel";
import { OfflineModal } from "./modals/OfflineModal";
import { MilestoneModal } from "./modals/MilestoneModal";
import { EventModal } from "./modals/EventModal";
import { DailyRewardModal } from "./modals/DailyRewardModal";
import { PrestigeModal } from "./modals/PrestigeModal";
import { AchievementModal } from "./modals/AchievementModal";
import { SettingsModal } from "./modals/SettingsModal";
import { ChannelNameInput } from "./ChannelNameInput";
import { TutorialOverlay } from "./TutorialOverlay";
import { LanguageSelect } from "./LanguageSelect";
import { playUpgradeSound } from "@/game/sounds";
import { useLang } from "@/game/LangContext";
import { t, loadLang, Lang } from "@/game/i18n";

export function Game() {
  const game = useGame();
  const { lang, setLang } = useLang();
  const [langChosen, setLangChosen] = useState(() => loadLang() !== null);
  const [activeTab, setActiveTab] = useState<TabId | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrestige, setShowPrestige] = useState(false);

  const buyEquipmentWithSound = useCallback((level: number) => {
    game.buyEquipment(level);
    playUpgradeSound();
  }, [game]);

  const buySpaceWithSound = useCallback((level: number) => {
    game.buySpace(level);
    playUpgradeSound();
  }, [game]);

  const hireTeamWithSound = useCallback((id: "editor" | "thumbnail" | "manager" | "pd") => {
    game.hireTeam(id);
    playUpgradeSound();
  }, [game]);

  if (!game.state) {
    return (
      <div className="min-h-dvh bg-gray-900 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  // Show language select for first-time users
  if (!langChosen) {
    return (
      <LanguageSelect
        onSelect={(l: Lang) => {
          setLang(l);
          setLangChosen(true);
        }}
      />
    );
  }

  const { state } = game;

  // Show channel name input for new players
  if (!state.channelName) {
    return <ChannelNameInput onSubmit={game.setChannelName} />;
  }

  // Tutorial
  const tutorialActive = state.tutorialStep >= 0 && state.tutorialStep < TUTORIAL_STEPS.length;
  const currentTutorialStep = tutorialActive ? TUTORIAL_STEPS[state.tutorialStep] : null;

  // Handle click with tutorial advancement
  const handleClick = () => {
    game.click();
    if (currentTutorialStep && currentTutorialStep.waitFor === "click") {
      game.advanceTutorial();
    }
  };

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
        <ClickButton viewsPerClick={state.viewsPerClick || 1} activeCategory={state.activeCategory} onClick={handleClick} />
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
      {activeTab === "achievements" && <AchievementsPanel state={state} />}
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

      {/* Tutorial Overlay */}
      {currentTutorialStep && (
        <TutorialOverlay step={currentTutorialStep} onDismiss={game.advanceTutorial} />
      )}

      {/* Modals (only show when tutorial is done) */}
      {!tutorialActive && game.offlineReport && (
        <OfflineModal report={game.offlineReport} onClose={game.dismissOffline} />
      )}
      {!tutorialActive && game.milestone && (
        <MilestoneModal milestone={game.milestone} onClose={game.dismissMilestone} />
      )}
      {!tutorialActive && game.showDaily && (
        <DailyRewardModal
          streak={state.dailyStreak}
          onClaim={game.claimDailyReward}
          onClose={game.dismissDaily}
        />
      )}
      {!tutorialActive && game.newAchievement && (
        <AchievementModal achievement={game.newAchievement} onClose={game.dismissAchievement} />
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
          channelName={state.channelName}
          subscribers={state.subscribers}
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
