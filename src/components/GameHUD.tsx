import React from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { sounds } from '../audio/soundEffects';
import { Difficulty, DIFFICULTY_SETTINGS } from '../types/game';

interface GameHUDProps {
  score: number;
  highScore: number;
  difficulty: Difficulty;
  isPaused: boolean;
  isMuted: boolean;
  onTogglePause: () => void;
  onToggleMute: () => void;
  showHUD: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  highScore,
  difficulty,
  isPaused,
  isMuted,
  onTogglePause,
  onToggleMute,
  showHUD,
}) => {
  const currentDiff = DIFFICULTY_SETTINGS[difficulty];

  if (!showHUD) return null;

  return (
    <div className="absolute inset-x-0 top-0 p-4 pointer-events-none flex items-start justify-between z-20">
      {/* Top Left: Score & Record */}
      <div className="flex flex-col drop-shadow-md">
        <div className="flex items-baseline gap-2">
          <span className="font-arcade text-4xl text-amber-300 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)] tracking-wider">
            {score}
          </span>
          <span className="text-xs text-white/80 font-medium uppercase tracking-wider">
            puntos
          </span>
        </div>
        <div className="text-[11px] text-white/70 font-semibold tracking-wide flex items-center gap-1.5 mt-0.5">
          <span>RÉCORD:</span>
          <span className="font-mono text-amber-200 tabular-nums">{Math.max(score, highScore)}</span>
          <span>·</span>
          <span className="text-emerald-300">{currentDiff.label}</span>
        </div>
      </div>

      {/* Top Right: Sound & Pause Controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            sounds.playClick();
            onToggleMute();
          }}
          className="p-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            sounds.playClick();
            onTogglePause();
          }}
          className="p-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
          aria-label={isPaused ? 'Reanudar juego' : 'Pausar juego'}
          title={isPaused ? 'Reanudar juego' : 'Pausar juego'}
        >
          {isPaused ? <Play className="w-5 h-5 text-emerald-400" /> : <Pause className="w-5 h-5 text-slate-200" />}
        </button>
      </div>
    </div>
  );
};
