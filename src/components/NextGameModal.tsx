import React from 'react';
import { X, Gamepad2, Sparkles, ArrowRight } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

interface NextGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NextGameModal: React.FC<NextGameModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const suggestions = [
    { name: 'Snake Clásico Retro', desc: 'Controla la serpiente, come manzanas luminosas y crece sin chocar.', tag: 'Muy popular' },
    { name: 'Pong Arcade 1v1 / VS Bot', desc: 'El legendario juego de palas con física de pelota y dificultad IA.', tag: 'Rápido y divertido' },
    { name: 'Space Invaders / Galaga', desc: 'Nave espacial disparando a oleadas alienígenas descendentes.', tag: 'Acción' },
    { name: 'Brick Breaker (Arkanoid)', desc: 'Destruye bloques de colores con rebotes, potenciadores y vidas.', tag: 'Arcade retro' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-amber-400" />
            <h2 className="font-arcade text-sm text-white tracking-wide">
              TU SEGUNDO JUEGO
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

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs mb-5 space-y-1.5">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>¡Flappy Bird ya está listo para jugar!</span>
          </div>
          <p className="text-amber-200/90 leading-relaxed">
            Mencionaste que necesitas hacer dos juegos. En tu siguiente mensaje sólo dime cuál quieres que sea tu segundo juego y lo integraré en este mismo estudio con selector interactivo.
          </p>
        </div>

        <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">
          Ideas sugeridas para tu segundo juego:
        </h3>

        <div className="space-y-2.5 mb-5">
          {suggestions.map((s) => (
            <div
              key={s.name}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-left"
            >
              <div>
                <div className="text-xs font-bold text-slate-200">{s.name}</div>
                <div className="text-[11px] text-slate-400">{s.desc}</div>
              </div>
              <span className="text-[10px] text-amber-300/80 font-medium whitespace-nowrap ml-2">
                {s.tag}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors"
          >
            Entendido, volver a Flappy Bird
          </button>
        </div>
      </div>
    </div>
  );
};
