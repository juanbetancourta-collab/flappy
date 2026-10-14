import React from 'react';
import { X, Trophy, Award, Flame, RotateCcw, BarChart3 } from 'lucide-react';
import { GameStats } from '../types/game';
import { sounds } from '../audio/soundEffects';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="font-arcade text-sm text-white tracking-wide">
              HISTORIAL Y RÉCORDS
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

        {/* Top Big Metric Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Récord Máximo
            </span>
            <span className="font-arcade text-2xl text-amber-300 tabular-nums">
              {stats.highScore}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Partidas Jugadas
            </span>
            <span className="font-arcade text-2xl text-emerald-400 tabular-nums">
              {stats.totalGames}
            </span>
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="space-y-2.5 bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5 mb-5 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>Puntos totales acumulados:</span>
            <span className="font-mono font-bold text-white tabular-nums">{stats.totalScore}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Aleteos totales registrados:</span>
            <span className="font-mono font-bold text-white tabular-nums">{stats.totalFlaps}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Promedio por partida:</span>
            <span className="font-mono font-bold text-white tabular-nums">
              {stats.totalGames > 0 ? (stats.totalScore / stats.totalGames).toFixed(1) : '0.0'}
            </span>
          </div>
        </div>

        {/* Medals Showcase */}
        <div className="mb-6">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Colección de Medallas</span>
          </h3>

          <div className="grid grid-cols-4 gap-2 text-center">
            {/* Bronze */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-2xl mb-1">🥉</div>
              <span className="block text-[10px] text-slate-400 font-medium">Bronce (10)</span>
              <span className="font-mono text-xs font-bold text-amber-500 tabular-nums mt-0.5 block">
                x{stats.bronzeMedals}
              </span>
            </div>

            {/* Silver */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-2xl mb-1">🥈</div>
              <span className="block text-[10px] text-slate-400 font-medium">Plata (25)</span>
              <span className="font-mono text-xs font-bold text-slate-300 tabular-nums mt-0.5 block">
                x{stats.silverMedals}
              </span>
            </div>

            {/* Gold */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-2xl mb-1">🥇</div>
              <span className="block text-[10px] text-slate-400 font-medium">Oro (50)</span>
              <span className="font-mono text-xs font-bold text-amber-300 tabular-nums mt-0.5 block">
                x{stats.goldMedals}
              </span>
            </div>

            {/* Platinum */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-2xl mb-1">💎</div>
              <span className="block text-[10px] text-slate-400 font-medium">Platino (100)</span>
              <span className="font-mono text-xs font-bold text-cyan-300 tabular-nums mt-0.5 block">
                x{stats.platinumMedals}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('¿Deseas reiniciar todas las estadísticas a 0?')) {
                sounds.playClick();
                onResetStats();
              }
            }}
            className="text-[11px] text-rose-400/80 hover:text-rose-400 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restablecer datos</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
