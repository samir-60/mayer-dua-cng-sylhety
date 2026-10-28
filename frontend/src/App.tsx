import React, { useEffect } from 'react';
import { GameScene } from './game/GameScene';
import { MainMenu } from './components/MainMenu';
import { GameHUD } from './components/GameHUD';
import { BreakingNews } from './components/BreakingNews';
import { FunnyCommentBubble } from './components/FunnyCommentBubble';
import { Newspaper } from './components/Newspaper';
import { MissionSelectModal } from './components/MissionSelectModal';
import { DialogueChoiceModal } from './components/DialogueChoiceModal';
import { GarageModal } from './components/GarageModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { SettingsModal } from './components/SettingsModal';
import { NewsHistoryModal } from './components/NewsHistoryModal';
import { MobileControls } from './components/MobileControls';

import { useGameStore } from './stores/useGameStore';
import { useCommentaryStore } from './stores/useCommentaryStore';
import { usePlayerStore } from './stores/usePlayerStore';
import { commentaryEngine } from './comedy/CommentaryEngine';

export const App: React.FC = () => {
  // Use granular selectors so App does NOT re-render on telemetry/fuel updates
  const gameMode = useGameStore((state) => state.gameMode);
  const activeNewspaper = useGameStore((state) => state.activeNewspaper);
  const setActiveComment = useCommentaryStore((state) => state.setActiveComment);

  useEffect(() => {
    // Initialize guest profile and garage on app boot ONCE
    usePlayerStore.getState().fetchProfile();
    usePlayerStore.getState().fetchGarage();

    // Connect comedy commentary engine to Zustand store
    commentaryEngine.registerCommentCallback((comment) => {
      setActiveComment(comment);
    });
  }, [setActiveComment]);

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-stone-950 font-bangla select-none">
      {/* 3D WEBGL GAME SCENE (CANVAS) */}
      <GameScene />

      {/* TOP LIVE BREAKING NEWS TICKER */}
      <BreakingNews />

      {/* DYNAMIC SYLHETI SPEECH BUBBLE */}
      <FunnyCommentBubble />

      {/* UI OVERLAY DEPENDING ON GAME MODE */}
      {gameMode === 'MENU' && <MainMenu />}

      {(gameMode === 'PLAYING' || gameMode === 'FREE_ROAM') && <GameHUD />}

      {/* SATIRICAL NEWSPAPER REPORT ("মায়ের দোয়া সংবাদ") */}
      {activeNewspaper && <Newspaper />}

      {/* INTERACTIVE MODALS */}
      <MissionSelectModal />
      <DialogueChoiceModal />
      <GarageModal />
      <LeaderboardModal />
      <SettingsModal />
      <NewsHistoryModal />
    </div>
  );
};

export default App;
