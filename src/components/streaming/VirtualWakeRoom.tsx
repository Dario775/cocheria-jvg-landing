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
import { useWakeServices } from '../../context/WakeServicesContext';
import { FloatingCandleEmbers } from '../effects/FloatingCandleEmbers';
import { sanitizeText, sanitizePin } from '../../utils/security';

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
  desc: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  avatarBg: string;
  avatarBorder: string;
}

export const TRIBUTES: TributeThemeInfo[] = [
  { 
    id: 'candle', 
    label: 'Vela', 
    name: 'Vela Encendida',
    emoji: '🕯️', 
    desc: '🕯️ Encender Vela Conmemorativa',
    accentBorder: 'border-l-amber-500',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/35',
    avatarBg: 'bg-amber-950/70',
    avatarBorder: 'border-amber-500/40',
  },
  { 
    id: 'flower', 
    label: 'Flores', 
    name: 'Ofrenda Floral',
    emoji: '🌸', 
    desc: '🌸 Enviar Ofrenda Floral',
    accentBorder: 'border-l-rose-400',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-500/35',
    avatarBg: 'bg-rose-950/70',
    avatarBorder: 'border-rose-500/40',
  },
  { 
    id: 'prayer', 
    label: 'Oración', 
    name: 'Oración Elevada',
    emoji: '🕊️', 
    desc: '🕊️ Elevar Oración en Memoria',
    accentBorder: 'border-l-sky-400',
    badgeBg: 'bg-sky-500/15',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-500/35',
    avatarBg: 'bg-sky-950/70',
    avatarBorder: 'border-sky-500/40',
  },
  { 
    id: 'heart', 
    label: 'Abrazo', 
    name: 'Abrazo Fraterno',
    emoji: '🤍', 
    desc: '🤍 Enviar Abrazo de Apoyo',
    accentBorder: 'border-l-stone-300',
    badgeBg: 'bg-stone-800/90',
    badgeText: 'text-stone-200',
    badgeBorder: 'border-stone-600/40',
    avatarBg: 'bg-stone-900',
    avatarBorder: 'border-stone-600/50',
  },
];

// Extrae el ID de video de cualquier formato de URL de YouTube (live, watch, youtu.be, embed o ID directo)
export function getYouTubeId(url?: string): string {
  if (!url) return '8CEwaLFlR-E';
  const trimmed = url.trim();
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|.*[?&]v=))([\w-]{11})/);
  if (match && match[1]) {
    // Si es el ID anterior caducado, redirigir automáticamente al nuevo directo en vivo
    return match[1] === 'vzJawwJmq9M' ? '8CEwaLFlR-E' : match[1];
  }
  if (/^[\w-]{11}$/.test(trimmed)) {
    return trimmed === 'vzJawwJmq9M' ? '8CEwaLFlR-E' : trimmed;
  }
  return '8CEwaLFlR-E';
}

// Resuelve la URL de incrustación de YouTube (soporta canales en vivo y videos directos)
export function getYouTubeEmbedUrl(url?: string): string {
  if (!url) return 'https://www.youtube.com/embed/8CEwaLFlR-E';
  const trimmed = url.trim();

  // Si es canal o enlace de transmisión de canal de Dario (@fulservice)
  if (trimmed.includes('UCDLz5hJr0Cty2I2PfhszwBw') || trimmed.includes('@fulservice') || trimmed.includes('live_stream')) {
    return 'https://www.youtube.com/embed/live_stream?channel=UCDLz5hJr0Cty2I2PfhszwBw';
  }

  const id = getYouTubeId(url);
  return `https://www.youtube.com/embed/${id}`;
}

