import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, MapPin, Sparkles, Flame, Radio, Tv, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useWakeServices } from '../context/WakeServicesContext';
import { EmblemIcon } from '../components/logos/CompanyLogos';
import { FloatingCandleEmbers } from '../components/effects/FloatingCandleEmbers';

export const TVKioskPage: React.FC = () => {
  const { deviceCode } = useParams<{ deviceCode: string }>();
  const navigate = useNavigate();
  const { getTVDevice, getWakeById, moderationQueue, tvDevices } = useWakeServices();

  const currentDevice = deviceCode ? getTVDevice(deviceCode) : undefined;
  const assignedWake = currentDevice?.assignedWakeId ? getWakeById(currentDevice.assignedWakeId) : undefined;

  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Floating notification on the TV from the approved moderation queue
  const [activeToast, setActiveToast] = useState<{
    sender: string;
    city: string;
    message: string;
    type?: string;
  } | null>(null);

  // Real-time clock update
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cycle through approved condolences in real-time
  useEffect(() => {
    const approved = moderationQueue.filter(
      item => item.status === 'aprobado' && (!assignedWake || item.wakeId === assignedWake.id)
    );

    if (approved.length === 0) {
      setActiveToast({
        sender: 'Familia Morales Gómez',
        city: 'Salta Capital',
        message: 'Acompañamos con amor y respeto a la familia en este momento de recogimiento.'
      });
      return;
    }

    let currentIndex = 0;
    setActiveToast({
      sender: approved[0].senderName,
      city: approved[0].senderCity,
      message: approved[0].message,
      type: approved[0].tributeType
    });

    const toastTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % approved.length;
      const next = approved[currentIndex];
      setActiveToast({
        sender: next.senderName,
        city: next.senderCity,
        message: next.message,
        type: next.tributeType
      });
    }, 10000);

    return () => clearInterval(toastTimer);
  }, [moderationQueue, assignedWake]);

  // If no valid TV code found, show room selection
  if (!currentDevice) {
    return (
      <div className="w-screen h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center mx-auto">
            <Tv className="w-8 h-8 text-amber-400" />
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-100">
              Configurar Pantalla TV Box
            </h2>
            <p className="text-xs text-stone-400 mt-2">
              Seleccione la sala física para vincular este receptor Smart TV:
            </p>
          </div>

          <div className="space-y-2 text-left">
            {tvDevices.map(tv => (
              <button
                key={tv.deviceCode}
                onClick={() => navigate(`/tv/${tv.deviceCode}`)}
                className="w-full p-3.5 rounded-2xl bg-stone-950 hover:bg-amber-950/40 border border-stone-800 hover:border-amber-600/50 flex items-center justify-between transition-all cursor-pointer group"
              >
                <div>
                  <strong className="block text-sm text-stone-200 group-hover:text-amber-200">
                    {tv.roomName}
                  </strong>
                  <span className="text-xs text-stone-400">{tv.branchName}</span>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-stone-900 text-amber-400 border border-stone-700">
                  {tv.deviceCode}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/admin')}
            className="text-xs text-stone-400 hover:text-stone-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Panel de Guardia</span>
          </button>
        </div>
      </div>
    );
  }

  const isTransmissionMode = currentDevice.mode === 'transmision' && assignedWake;

  return (
    <div className="relative w-screen h-screen bg-black text-white overflow-hidden flex flex-col justify-between font-sans select-none">
      
      {/* Top TV Bar: Institutional Header & Real-time Clock */}
      <div className="relative z-20 p-5 sm:p-7 bg-gradient-to-b from-black/95 via-black/60 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center shadow-lg">
            <EmblemIcon primaryColor="#D97706" className="w-9 h-9 drop-shadow" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl tracking-wider text-amber-100 uppercase">
              Cochería J.V. González
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-400">
              <span className="text-amber-400 font-semibold">{currentDevice.roomName}</span>
              <span>•</span>
              <span>{currentDevice.branchName}</span>
            </div>
          </div>
        </div>

        {/* Real-time Clock & Device Info */}
        <div className="flex items-center gap-5 text-right">
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-bold tracking-widest text-amber-200">
              {currentTime}
            </div>
            <div className="text-xs text-stone-400 capitalize">
              {currentDate}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/90 border border-stone-800 text-xs font-mono text-stone-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{currentDevice.deviceCode}</span>
          </div>
        </div>
      </div>

      {/* Main Screen Content */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <FloatingCandleEmbers />

        {isTransmissionMode ? (
          /* Modo Transmisión (Homenaje al Difunto y Condolencias en Pantalla) */
          <div className="relative w-full h-full flex items-center justify-center p-6 text-center">
            <div className="absolute inset-0 bg-radial-at-c from-stone-900/80 via-black to-black" />

            <div className="relative z-10 space-y-4 max-w-2xl animate-in fade-in duration-500">
              <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-amber-600/70 shadow-2xl mx-auto ring-8 ring-amber-900/30">
                <img
                  src={assignedWake.photoUrl}
                  alt={assignedWake.deceasedName}
                  className="w-full h-full object-cover filter grayscale contrast-105"
                />
              </div>

              <div>
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-red-950/90 text-red-300 border border-red-800/70 inline-flex items-center gap-2 mb-3 shadow-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  Transmisión en Vivo a Familiares y Allegados
                </span>

                <h2 className="text-3xl sm:text-5xl font-serif font-bold text-stone-50 tracking-wide">
                  {assignedWake.deceasedName}
                </h2>

                <p className="text-stone-400 text-sm sm:text-base font-mono mt-2 tracking-wider">
                  {assignedWake.birthYear} — {assignedWake.passedYear} ({assignedWake.age} años)
                </p>

                {assignedWake.epitaph && (
                  <p className="text-amber-200/90 text-sm sm:text-base italic font-serif pt-3 max-w-lg mx-auto leading-relaxed">
                    &ldquo;{assignedWake.epitaph}&rdquo;
                  </p>
                )}

                {assignedWake.cortegeTime && (
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-900/90 border border-stone-800 text-xs sm:text-sm text-stone-300">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Cortejo: {assignedWake.cortegeTime}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Condolence Toast in Lower Corner */}
            <AnimatePresence mode="wait">
              {activeToast && (
                <motion.div
                  key={activeToast.sender + activeToast.message}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-8 left-8 right-8 sm:right-auto sm:max-w-lg p-5 rounded-3xl bg-stone-900/95 border border-amber-500/40 backdrop-blur-md shadow-2xl text-left z-30"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Flame className="w-4 h-4 text-amber-500 candle-flame" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Nueva Condolencia desde la Sala Virtual
                    </span>
                  </div>
                  <strong className="block text-base text-stone-100 font-semibold">
                    {activeToast.sender} <span className="text-xs font-normal text-stone-400">({activeToast.city})</span>
                  </strong>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed italic">
                    "{activeToast.message}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        ) : (
          /* Modo Espera (Sala Acondicionada / Guardia 24hs) */
          <div className="relative z-10 text-center space-y-6 p-8 max-w-xl animate-in fade-in duration-500">
            <div className="w-24 h-24 rounded-3xl bg-amber-600/15 border border-amber-500/30 flex items-center justify-center mx-auto shadow-2xl">
              <EmblemIcon primaryColor="#D97706" className="w-16 h-16 drop-shadow" />
            </div>

            <div>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-stone-100 tracking-wide">
                Sala Acondicionada y en Espera
              </h2>
              <p className="text-sm sm:text-base text-stone-400 mt-3 leading-relaxed font-light">
                {currentDevice.roomName} • {currentDevice.branchName}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Guardia Permanente y Servicio de Atención las 24 Horas.
              </p>
            </div>

            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-stone-900 border border-stone-800 text-xs text-stone-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Dispositivo {currentDevice.deviceCode} Sincronizado</span>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Bar: Slogan & Device ID */}
      <div className="relative z-20 p-4 px-8 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-center justify-between text-xs text-stone-400 border-t border-stone-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Cochería J.V. González • Dignidad, Respeto y Calidez Humana</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="text-[11px] text-stone-600 hover:text-stone-400 transition-colors cursor-pointer"
            title="Acceso al Panel de Guardia"
          >
            Panel de Guardia
          </button>
          <span className="font-mono text-[11px] text-stone-500">
            Receptor Kiosco v2.0 • {currentDevice.deviceCode}
          </span>
        </div>
      </div>

    </div>
  );
};
