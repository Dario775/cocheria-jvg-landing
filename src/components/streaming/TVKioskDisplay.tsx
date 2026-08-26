import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, MapPin, Sparkles, Flame, MessageSquare, Volume2, VolumeX, Shield, Radio, Power } from 'lucide-react';
import { EmblemIcon } from '../logos/CompanyLogos';
import { FloatingCandleEmbers } from '../effects/FloatingCandleEmbers';

interface TVKioskDisplayProps {
  deviceCode?: string;
  roomName?: string;
  branchName?: string;
  onClose?: () => void;
}

export const TVKioskDisplay: React.FC<TVKioskDisplayProps> = ({
  deviceCode = 'TV-JVG-01',
  roomName = 'Sala Magna Principal',
  branchName = 'Casa Central • Joaquín V. González',
  onClose
}) => {
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Floating live condolence notification on the TV screen
  const [activeNotification, setActiveNotification] = useState<{
    sender: string;
    city: string;
    message: string;
  } | null>({
    sender: 'Familia Morales Gómez',
    city: 'Salta Capital',
    message: 'Acompañamos con amor y respeto a la familia Figueroa en este momento de recogimiento.'
  });

  // Update real time clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate incoming real-time notifications on the TV
  useEffect(() => {
    const simulatedMessages = [
      { sender: 'Dra. Silvina Navarro', city: 'Córdoba', message: 'Elevamos una plegaria por el eterno descanso de Don Roberto.' },
      { sender: 'Esteban y Gabriela', city: 'Buenos Aires', message: 'Un abrazo fraternal con todo nuestro cariño y apoyo.' },
      { sender: 'Comunidad Educativa', city: 'Joaquín V. González', message: 'En memoria de nuestro querido maestro y vecino ejemplar.' }
    ];
    let index = 0;
    const msgInterval = setInterval(() => {
      index = (index + 1) % simulatedMessages.length;
      setActiveNotification(simulatedMessages[index]);
    }, 9000);

    return () => clearInterval(msgInterval);
  }, []);

  return (
    <div className="relative w-full min-h-[550px] sm:min-h-[650px] bg-black text-white rounded-3xl overflow-hidden border border-stone-800 shadow-2xl flex flex-col justify-between font-sans select-none">
      
      {/* Top TV Bar: Institutional Header & Realtime Clock */}
      <div className="relative z-20 p-5 sm:p-7 bg-gradient-to-b from-black/95 via-black/60 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
            <EmblemIcon primaryColor="#D97706" className="w-8 h-8 drop-shadow" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg sm:text-xl tracking-wider text-amber-100 uppercase">
              Cochería J.V. González
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span className="text-amber-400 font-semibold">{roomName}</span>
              <span>•</span>
              <span>{branchName}</span>
            </div>
          </div>
        </div>

        {/* Real-time Clock & TV Status */}
        <div className="flex items-center gap-4 text-right">
          <div className="hidden sm:block">
            <div className="text-xl sm:text-2xl font-mono font-bold tracking-widest text-amber-200">
              {currentTime}
            </div>
            <div className="text-[11px] text-stone-400 capitalize">
              {currentDate}
            </div>
          </div>

          {/* Test Control Switch: Toggle Standby / Live */}
          <div className="flex items-center gap-2 bg-stone-900/90 border border-stone-800 p-1.5 rounded-2xl">
            <button
              onClick={() => setIsLiveStreamActive(!isLiveStreamActive)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isLiveStreamActive
                  ? 'bg-red-700 text-white shadow-md'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isLiveStreamActive ? 'Modo Transmisión' : 'Modo Espera'}</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg"
                title="Cerrar visor TV"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Screen Content */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <FloatingCandleEmbers />

        {isLiveStreamActive ? (
          /* Live Stream Mode in the TV Box */
          <div className="relative w-full h-full flex items-center justify-center p-6 text-center">
            
            {/* Background subtle altar lighting */}
            <div className="absolute inset-0 bg-radial-at-c from-stone-900/80 via-black to-black" />

            <div className="relative z-10 space-y-4 max-w-xl">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-amber-600/60 shadow-2xl mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80"
                  alt="Don Roberto Figueroa"
                  className="w-full h-full object-cover filter grayscale contrast-105"
                />
              </div>

              <div>
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-red-950/80 text-red-300 border border-red-800/60 inline-flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  Transmisión en Vivo a Familiares y Amigos
                </span>
                <h3 className="text-2xl sm:text-4xl font-serif font-bold text-stone-50">
                  Don Roberto Ernesto Figueroa
                </h3>
                <p className="text-stone-400 text-xs sm:text-sm font-mono mt-1">
                  1943 — 2026 (83 años)
                </p>
                <p className="text-amber-200/90 text-sm italic font-serif pt-2 max-w-md mx-auto">
                  &ldquo;Tu recuerdo y enseñanzas permanecerán para siempre en el corazón de nuestra comunidad.&rdquo;
                </p>
              </div>
            </div>

            {/* Real-time Floating Condolence Toast on the TV Corner */}
            <AnimatePresence mode="wait">
              {activeNotification && (
                <motion.div
                  key={activeNotification.sender + activeNotification.message}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md p-4 rounded-2xl bg-stone-900/95 border border-amber-500/40 backdrop-blur-md shadow-2xl text-left z-30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4 text-amber-500 candle-flame" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Nueva Condolencia desde la Sala Virtual
                    </span>
                  </div>
                  <strong className="block text-sm text-stone-100 font-semibold">
                    {activeNotification.sender} <span className="text-xs font-normal text-stone-400">({activeNotification.city})</span>
                  </strong>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed italic">
                    "{activeNotification.message}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        ) : (
          /* Standby Mode (When no wake is active in this room) */
          <div className="relative z-10 text-center space-y-5 p-8 max-w-lg">
            <div className="w-20 h-20 rounded-3xl bg-amber-600/15 border border-amber-500/30 flex items-center justify-center mx-auto">
              <EmblemIcon primaryColor="#D97706" className="w-14 h-14 drop-shadow" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-stone-100">
                Sala Acondicionada y en Espera
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 mt-2 leading-relaxed font-light">
                {roomName} • Guardia Permanente y Servicio de Atención las 24 Horas.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 border border-stone-800 text-xs text-stone-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Dispositivo {deviceCode} Sincronizado</span>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Bar: Slogan & Status */}
      <div className="relative z-20 p-4 px-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-center justify-between text-xs text-stone-400 border-t border-stone-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Cochería J.V. González • Dignidad, Respeto y Calidez Humana</span>
        </div>
        <div className="font-mono text-[11px] text-stone-500">
          Receptor Kiosco v1.0 • {deviceCode}
        </div>
      </div>

    </div>
  );
};
