/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Difficulty, BirdSkin, EnvironmentTheme, GameStats, BIRD_SKINS, THEMES } from './types/game';
import { FlappyCanvas } from './game/FlappyCanvas';
import { GameHUD } from './components/GameHUD';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { IdleStartOverlay } from './components/IdleStartOverlay';
import { CustomizationModal } from './components/CustomizationModal';
import { StatsModal } from './components/StatsModal';
import { NextGameModal } from './components/NextGameModal';
import { InstructionsModal } from './components/InstructionsModal';
import { ShareSaveModal } from './components/ShareSaveModal';
import { HeaderNav } from './components/HeaderNav';
import { sounds } from './audio/soundEffects';
import { Sparkles, Gamepad2, Award } from 'lucide-react';

const STATS_KEY = 'flappy_arcade_stats';
const SKIN_KEY = 'flappy_selected_skin';
const THEME_KEY = 'flappy_selected_theme';
const DIFF_KEY = 'flappy_selected_diff';

export default function App() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [score, setScore] = useState<number>(0);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.isMuted());
  const [restartTrigger, setRestartTrigger] = useState<number>(0);

  // Customization
  const [birdSkin, setBirdSkin] = useState<BirdSkin>(() => {
    const saved = localStorage.getItem(SKIN_KEY);
    const found = BIRD_SKINS.find((b) => b.id === saved);
    return found || BIRD_SKINS[0];
  });

  const [theme, setTheme] = useState<EnvironmentTheme>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    const found = THEMES.find((t) => t.id === saved);
    return found || THEMES[0];
  });

  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    const saved = localStorage.getItem(DIFF_KEY) as Difficulty;
    return saved === 'easy' || saved === 'classic' || saved === 'hard' ? saved : 'classic';
  });

  // Persistent stats
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      highScore: 0,
      totalGames: 0,
      totalScore: 0,
      totalFlaps: 0,
      bronzeMedals: 0,
      silverMedals: 0,
      goldMedals: 0,
      platinumMedals: 0,
    };
  });

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isNextGameOpen, setIsNextGameOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Save settings when changed
  const handleSelectBird = (skin: BirdSkin) => {
    setBirdSkin(skin);
    localStorage.setItem(SKIN_KEY, skin.id);
  };

  const handleSelectTheme = (thm: EnvironmentTheme) => {
    setTheme(thm);
    localStorage.setItem(THEME_KEY, thm.id);
  };

  const handleSelectDifficulty = (diff: Difficulty) => {
    setDifficulty(diff);
    localStorage.setItem(DIFF_KEY, diff);
  };

  const handleToggleMute = () => {
    const newMuted = sounds.toggleMute();
    setIsMuted(newMuted);
  };

  const handleTogglePause = () => {
    if (gameState !== 'PLAYING') return;
    setIsPaused((prev) => !prev);
  };

  const handleFlapCount = useCallback(() => {
    setStats((prev) => {
      const updated = { ...prev, totalFlaps: prev.totalFlaps + 1 };
      localStorage.setItem(STATS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleGameOver = useCallback(
    (finalScore: number) => {
      setGameState('GAME_OVER');
      setIsPaused(false);

      setStats((prev) => {
        const isRecord = finalScore > prev.highScore;
        setIsNewRecord(isRecord);

        let bronze = prev.bronzeMedals;
        let silver = prev.silverMedals;
        let gold = prev.goldMedals;
        let platinum = prev.platinumMedals;

        if (finalScore >= 100) platinum += 1;
        else if (finalScore >= 50) gold += 1;
        else if (finalScore >= 25) silver += 1;
        else if (finalScore >= 10) bronze += 1;

        if (isRecord && finalScore > 0) {
          sounds.playMedal();
        }

        const updated: GameStats = {
          highScore: Math.max(prev.highScore, finalScore),
          totalGames: prev.totalGames + 1,
          totalScore: prev.totalScore + finalScore,
          totalFlaps: prev.totalFlaps,
          bronzeMedals: bronze,
          silverMedals: silver,
          goldMedals: gold,
          platinumMedals: platinum,
        };

        localStorage.setItem(STATS_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const handleRestart = () => {
    setIsNewRecord(false);
    setIsPaused(false);
    setScore(0);
    setRestartTrigger((prev) => prev + 1);
    setGameState('PLAYING');
  };

  const handleResetStats = () => {
    const fresh: GameStats = {
      highScore: 0,
      totalGames: 0,
      totalScore: 0,
      totalFlaps: 0,
      bronzeMedals: 0,
      silverMedals: 0,
      goldMedals: 0,
      platinumMedals: 0,
    };
    setStats(fresh);
    localStorage.removeItem(STATS_KEY);
  };

  // Keyboard Escape listener to pause/unpause
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (gameState === 'PLAYING') {
          setIsPaused((p) => !p);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Bar Navigation */}
      <HeaderNav
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenNextGame={() => setIsNextGameOpen(true)}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 relative max-w-5xl mx-auto w-full">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[130px] opacity-25 pointer-events-none"
          style={{ backgroundColor: birdSkin.bodyColor }}
        />

        {/* Central Game Cabinet */}
        <div className="w-full max-w-[420px] relative">
          {/* Active Canvas Game Window */}
          <FlappyCanvas
            gameState={gameState}
            restartTrigger={restartTrigger}
            onGameStateChange={setGameState}
            onScoreUpdate={setScore}
            onGameOver={handleGameOver}
            onFlapCount={handleFlapCount}
            birdSkin={birdSkin}
            theme={theme}
            difficulty={difficulty}
            isPaused={isPaused}
          />

          {/* In-Game Heads-Up Display (Live Score + Controls) */}
          <GameHUD
            score={score}
            highScore={stats.highScore}
            difficulty={difficulty}
            isPaused={isPaused}
            isMuted={isMuted}
            onTogglePause={handleTogglePause}
            onToggleMute={handleToggleMute}
            showHUD={gameState === 'PLAYING' || isPaused}
          />

          {/* Idle Start Overlay */}
          {gameState === 'IDLE' && (
            <IdleStartOverlay
              onStart={() => setGameState('PLAYING')}
              onOpenSettings={() => setIsSettingsOpen(true)}
              difficulty={difficulty}
              onSelectDifficulty={handleSelectDifficulty}
              birdSkin={birdSkin}
              theme={theme}
            />
          )}

          {/* Pause Modal */}
          {isPaused && (
            <PauseModal
              onResume={() => setIsPaused(false)}
              onRestart={handleRestart}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {/* Game Over Modal */}
          {gameState === 'GAME_OVER' && (
            <GameOverModal
              score={score}
              highScore={stats.highScore}
              isNewRecord={isNewRecord}
              onRestart={handleRestart}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}
        </div>

        {/* Quiet Unboxed Metadata & Quick Info Bar */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span>{birdSkin.name}</span>
          <span aria-hidden="true">·</span>
          <span>{theme.name}</span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">Dificultad {difficulty}</span>
          <span aria-hidden="true">·</span>
          <span>Récord: <strong className="text-amber-300 font-mono">{stats.highScore}</strong></span>
        </div>

        {/* Introductory Banner for the User */}
        <div className="mt-6 w-full max-w-md p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-left flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 shrink-0">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-slate-100 block mb-0.5">
              ¡Juego 1 de 2 completado!
            </span>
            Disfruta de esta versión propia con físicas personalizadas, 5 aves y 4 escenarios. Cuando quieras, dime cuál debe ser tu <strong>segundo juego</strong> (por ejemplo: Pong, Snake, Space Invaders, etc.) para agregarlo.
          </div>
        </div>
      </main>

      {/* Modals */}
      <CustomizationModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedBird={birdSkin}
        onSelectBird={handleSelectBird}
        selectedTheme={theme}
        onSelectTheme={handleSelectTheme}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onResetStats={handleResetStats}
      />

      <NextGameModal
        isOpen={isNextGameOpen}
        onClose={() => setIsNextGameOpen(false)}
      />

      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />

      <ShareSaveModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}
