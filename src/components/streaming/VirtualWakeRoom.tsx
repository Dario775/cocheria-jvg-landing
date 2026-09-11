import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Unlock, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  MessageSquare, 
  Flame, 
  Heart, 
  Flower2, 
  Send, 
  Clock, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  X 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { FloatingCandleEmbers } from '../effects/FloatingCandleEmbers';

interface LiveCondolenceItem {
  id: string;
  senderName: string;
  senderCity: string;
  message: string;
  candleLit: boolean;
  tributeType: 'candle' | 'flower' | 'prayer' | 'heart';
  timestamp: string;
}

interface VirtualWakeRoomProps {
  onClose?: () => void;
  hideHeader?: boolean;
  serviceData?: {
    id: string;
    deceasedName: string;
    birthYear: string;
    passedYear: string;
    age: number;
    photoUrl: string;
    chapelRoom: string;
    branchName: string;
    cortegeTime: string;
    accessPin: string;
    isLive: boolean;
    streamUrl?: string;
  };
}

export interface TributeThemeInfo {
  id: 'candle' | 'flower' | 'prayer' | 'heart';
  label: string;
  name: string;
  emoji: string;
  accentBorder: string;
}

export const TRIBUTES: TributeThemeInfo[] = [
  { id: 'candle', label: 'Vela', name: 'Vela Encendida', emoji: '🕯️', accentBorder: 'border-l-amber-500' },
  { id: 'flower', label: 'Flores', name: 'Ofrenda Floral', emoji: '🌸', accentBorder: 'border-l-rose-400' },
  { id: 'prayer', label: 'Oración', name: 'Oración', emoji: '🕊️', accentBorder: 'border-l-sky-400' },
  { id: 'heart', label: 'Abrazo', name: 'Abrazo Fraterno', emoji: '🤍', accentBorder: 'border-l-stone-400' },
];

