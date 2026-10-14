import React from 'react';
import { X, Feather, Compass, Check } from 'lucide-react';
import { BirdSkin, EnvironmentTheme, BIRD_SKINS, THEMES } from '../types/game';
import { sounds } from '../audio/soundEffects';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBird: BirdSkin;
  onSelectBird: (bird: BirdSkin) => void;
  selectedTheme: EnvironmentTheme;
  onSelectTheme: (theme: EnvironmentTheme) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  selectedBird,
  onSelectBird,
  selectedTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <Feather className="w-5 h-5 text-amber-400" />
            <h2 className="font-arcade text-sm text-white tracking-wide">
              PERSONALIZAR PARTIDA
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

        {/* Section 1: Bird Skins */}
        <div className="mb-6">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <span>1. Elige tu Ave</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {BIRD_SKINS.map((bird) => {
              const isSelected = selectedBird.id === bird.id;
              return (
                <button
                  key={bird.id}
                  onClick={() => {
                    sounds.playClick();
                    onSelectBird(bird);
                  }}
                  className={`text-left p-3 rounded-xl border transition-all flex items-start gap-3 relative ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-400/80 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  {/* Miniature Bird Preview */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-black/20 shadow-inner relative"
                    style={{ backgroundColor: bird.bodyColor }}
                  >
                    <div
                      className="w-4 h-4 rounded-full absolute top-1.5 right-1.5 border border-black/30"
                      style={{ backgroundColor: bird.beakColor }}
                    />
                    <div
                      className="w-2.5 h-2.5 rounded-full absolute top-2 right-4 bg-white"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900 absolute top-0.5 right-0.5" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {bird.name}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      {bird.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Environment Theme */}
        <div>
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>2. Elige el Escenario</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((th) => {
              const isSelected = selectedTheme.id === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => {
                    sounds.playClick();
                    onSelectTheme(th);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Theme Gradient preview box */}
                  <div
                    className="h-14 rounded-lg mb-2 relative overflow-hidden border border-black/20"
                    style={{
                      background: `linear-gradient(to bottom, ${th.skyTop}, ${th.skyBottom})`,
                    }}
                  >
                    {/* Simulated mini ground & pipe */}
                    <div
                      className="absolute bottom-0 inset-x-0 h-4"
                      style={{ backgroundColor: th.groundTop }}
                    />
                    <div
                      className="absolute bottom-4 left-4 w-4 h-6 rounded-t border border-black/20"
                      style={{ backgroundColor: th.pipeMain }}
                    />
                    {th.isNight && (
                      <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">
                      {th.name}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm Button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Listo y Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
