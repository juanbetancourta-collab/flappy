import React from 'react';
import { RotateCcw, Trophy, Award, Sparkles, SlidersHorizontal } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewRecord: boolean;
  onRestart: () => void;
  onOpenSettings: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewRecord,
  onRestart,
  onOpenSettings,
}) => {
  // Listen for Space or Enter key to quickly restart
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart]);

  // Medal calculation
  let medal: { name: string; color: string; bg: string; icon: string } | null = null;
  if (score >= 100) {
    medal = { name: 'Platino Real', color: 'text-cyan-300', bg: 'bg-cyan-500/20 border-cyan-400/40', icon: '💎' };
  } else if (score >= 50) {
    medal = { name: 'Oro de Campeón', color: 'text-amber-300', bg: 'bg-amber-500/20 border-amber-400/40', icon: '🥇' };
  } else if (score >= 25) {
    medal = { name: 'Plata Arcade', color: 'text-slate-200', bg: 'bg-slate-400/20 border-slate-300/40', icon: '🥈' };
  } else if (score >= 10) {
    medal = { name: 'Bronce Novato', color: 'text-amber-500', bg: 'bg-amber-700/20 border-amber-600/40', icon: '🥉' };
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-[340px] bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center relative overflow-hidden">
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />

        {isNewRecord && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            ¡Nuevo Récord Personal!
          </div>
        )}

        <h2 className="font-arcade text-xl text-white tracking-wide mb-5">
          GAME OVER
        </h2>

        {/* Score Board Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-5 text-left space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Puntos obtenidos</span>
            <span className="font-arcade text-2xl text-amber-300 tabular-nums">{score}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400 font-medium">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Mejor puntuación</span>
            </div>
            <span className="font-arcade text-lg text-emerald-400 tabular-nums">{highScore}</span>
          </div>

          {/* Medal slot */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400 font-medium">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Medalla</span>
            </div>
            {medal ? (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${medal.bg} ${medal.color} flex items-center gap-1`}>
                <span>{medal.icon}</span>
                <span>{medal.name}</span>
              </span>
            ) : (
              <span className="text-xs text-slate-500 italic">Desbloquea en 10 pts</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              sounds.playClick();
              onRestart();
            }}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide"
          >
            <RotateCcw className="w-4 h-4" />
            <span>JUGAR DE NUEVO</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenSettings();
            }}
            className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-medium rounded-xl border border-slate-700/60 flex items-center justify-center gap-2 transition-colors text-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Personalizar Ave o Escenario</span>
          </button>
        </div>

        <p className="mt-4 text-[11px] text-slate-500">
          Pulsa <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">Espacio</kbd> o toca la pantalla para reiniciar
        </p>
      </div>
    </div>
  );
};
