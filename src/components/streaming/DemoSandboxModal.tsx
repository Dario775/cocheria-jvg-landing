import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Tv, Monitor } from 'lucide-react';
import { VirtualWakeRoom } from './VirtualWakeRoom';
import { TVKioskDisplay } from './TVKioskDisplay';

interface DemoSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoSandboxModal: React.FC<DemoSandboxModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'virtual_wake' | 'tv_kiosk'>('virtual_wake');

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Bloquear scroll del fondo mientras está en pantalla completa
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 w-screen h-screen bg-stone-950 text-stone-100 flex flex-col overflow-hidden animate-in fade-in duration-200 select-none"
    >
      {/* Marco Superior Oscuro y Elegante */}
      <div className="h-13 flex-shrink-0 bg-stone-900 border-b border-stone-800 px-4 sm:px-6 flex items-center justify-between gap-3 z-30 select-none">
        <div className="flex items-center gap-3">
          <h3 className="font-serif font-bold text-sm sm:text-base tracking-wide text-stone-100">
            Cochería J.V. González
          </h3>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-[11px] font-bold font-mono tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            EN DIRECTO
          </span>
          <span className="hidden lg:inline-block text-xs text-stone-400">
            • Capilla Ardiente Virtual
          </span>
        </div>

        {/* Selector de Modo: Capilla Virtual o Pantalla TV Box */}
        <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs shadow-inner">
          <button
            onClick={() => setActiveTab('virtual_wake')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'virtual_wake'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Capilla Virtual</span>
          </button>
          <button
            onClick={() => setActiveTab('tv_kiosk')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tv_kiosk'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Modo TV Box</span>
          </button>
        </div>

        {/* Acciones de Cierre */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-stone-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Transmisión Privada
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl border border-stone-700 bg-stone-800 hover:bg-stone-750 text-stone-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            aria-label="Cerrar sala virtual"
          >
            <span>Cerrar</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contenedor Principal: 100% sin scroll externo */}
      <div className="flex-1 w-full h-[calc(100vh-52px)] flex flex-col overflow-hidden">
        {activeTab === 'virtual_wake' ? (
          <VirtualWakeRoom
            hideHeader={true}
            onClose={onClose}
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
              streamUrl: 'https://youtube.com/live/8CEwaLFlR-E?feature=share'
            }}
          />
        ) : (
          <div className="w-full h-full p-2 sm:p-4 bg-stone-950 flex flex-col overflow-hidden">
            <TVKioskDisplay
              deviceCode="TV-JVG-01"
              roomName="Sala Magna A"
              branchName="Casa Central • Joaquín V. González"
              onClose={onClose}
            />
          </div>
        )}
      </div>
    </div>
  );
};
