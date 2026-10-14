import React from 'react';
import { X, Keyboard, MousePointerClick, Smartphone, Award } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-amber-400" />
            <h2 className="font-arcade text-sm text-white tracking-wide">
              CÓMO JUGAR
            </h2>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 mb-5 text-xs">
          {/* Keyboard */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 shrink-0">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-200 mb-0.5">Teclado (PC / Laptop)</div>
              <p className="text-slate-400 leading-relaxed">
                Presiona <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 font-mono">Espacio</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 font-mono">Flecha Arriba ↑</kbd> o <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 font-mono">W</kbd> para que el ave aletee hacia arriba.
              </p>
            </div>
          </div>

          {/* Mouse / Touch */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 shrink-0">
              <MousePointerClick className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-200 mb-0.5">Ratón o Pantalla Táctil</div>
              <p className="text-slate-400 leading-relaxed">
                Haz clic izquierdo en cualquier parte de la pantalla o toca sobre tu teléfono/tablet para impulsarte en el aire.
              </p>
            </div>
          </div>

          {/* Objective */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-200 mb-0.5">Objetivo y Medallas</div>
              <p className="text-slate-400 leading-relaxed">
                Cruza entre las tuberías sin chocar contra ellas ni tocar el suelo. Ganas 1 punto por cada tubería superada y desbloqueas medallas especiales a partir de los 10 puntos.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors"
          >
            ¡Entendido, a jugar!
          </button>
        </div>
      </div>
    </div>
  );
};
