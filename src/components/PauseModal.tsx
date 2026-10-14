import React from 'react';
import { Play, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onOpenSettings,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="w-full max-w-[320px] bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center">
        <h2 className="font-arcade text-lg text-white mb-6 tracking-wider">
          JUEGO PAUSADO
        </h2>

        <div className="space-y-3">
          <button
            onClick={() => {
              sounds.playClick();
              onResume();
            }}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Play className="w-4 h-4" />
            <span>CONTINUAR</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onRestart();
            }}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700/60 flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REINICIAR</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenSettings();
            }}
            className="w-full py-2.5 px-4 bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-medium rounded-xl border border-slate-700/40 flex items-center justify-center gap-2 transition-colors text-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Ajustes y Personalización</span>
          </button>
        </div>
      </div>
    </div>
  );
};
