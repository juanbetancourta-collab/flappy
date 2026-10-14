import React from 'react';
import { Play, Sparkles, Feather, Compass, MousePointerClick } from 'lucide-react';
import { BirdSkin, EnvironmentTheme, Difficulty, DIFFICULTY_SETTINGS } from '../types/game';
import { sounds } from '../audio/soundEffects';

interface IdleStartOverlayProps {
  onStart: () => void;
  onOpenSettings: () => void;
  difficulty: Difficulty;
  onSelectDifficulty: (diff: Difficulty) => void;
  birdSkin: BirdSkin;
  theme: EnvironmentTheme;
}

export const IdleStartOverlay: React.FC<IdleStartOverlayProps> = ({
  onStart,
  onOpenSettings,
  difficulty,
  onSelectDifficulty,
  birdSkin,
  theme,
}) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 pointer-events-none select-none">
      {/* Top Title Banner */}
      <div className="text-center pt-3">
        <h1 className="font-arcade text-2xl text-amber-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-wider">
          FLAPPY BIRD
        </h1>
        <p className="font-arcade text-xs text-amber-100/90 tracking-widest mt-1 drop-shadow-md">
          ARCADE DELUXE
        </p>
      </div>

      {/* Middle Tap/Space Callout */}
      <div className="text-center py-4 flex flex-col items-center justify-center pointer-events-auto">
        <button
          onClick={() => {
            sounds.playFlap();
            onStart();
          }}
          className="group relative px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer border-2 border-amber-200"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>¡TOCA PARA VOLAR!</span>
        </button>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium">
          <MousePointerClick className="w-4 h-4 text-amber-300 animate-bounce" />
          <span>o presiona tecla <kbd className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 border border-white/20 font-mono text-[11px]">Espacio</kbd></span>
        </div>
      </div>

      {/* Bottom controls bar: Quick Difficulty & Settings trigger */}
      <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xl">
        {/* Difficulty segmented switch */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
          {(['easy', 'classic', 'hard'] as Difficulty[]).map((d) => {
            const active = difficulty === d;
            return (
              <button
                key={d}
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playClick();
                  onSelectDifficulty(d);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  active
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {DIFFICULTY_SETTINGS[d].label}
              </button>
            );
          })}
        </div>

        {/* Quick customization trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            sounds.playClick();
            onOpenSettings();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/60 transition-colors"
          title="Personalizar plumaje y entorno"
        >
          <Feather className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Personalizar</span>
        </button>
      </div>
    </div>
  );
};
