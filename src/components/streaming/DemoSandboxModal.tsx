import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Tv, Video, ShieldCheck, Radio, Sparkles, Lock, FileText, CheckCircle2, Building2 } from 'lucide-react';
import { VirtualWakeRoom } from './VirtualWakeRoom';
import { TVKioskDisplay } from './TVKioskDisplay';
import { useTheme } from '../../context/ThemeContext';

interface DemoSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoSandboxModal: React.FC<DemoSandboxModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'virtual_wake' | 'tv_kiosk'>('virtual_wake');

  if (!isOpen) return null;

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
    >
      <div className={`relative w-full max-w-5xl max-h-[94vh] flex flex-col ${
        isDark ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
      } border rounded-3xl shadow-2xl overflow-hidden`}>
        
        {/* Modal Top Control Bar */}
        <div className={`sticky top-0 z-20 flex-shrink-0 ${
          isDark ? 'bg-stone-900/95 border-stone-800' : 'bg-white/95 border-stone-200'
        } backdrop-blur-md border-b p-3 sm:p-4 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 shadow-xs`}>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 text-amber-500">
              Demo Interna
            </span>
            <h3 className="font-serif font-bold text-sm sm:text-base">
              Simulador de Velatorios Online & Pantallas TV Box
            </h3>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-750 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('virtual_wake')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'virtual_wake'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Sala Virtual (Familiares)</span>
            </button>

            <button
              onClick={() => setActiveTab('tv_kiosk')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'tv_kiosk'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Receptor TV Box (Salas)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold ${
              isDark 
                ? 'bg-stone-850 text-stone-300 hover:bg-stone-800 border-stone-700 hover:text-white' 
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-300 hover:text-stone-900'
            } transition-all`}
            aria-label="Cerrar simulador"
          >
            <span>Cerrar</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-5">
          {activeTab === 'virtual_wake' ? (
            <div className="space-y-3">
              {/* Institutional Notice with Demo PIN */}
              <div className={`p-3.5 sm:p-4 rounded-2xl border ${
                isDark ? 'bg-amber-950/20 border-amber-800/30 text-stone-200' : 'bg-amber-500/10 border-amber-500/20 text-stone-800'
              } flex flex-wrap items-center justify-between gap-3 shadow-xs`}>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs">
                    💡 <strong>Transmisión Privada en Directo:</strong> Ingrese con el PIN de prueba <strong className="font-mono text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-500/15">8492</strong> (o escriba &quot;demo&quot;) para conectarse a la capilla ardiente.
                  </span>
                </div>
              </div>

              <VirtualWakeRoom
                serviceData={{
                  id: 'demo-sepelio-1',
                  deceasedName: 'Don Roberto Ernesto Figueroa',
                  birthYear: '1943',
                  passedYear: '2026',
                  age: 83,
                  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
                  chapelRoom: 'Sala Magna A',
                  branchName: 'Sede Central - Joaquín V. González',
                  cortegeTime: 'Mañana a las 10:00 hs hacia Cementerio Parque',
                  accessPin: '8492',
                  isLive: true,
                  streamUrl: 'https://youtube.com/live/vzJawwJmq9M?feature=share'
                }}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-800 dark:text-sky-300 flex items-center justify-between">
                <span>
                  📺 <strong>Simulación de TV Box:</strong> Esta pantalla se abre automáticamente al encender el televisor en la sala velatoria. Cambie entre <em>Modo Transmisión</em> y <em>Modo Espera</em> con el interruptor superior.
                </span>
              </div>
              <TVKioskDisplay />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