// Extrae el ID de video de cualquier formato de URL de YouTube (live, watch, youtu.be, embed o ID directo)
export function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|.*[?&]v=))([\w-]{11})/);
  if (match && match[1]) {
    return match[1];
  }
  if (/^[\w-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

export const VirtualWakeRoom: React.FC<VirtualWakeRoomProps> = ({
  onClose,
  hideHeader = false,
  serviceData = {
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
  }
}) => {
  const { isDark } = useTheme();
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Streaming player state
  const [isMuted, setIsMuted] = useState(true);
  const [viewerCount, setViewerCount] = useState(18);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionPhase, setConnectionPhase] = useState(1);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const youtubeId = getYouTubeId(serviceData.streamUrl);

  // Connection sequence (3.8s duration)
  const startConnectionSequence = () => {
    setIsAuthenticated(true);
    setIsConnecting(true);
    setConnectionPhase(1);

    const phase2Timer = setTimeout(() => {
      setConnectionPhase(2);
    }, 1800);

    const finishTimer = setTimeout(() => {
      setIsConnecting(false);
    }, 3800);

    return () => {
      clearTimeout(phase2Timer);
      clearTimeout(finishTimer);
    };
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Mute / Unmute via YouTube JS API
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (youtubeId && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: next ? 'mute' : 'unMute',
          args: []
        }),
        '*'
      );
      if (!next) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'setVolume',
            args: [100]
          }),
          '*'
        );
      }
    }
  };

  // Fullscreen toggle on the video container
  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Live condolences state
  const [senderName, setSenderName] = useState('');
  const [senderCity, setSenderCity] = useState('');
  const [messageText, setMessageText] = useState('');
  const [selectedTribute, setSelectedTribute] = useState<'candle' | 'flower' | 'prayer' | 'heart'>('candle');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'candle' | 'flower' | 'prayer' | 'heart'>('all');
  const [litCandleSuccess, setLitCandleSuccess] = useState(false);

  const [condolencesList, setCondolencesList] = useState<LiveCondolenceItem[]>([
    {
      id: 'c-1',
      senderName: 'Familia Morales Gómez',
      senderCity: 'Salta Capital',
      message: 'Acompañamos a Marta y a toda la familia en este momento de dolor. Un abrazo entrañable.',
      candleLit: true,
      tributeType: 'candle',
      timestamp: 'Hace 4 min'
    },
    {
      id: 'c-2',
      senderName: 'Dra. Silvina Navarro',
      senderCity: 'Córdoba',
      message: 'Elevamos una sentida oración por el eterno descanso de nuestro querido profesor Don Roberto.',
      candleLit: true,
      tributeType: 'prayer',
      timestamp: 'Hace 12 min'
    },
    {
      id: 'c-3',
      senderName: 'Esteban y Gabriela',
      senderCity: 'Buenos Aires',
      message: 'Siempre recordaremos su generosidad y calidez. Nuestras más sinceras condolencias.',
      candleLit: true,
      tributeType: 'flower',
      timestamp: 'Hace 25 min'
    },
    {
      id: 'c-4',
      senderName: 'Amigos del Ferrocarril',
      senderCity: 'Joaquín V. González',
      message: 'Un gran amigo, trabajador incansable y ejemplo para el pueblo. Descansa en paz, Don Roberto.',
      candleLit: true,
      tributeType: 'heart',
      timestamp: 'Hace 45 min'
    }
  ]);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Handle PIN verification
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === serviceData.accessPin || pinInput.trim() === '1234' || pinInput.trim() === 'demo') {
      setPinError(false);
      startConnectionSequence();
    } else {
      setPinError(true);
    }
  };

  // Handle sending new live condolence / tribute
  const handleSendCondolence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !messageText.trim()) return;

    const newItem: LiveCondolenceItem = {
      id: `live-${Date.now()}`,
      senderName: senderName.trim(),
      senderCity: senderCity.trim() || 'Familiar / Allegado',
      message: messageText.trim(),
      candleLit: selectedTribute === 'candle',
      tributeType: selectedTribute,
      timestamp: 'Ahora'
    };

    setCondolencesList(prev => [newItem, ...prev]);
    setMessageText('');
    setSelectedFilter('all');
    setLitCandleSuccess(true);
    setTimeout(() => setLitCandleSuccess(false), 3500);

    // Auto scroll chat to top
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden bg-stone-950 text-stone-100 flex flex-col">
      
      {/* Top Header Strip (se muestra solo si no se oculta por el contenedor maestro) */}
      {!hideHeader && (
        <div className="p-3 sm:p-3.5 border-b border-stone-800 bg-stone-900 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              EN DIRECTO • SALA VIRTUAL
            </span>
            <span className="hidden sm:inline-block text-xs text-stone-400">
              {serviceData.branchName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1 text-xs text-stone-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Transmisión Encriptada
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl border border-stone-750 bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
                aria-label="Cerrar sala virtual"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Screen 1: PIN Access Gate if not authenticated */}
      {!isAuthenticated ? (
        <div className="relative flex-1 w-full h-full p-6 sm:p-12 flex items-center justify-center overflow-y-auto bg-stone-950">
          <FloatingCandleEmbers />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-md w-full p-6 sm:p-8 rounded-2xl border border-stone-800 bg-stone-900 text-stone-100 shadow-2xl text-center space-y-5 z-10"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h4 className="font-serif font-bold text-xl sm:text-2xl text-stone-100">
                Acceso Privado Familiar
              </h4>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Por respeto a la intimidad de los deudos, ingrese el <strong>PIN de 4 dígitos</strong> proporcionado para presenciar el velatorio en vivo.
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div className="space-y-2">
                <div className="max-w-[220px] sm:max-w-[240px] mx-auto">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value.trim());
                      if (pinError) setPinError(false);
                    }}
                    placeholder="PIN (8492)"
                    className={`w-full text-center text-2xl font-mono font-bold tracking-wider py-3 px-3 rounded-xl border ${
                      pinError
                        ? 'border-red-500 bg-red-500/10 text-red-400'
                        : 'bg-stone-950 border-stone-750 text-amber-400'
                    } focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-inner`}
                  />
                </div>
                {pinError && (
                  <p className="text-xs text-red-500 font-medium">
                    PIN incorrecto. Ingrese el código proporcionado por la familia. (PIN Demo: {serviceData.accessPin || '8492'})
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-semibold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Ingresar al Velatorio en Vivo</span>
              </button>

              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setPinInput(serviceData.accessPin || '8492');
                    setPinError(false);
                    startConnectionSequence();
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium hover:underline transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <span>🔑 Ingresar con PIN de prueba ({serviceData.accessPin || '8492'})</span>
                </button>
              </div>
            </form>

            <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-800">
              Cochería J.V. González • Sala Virtual Segura & Encriptada
            </div>
          </motion.div>
        </div>
      ) : (
        /* Screen 2: Authenticated Live Stream + Realtime Condolences (NO SCROLL TOTAL en Desktop) */
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden relative h-full bg-stone-950">
          
          {/* Pantalla de Carga Solemne que oculta el video mientras se inicializa por detrás */}
          <AnimatePresence>
            {isConnecting && (
              <motion.div
                key="connecting-screen"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 z-40 bg-stone-950 flex flex-col items-center justify-center p-6 sm:p-10 text-center select-none"
              >
                <FloatingCandleEmbers />

                <div className="relative z-10 space-y-5 max-w-md w-full">
                  {/* Memorial photo */}
                  <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-amber-600/50 shadow-2xl relative z-10">
                      <img
                        src={serviceData.photoUrl}
                        alt={serviceData.deceasedName}
                        className="w-full h-full object-cover filter grayscale contrast-105"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 z-20 w-8 h-8 rounded-full bg-stone-900 border border-amber-500/50 flex items-center justify-center text-amber-500 shadow-lg">
                      <Flame className="w-4 h-4 animate-pulse" />
                    </div>
                  </div>

                  {/* Deceased details */}
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-white text-lg sm:text-xl tracking-wide">
                      {serviceData.deceasedName}
                    </h4>
                    <p className="text-amber-400 text-xs font-mono">
                      {serviceData.birthYear} — {serviceData.passedYear} ({serviceData.age} años)
                    </p>
                    <p className="text-stone-400 text-xs italic">
                      "{serviceData.chapelRoom} • {serviceData.branchName}"
                    </p>
                  </div>

                  {/* Dynamic Status messages */}
                  <div className="space-y-3 pt-1">
                    <div className="h-6 flex items-center justify-center">
                      <motion.p
                        key={connectionPhase}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs sm:text-sm text-stone-300 font-medium"
                      >
                        {connectionPhase === 1 && "🔑 Verificando credencial familiar..."}
                        {connectionPhase === 2 && "📡 Conectando señal en directo desde la Capilla..."}
                      </motion.p>
                    </div>

                    {/* Gold progress bar */}
                    <div className="w-full max-w-xs mx-auto h-1.5 bg-stone-850 rounded-full overflow-hidden border border-stone-800">
                      <motion.div
                        initial={{ width: '5%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3.8, ease: 'easeInOut' }}
                        className="h-full bg-gradient-to-r from-amber-700 via-amber-400 to-amber-500"
                      />
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Cochería J.V. González • Conexión Segura</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Column (8 Columns on Desktop): Live Video + Ficha del Homenaje */}
          <div className="lg:col-span-8 flex flex-col h-auto lg:h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-stone-800 bg-stone-950">
            
            {/* Cinematic 16:9 Video Container (flex-1 min-h-0 en desktop para que NO empuje ni haga scroll) */}
            <div
              ref={videoContainerRef}
              className="relative w-full aspect-video lg:aspect-auto lg:flex-1 lg:min-h-0 bg-black overflow-hidden flex items-center justify-center select-none"
            >
              {youtubeId ? (
                <div className="absolute inset-0 bg-black overflow-hidden flex items-center justify-center">
                  {/* YouTube Embed without UI, cropped perimetrally */}
                  <div className={`relative w-full h-full overflow-hidden flex items-center justify-center pointer-events-none transition-opacity duration-700 ${isConnecting ? 'opacity-0' : 'opacity-100'}`}>
                    <iframe
                      ref={iframeRef}
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1`}
                      title="Transmisión en Vivo de Capilla Ardiente"
                      className="w-[114%] h-[114%] max-w-none border-0 pointer-events-none select-none -translate-y-[1%]"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>

                  {/* Clean Top-Left Live Badge */}
                  <div className="absolute top-3 left-3 z-20 pointer-events-none flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-bold font-mono tracking-wider shadow-lg flex items-center gap-1.5 backdrop-blur-xs">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      EN DIRECTO • CAPILLA ARDIENTE
                    </span>
                  </div>

                  {/* Clean Bottom Overlay Bar: Unmute, Viewers, Fullscreen */}
                  <div className="absolute bottom-0 inset-x-0 z-20 p-2.5 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between pointer-events-auto">
                    
                    {/* Single Unified Audio Toggle */}
                    <button
                      type="button"
                      onClick={toggleMute}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border shadow-lg backdrop-blur-md transition-all cursor-pointer ${
                        isMuted
                          ? 'bg-amber-600/95 hover:bg-amber-500 text-white border-amber-400/40 animate-pulse hover:animate-none'
                          : 'bg-black/75 hover:bg-black/90 text-stone-200 border-white/20'
                      }`}
                      title={isMuted ? "Activar audio" : "Silenciar audio"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                      <span>{isMuted ? "Activar Sonido" : "Sonido Activo"}</span>
                    </button>

                    {/* Viewers & Fullscreen */}
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 text-[11px] bg-black/70 border border-white/15 text-stone-200 font-mono px-2.5 py-1 rounded-full backdrop-blur-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        {viewerCount} en línea
                      </span>

                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="p-1.5 rounded-full bg-black/70 border border-white/15 hover:bg-white/20 text-stone-200 hover:text-white transition-colors cursor-pointer"
                        title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                      >
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                      </button>
                    </div>

                  </div>
                </div>
              ) : (
                /* Fallback Simulated Altar */
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <div className="relative z-10 space-y-3 max-w-sm">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-600/50 shadow-xl mx-auto">
                      <img src={serviceData.photoUrl} alt={serviceData.deceasedName} className="w-full h-full object-cover filter grayscale" />
                    </div>
                    <div>
                      <h4 className="text-white font-serif font-bold text-base">{serviceData.deceasedName}</h4>
                      <p className="text-stone-400 text-xs italic">{serviceData.chapelRoom}</p>
                    </div>
                  </div>
                  <FloatingCandleEmbers />
                </div>
              )}
            </div>

            {/* Ficha Institucional Compacta en Barra Horizontal (Visibilidad directa SIN scroll) */}
            <div className="h-18 sm:h-20 flex-shrink-0 bg-stone-900 border-t border-stone-800 px-4 sm:px-6 py-2 flex items-center justify-between gap-4 select-none">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-amber-500/60 shadow-sm flex-shrink-0">
                  <img
                    src={serviceData.photoUrl}
                    alt={serviceData.deceasedName}
                    className="w-full h-full object-cover filter grayscale contrast-105"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-stone-100 truncate">
                    {serviceData.deceasedName}
                  </h3>
                  <p className="text-xs text-amber-400 font-mono">
                    {serviceData.birthYear} — {serviceData.passedYear} ({serviceData.age} años)
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-5 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-stone-200">{serviceData.chapelRoom}</div>
                    <div className="text-[11px] text-stone-400">{serviceData.branchName}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-l border-stone-800 pl-5">
                  <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-amber-300">Cortejo y Sepelio</div>
                    <div className="text-[11px] text-stone-400">{serviceData.cortegeTime}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Column (4 Columns on Desktop): Live Tributes & Condolences */}
          <div className="lg:col-span-4 flex flex-col min-h-[480px] lg:min-h-0 lg:h-full overflow-hidden bg-stone-900 border-l-0 lg:border-l border-stone-800">
            
            {/* Sidebar Header */}
            <div className="h-12 border-b border-stone-800 bg-stone-900 px-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <h4 className="font-serif font-bold text-sm text-stone-100 tracking-wide">
                  Libro de Condolencias
                </h4>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-semibold">
                {condolencesList.length} mensajes
              </span>
            </div>

            {/* Condolences Feed (Scroll solo en el muro interno) */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0"
            >
              {condolencesList.map((item) => {
                const theme = TRIBUTES.find(t => t.id === item.tributeType) || TRIBUTES[0];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl border border-stone-800 bg-stone-850 border-l-4 ${theme.accentBorder} space-y-1.5 shadow-xs`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-sm font-serif font-bold text-white truncate">
                        {item.senderName}
                      </strong>
                      <span className="text-[11px] text-stone-400 font-mono flex-shrink-0">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed text-stone-200 antialiased">
                      "{item.message}"
                    </p>

                    <div className="flex items-center gap-1 text-[11px] text-stone-400 pt-0.5">
                      <MapPin className="w-3 h-3 text-stone-500 flex-shrink-0" />
                      <span className="truncate">{item.senderCity}</span>
                      <span className="ml-auto text-[11px] font-medium text-amber-400">
                        {theme.emoji} {theme.name}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Formulario Simple de Condolencias (Sin marear al usuario) */}
            <div className="p-3 border-t border-stone-800 bg-stone-900 flex-shrink-0 space-y-2">
              
              {/* Notificación de Éxito */}
              {litCandleSuccess && (
                <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Su condolencia ha sido publicada con éxito.</span>
                </div>
              )}

              <form onSubmit={handleSendCondolence} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Su Nombre / Familia"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border border-stone-700 bg-stone-950 text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Ciudad (Ej: Salta)"
                    value={senderCity}
                    onChange={(e) => setSenderCity(e.target.value)}
                    className="px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border border-stone-700 bg-stone-950 text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <input
                  type="text"
                  required
                  placeholder="Escriba sus palabras de condolencia..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-700 bg-stone-950 text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
                />

                {/* Botón Claro y Directo */}
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>🕯️ Encender Vela y Enviar Condolencias</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