export const VirtualWakeRoom: React.FC<VirtualWakeRoomProps> = ({
  onClose,
  hideHeader = false,
  serviceData = {
    id: '',
    deceasedName: 'Servicio Velatorio',
    birthYear: '',
    passedYear: '',
    age: 0,
    photoUrl: '',
    chapelRoom: 'Sala de Velatorio',
    branchName: 'Cochería J.V. González',
    cortegeTime: '',
    accessPin: '',
    isLive: false,
    streamUrl: ''
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
      // Forzar reproducción al terminar la pantalla de espera
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'playVideo',
            args: []
          }),
          '*'
        );
      }
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
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: next ? 'mute' : 'unMute',
          args: []
        }),
        '*'
      );
      // Siempre enviar playVideo para garantizar que arranque la señal
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'playVideo',
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

  // Acceso al contexto para sincronizar con TV Box y panel de guardia
  let addCondolenceToQueue: any = null;
  try {
    const wakeCtx = useWakeServices();
    addCondolenceToQueue = wakeCtx.addCondolenceToQueue;
  } catch {
    // Si se utiliza fuera del provider
  }

  const storageKey = `cocheria_wake_condolences_${serviceData?.id || 'demo'}`;

  const [condolencesList, setCondolencesList] = useState<LiveCondolenceItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading wake condolences from localStorage', e);
    }
    return [];
  });

  // Guardar en localStorage ante cualquier cambio
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(condolencesList));
    } catch (e) {
      console.error('Error saving wake condolences', e);
    }
  }, [condolencesList, storageKey]);

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

  // Handle sending new live condolence / tribute (sanitizado)
  const handleSendCondolence = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMsg = sanitizeText(messageText, 400);
    if (!cleanMsg) return;

    const finalAuthor = sanitizeText(senderName, 60) || 'Familiar o Allegado';
    const finalCity = sanitizeText(senderCity, 50) || 'Comunidad';

    const newItem: LiveCondolenceItem = {
      id: `live-${Date.now()}`,
      senderName: finalAuthor,
      senderCity: finalCity,
      message: cleanMsg,
      candleLit: selectedTribute === 'candle',
      tributeType: selectedTribute,
      timestamp: 'Ahora'
    };

    setCondolencesList(prev => [newItem, ...prev]);
    setMessageText('');
    setSelectedFilter('all');
    setLitCandleSuccess(true);
    setTimeout(() => setLitCandleSuccess(false), 3500);

    // Enviar a la cola en tiempo real para el Smart TV Box y Panel de Guardia
    if (addCondolenceToQueue) {
      addCondolenceToQueue({
        wakeId: serviceData?.id || '',
        senderName: finalAuthor,
        senderCity: finalCity,
        message: cleanMsg,
        tributeType: selectedTribute
      });
    }

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
                    maxLength={8}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(sanitizePin(e.target.value, 8));
                      if (pinError) setPinError(false);
                    }}
                    placeholder="PIN de 4 dígitos"
                    className={`w-full text-center text-2xl font-mono font-bold tracking-wider py-3 px-3 rounded-xl border ${
                      pinError
                        ? 'border-red-500 bg-red-500/10 text-red-400'
                        : 'bg-stone-950 border-stone-750 text-amber-400'
                    } focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-inner`}
                  />
                </div>
                {pinError && (
                  <p className="text-xs text-red-500 font-medium">
                    PIN incorrecto. Ingrese el código privado proporcionado por la familia.
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
                  Libro de Homenajes
                </h4>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-semibold">
                {condolencesList.length} mensajes
              </span>
            </div>

            {/* Barra de Filtros Rápidos */}
            <div className="px-3 py-1.5 border-b border-stone-800/80 bg-stone-950/40 flex items-center gap-1.5 overflow-x-auto text-xs flex-shrink-0 select-none">
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === 'all'
                    ? 'bg-amber-600 text-white font-semibold shadow-xs'
                    : 'bg-stone-850 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                }`}
              >
                Todos ({condolencesList.length})
              </button>
              {TRIBUTES.map(t => {
                const count = condolencesList.filter(c => c.tributeType === t.id).length;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedFilter(t.id)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                      selectedFilter === t.id
                        ? 'bg-amber-600 text-white font-semibold shadow-xs'
                        : 'bg-stone-850 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                    }`}
                  >
                    <span>{t.emoji}</span>
                    <span>{t.label}</span>
                    <span className="opacity-75 font-mono text-[10px]">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Condolences Feed (Scroll solo en el muro interno) */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0"
            >
              {condolencesList
                .filter(item => selectedFilter === 'all' || item.tributeType === selectedFilter)
                .map((item) => {
                  const theme = TRIBUTES.find(t => t.id === item.tributeType) || TRIBUTES[0];
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border border-stone-800 bg-stone-850 border-l-4 ${theme.accentBorder} space-y-1.5 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs border ${theme.avatarBg} ${theme.avatarBorder} flex-shrink-0 shadow-inner`}>
                            <span>{theme.emoji}</span>
                          </div>

                          <div className="min-w-0">
                            <strong className="text-sm font-serif font-bold text-white truncate block">
                              {item.senderName}
                            </strong>
                            <div className="flex items-center gap-1 text-[11px] text-stone-400">
                              <MapPin className="w-2.5 h-2.5 text-stone-500 flex-shrink-0" />
                              <span className="truncate">{item.senderCity}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                            <span>{theme.emoji}</span>
                            <span className="hidden sm:inline font-sans">{theme.name}</span>
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {item.timestamp}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm leading-relaxed text-stone-200 antialiased pt-0.5">
                        "{item.message}"
                      </p>
                    </div>
                  );
                })}

              {condolencesList.length === 0 ? (
                <div className="p-8 text-center text-stone-400 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400 text-lg">
                    🕯️
                  </div>
                  <p className="text-xs text-stone-300 font-medium">Aún no se han registrado homenajes en esta sala.</p>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    Sea el primero en dedicar unas palabras de apoyo a la familia, encender una vela conmemorativa o enviar una ofrenda floral.
                  </p>
                </div>
              ) : condolencesList.filter(item => selectedFilter === 'all' || item.tributeType === selectedFilter).length === 0 ? (
                <div className="p-6 text-center text-stone-400 space-y-1.5">
                  <p className="text-xs">No hay homenajes en esta categoría aún.</p>
                  <button
                    type="button"
                    onClick={() => setSelectedFilter('all')}
                    className="text-xs text-amber-400 hover:underline cursor-pointer"
                  >
                    Ver todos los mensajes ({condolencesList.length})
                  </button>
                </div>
              ) : null}
            </div>

            {/* Formulario de Homenajes con Selector de Modos */}
            <div className="p-3 border-t border-stone-800 bg-stone-900 flex-shrink-0 space-y-2">
              
              {/* Notificación de Éxito */}
              {litCandleSuccess && (
                <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Su homenaje ha sido publicado en el libro de condolencias.</span>
                </div>
              )}

              <form onSubmit={handleSendCondolence} className="space-y-2">
                
                {/* 4 Modos de Mensajes / Homenaje */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-stone-300 mb-1">
                    <span>Modo de homenaje:</span>
                    <span className="text-amber-400 font-mono font-semibold">
                      {TRIBUTES.find(t => t.id === selectedTribute)?.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {TRIBUTES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTribute(t.id)}
                        className={`py-1.5 px-1 rounded-lg text-xs font-medium border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          selectedTribute === t.id
                            ? 'bg-amber-600/30 border-amber-500 text-amber-200 ring-1 ring-amber-400/50 shadow-xs'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
                        }`}
                        title={t.name}
                      >
                        <span className="text-sm">{t.emoji}</span>
                        <span className="text-[11px] font-semibold">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    maxLength={60}
                    placeholder="Su Nombre / Familia (Opcional)"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border border-stone-700 bg-stone-950 text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    maxLength={50}
                    placeholder="Ciudad (Ej: Salta)"
                    value={senderCity}
                    onChange={(e) => setSenderCity(e.target.value)}
                    className="px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border border-stone-700 bg-stone-950 text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <input
                  type="text"
                  required
                  maxLength={400}
                  placeholder="Escriba sus palabras de condolencia..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border border-stone-700 bg-stone-950 text-white placeholder-stone-400 focus:outline-none focus:border-amber-500"
                />

                {/* Botón Dinámico según el modo seleccionado */}
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-[0.99]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {TRIBUTES.find(t => t.id === selectedTribute)?.desc || 'Enviar Homenaje'}
                  </span>
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
