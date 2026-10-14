import React from 'react';
import { Volume2, VolumeX, SlidersHorizontal, Trophy, Gamepad2, Info, Share2 } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

interface HeaderNavProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
  onOpenNextGame: () => void;
  onOpenInstructions: () => void;
  onOpenShare: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  isMuted,
  onToggleMute,
  onOpenSettings,
  onOpenStats,
  onOpenNextGame,
  onOpenInstructions,
  onOpenShare,
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2">
        <span className="font-arcade text-sm text-amber-400 tracking-wider">
          ARCADE STUDIO
        </span>
      </div>

      {/* Zone 2: Clean navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
        <button
          className="text-amber-400 border-b-2 border-amber-400 pb-0.5 whitespace-nowrap cursor-default"
        >
          1. Flappy Bird Deluxe
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenNextGame();
          }}
          className="text-slate-400 hover:text-amber-300 transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>2. Tu Siguiente Juego</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenStats();
          }}
          className="text-slate-400 hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Récords</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenInstructions();
          }}
          className="text-slate-400 hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Controles</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenShare();
          }}
          className="text-slate-400 hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Guardar Enlace</span>
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => {
            sounds.playClick();
            onToggleMute();
          }}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenSettings();
          }}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ajustes</span>
        </button>
      </div>
    </header>
  );
};
