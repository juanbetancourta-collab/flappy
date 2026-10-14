import React, { useState } from 'react';
import { X, Bookmark, Share2, Copy, Check, Smartphone, Globe, HardDrive } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

interface ShareSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareSaveModal: React.FC<ShareSaveModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    sounds.playClick();
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <h2 className="font-arcade text-sm text-white tracking-wide">
              CÓMO GUARDAR Y JUGAR
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

        <div className="space-y-4 mb-6 text-xs">
          {/* 1. Link / URL */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-200 mb-1.5">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>1. Enlace Web Directo (Para jugar o compartir)</span>
            </div>
            <p className="text-slate-400 mb-3 leading-relaxed">
              Este juego ya está desplegado en la nube. Copia este enlace para abrirlo en cualquier dispositivo o compartirlo con tus amigos:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center gap-1.5 text-xs transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* 2. Guardar en tu teléfono o PC */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-900 text-emerald-400 shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-200 mb-1">
                2. Guardar como App o Marcador
              </div>
              <p className="text-slate-400 leading-relaxed">
                • <strong>En PC</strong>: Presiona <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">Ctrl + D</kbd> (o Cmd + D en Mac) para guardarlo en Marcadores.<br/>
                • <strong>En Móvil</strong>: Toca el menú de opciones del navegador y selecciona <em>"Agregar a la pantalla principal"</em>.
              </p>
            </div>
          </div>

          {/* 3. Progreso automático */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-900 text-amber-400 shrink-0">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-200 mb-1">
                3. Tus récords y opciones se guardan solos
              </div>
              <p className="text-slate-400 leading-relaxed">
                Tu récord máximo, medallas, el ave que elegiste y el escenario se guardan automáticamente en la memoria local de tu navegador. No tienes que hacer nada para no perderlos.
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
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
