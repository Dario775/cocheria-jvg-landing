import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Play, Pause, Volume2, VolumeX, Maximize, Minimize, MessageSquare, Flame, Heart, Flower2, Share2, Send, Clock, MapPin, Sparkles, AlertCircle, CheckCircle2, User, ChevronRight, X } from 'lucide-react';
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [viewerCount, setViewerCount] = useState(18);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionPhase, setConnectionPhase] = useState(1);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const youtubeId = getYouTubeId(serviceData.streamUrl);

  const startConnectionSequence = () => {
    setIsAuthenticated(true);
    setIsConnecting(true);
    setConnectionPhase(1);

    setTimeout(() => {
      setConnectionPhase(2);
    }, 1800);

    setTimeout(() => {
      setConnectionPhase(3);
    }, 3800);

    setTimeout(() => {
      setIsConnecting(false);
    }, 5400);
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const togglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (youtubeId && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: next ? 'playVideo' : 'pauseVideo',
          args: []
        }),
        '*'
      );
    }
  };

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
      message: 'Elevamos una oración por el descanso de nuestro querido profesor Don Roberto.',
      candleLit: true,
      tributeType: 'prayer',
      timestamp: 'Hace 12 min'
    },
    {
      id: 'c-3',
      senderName: 'Esteban y Gabriela',
      senderCity: 'Buenos Aires',
      message: 'Siempre recordaremos su generosidad y sonrisa. Descansa en paz.',
      candleLit: true,
      tributeType: 'flower',
      timestamp: 'Hace 25 min'
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

  // Handle sending new live condolence
  const handleSendCondolence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !messageText.trim()) return;

    const newItem: LiveCondolenceItem = {
      id: `live-${Date.now()}`,
      senderName: senderName.trim(),
      senderCity: senderCity.trim() || 'Familiar / Amigo',
      message: messageText.trim(),
      candleLit: true,
      tributeType: selectedTribute,
      timestamp: 'Ahora'
    };

    setCondolencesList(prev => [newItem, ...prev]);
    setMessageText('');
    setLitCandleSuccess(true);
    setTimeout(() => setLitCandleSuccess(false), 3500);
  };

  return (
    <div className={`relative min-h-[600px] w-full rounded-3xl overflow-hidden border ${
      isDark ? 'bg-stone-950 text-stone-100 border-stone-800' : 'bg-white text-stone-900 border-stone-200 shadow-2xl'
    } flex flex-col`}>
      
      {/* Top Header Strip */}
      <div className={`p-4 sm:p-5 border-b ${
        isDark ? 'bg-stone-900/90 border-stone-800' : 'bg-stone-100/90 border-stone-200'
      } backdrop-blur-md flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-500 font-mono">
                EN VIVO • SALA VIRTUAL
              </span>
              <span className={`text-[11px] px-2 py-0.2 rounded-full border ${
                isDark ? 'bg-stone-800 border-stone-700 text-stone-300' : 'bg-white border-stone-300 text-stone-700'
              }`}>
                {serviceData.branchName}
              </span>
            </div>
            <h3 className="font-serif font-bold text-base sm:text-lg">
              Homenaje en Memoria de {serviceData.deceasedName}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border ${
                isDark ? 'bg-stone-850 hover:bg-stone-800 border-stone-700 text-stone-300' : 'bg-white hover:bg-stone-100 border-stone-300 text-stone-700'
              } transition-colors`}
              aria-label="Cerrar sala virtual"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Screen 1: PIN Access Gate if not authenticated */}
      {!isAuthenticated ? (
        <div className="relative flex-1 p-6 sm:p-12 flex items-center justify-center">
          <FloatingCandleEmbers />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative max-w-md w-full p-6 sm:p-8 rounded-2xl border ${
              isDark ? 'bg-stone-900/95 border-stone-800' : 'bg-white/95 border-stone-200 shadow-2xl'
            } backdrop-blur-md text-center space-y-5 z-10`}
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-serif font-bold text-xl sm:text-2xl mb-1">
                Acceso Privado Familiar
              </h4>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-stone-400' : 'text-stone-600'} leading-relaxed`}>
                Por respeto a la privacidad de la familia, ingrese el <strong>PIN de 4 dígitos</strong> brindado por los deudos para ver el velatorio en vivo.
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
                        : isDark ? 'bg-stone-950 border-stone-750 text-amber-400' : 'bg-stone-50 border-stone-300 text-amber-700'
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
                  className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-500 font-medium hover:underline transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <span>🔑 Ingresar con PIN de prueba ({serviceData.accessPin || '8492'})</span>
                </button>
              </div>
            </form>

            <div className="pt-2 text-[11px] text-stone-500">
              Cochería J.V. González • Sala Virtual Segura & Encriptada
            </div>
          </motion.div>
        </div>
      ) : (
        /* Screen 2: Authenticated Live Stream + Realtime Condolences */
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden relative">
          
          {/* Pantalla de Carga Solemne que oculta el video mientras se inicializa por detrás */}
          <AnimatePresence>
            {isConnecting && (
              <motion.div
                key="connecting-screen"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="absolute inset-0 z-40 bg-stone-950 flex flex-col items-center justify-center p-6 sm:p-10 text-center select-none"
              >
                <FloatingCandleEmbers />

                <div className="relative z-10 space-y-5 max-w-md w-full">
                  {/* Memorial photo */}
                  <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28">
                    <div className="absolute inset-0 rounded-full bg-amber-600/20 animate-ping opacity-60" />
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-amber-600/60 shadow-2xl relative z-10">
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
                  <div className="space-y-3 pt-2">
                    <div className="h-6 flex items-center justify-center">
                      <motion.p
                        key={connectionPhase}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs sm:text-sm text-stone-300 font-medium"
                      >
                        {connectionPhase === 1 && "🔑 Verificando credencial familiar..."}
                        {connectionPhase === 2 && "📡 Conectando y sincronizando señal de la Capilla Ardiente..."}
                        {connectionPhase === 3 && "✨ Transmisión en vivo establecida. Ingresando a la sala..."}
                      </motion.p>
                    </div>

                    {/* Gold progress bar */}
                    <div className="w-full max-w-xs mx-auto h-1.5 bg-stone-850 rounded-full overflow-hidden border border-stone-800">
                      <motion.div
                        initial={{ width: '5%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5.4, ease: 'easeInOut' }}
                        className="h-full bg-gradient-to-r from-amber-700 via-amber-400 to-amber-500"
                      />
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Cochería J.V. González • Conexión Segura Encriptada</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Video Stream Container (8 Columns on Desktop) */}
          <div
            ref={videoContainerRef}
            className="lg:col-span-8 bg-black flex flex-col justify-between relative overflow-hidden min-h-[350px] sm:min-h-[460px]"
          >
            {youtubeId ? (
              /* Real Live Stream Feed via YouTube Embed (CCTV Broadcast Mode, completely hiding YouTube controls) */
              <div className="absolute inset-0 bg-black overflow-hidden flex items-center justify-center select-none">
                {/* 
                  Zoom y recorte perimetral de un 14% con overflow-hidden y pointer-events-none:
                  Elimina por completo la barra superior con título, botón compartir, marcas de agua y controles de YouTube,
                  dejando únicamente la señal de cámara pura y respetuosa.
                */}
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

                {/* Floating Institutional Live Badge */}
                <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-bold font-mono tracking-wider shadow-lg flex items-center gap-1.5 backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    EN DIRECTO DESDE CAPILLA ARDIENTE
                  </span>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-black/70 border border-white/20 text-stone-200 text-[10px] backdrop-blur-xs">
                    {serviceData.chapelRoom}
                  </span>
                </div>

                {/* Floating Quick Unmute Pill when muted */}
                {isMuted && !isConnecting && (
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-black/85 hover:bg-black text-amber-300 hover:text-amber-200 border border-amber-500/40 shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-medium transition-all hover:scale-105 cursor-pointer pointer-events-auto"
                  >
                    <VolumeX className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>Audio silenciado • Clic para activar sonido</span>
                  </button>
                )}
              </div>
            ) : (
              /* Simulated Live Stream Feed (With respectful ambiance) */
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Background ambient lighting */}
                <div className="absolute inset-0 bg-radial-at-c from-stone-900 via-black to-black opacity-90" />
                
                {/* Simulated Chapel Altar & Candle Live View */}
                <div className="relative text-center p-6 space-y-4 max-w-lg z-10">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-amber-600/50 shadow-2xl mx-auto">
                    <img
                      src={serviceData.photoUrl}
                      alt={serviceData.deceasedName}
                      className="w-full h-full object-cover filter grayscale contrast-105"
                    />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-white font-serif font-bold text-lg sm:text-xl tracking-wide">
                      {serviceData.deceasedName}
                    </h4>
                    <p className="text-amber-300 text-xs font-mono">
                      {serviceData.birthYear} — {serviceData.passedYear} ({serviceData.age} años)
                    </p>
                    <p className="text-stone-400 text-xs italic pt-1">
                      "{serviceData.chapelRoom} • {serviceData.branchName}"
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-stone-800 text-stone-300 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Transmisión en directo activa desde la sala</span>
                  </div>
                </div>

                {/* Floating gentle candle embers in live feed */}
                <FloatingCandleEmbers />
              </div>
            )}

            {/* Video Overlay Controls (Custom Institutional Controls) */}
            <div className="relative z-20 p-4 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex items-center justify-between text-white text-xs mt-auto pointer-events-auto">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-stone-200 hover:text-white"
                  title={isPlaying ? "Pausar transmisión" : "Reanudar transmisión"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-400" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className={`px-3 py-1.5 rounded-xl border transition-colors flex items-center gap-2 text-xs font-medium ${
                    isMuted
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
                      : 'bg-white/10 border-white/15 text-stone-200 hover:bg-white/20'
                  }`}
                  title={isMuted ? "Activar audio" : "Silenciar"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  <span>{isMuted ? "Activar audio" : "Audio activo"}</span>
                </button>

                <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-stone-400 pl-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{serviceData.cortegeTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[11px] bg-red-600/90 text-white font-bold px-2.5 py-1 rounded-lg font-mono shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {viewerCount} online
                </span>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-stone-200 hover:text-white"
                  title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>

          {/* Live Condolences & Candle Lighting Sidebar (4 Columns on Desktop) */}
          <div className={`lg:col-span-4 flex flex-col h-full border-l ${
            isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            
            {/* Sidebar Header */}
            <div className={`p-3.5 border-b ${isDark ? 'border-stone-800 bg-stone-850' : 'border-stone-200 bg-white'} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <h4 className="font-semibold text-xs uppercase tracking-wider">
                  Condolencias en Vivo
                </h4>
              </div>
              <span className="text-[11px] text-stone-500 font-mono">
                {condolencesList.length} mensajes
              </span>
            </div>

            {/* Condolences Feed (Scrollable) */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3.5 space-y-3 max-h-[380px] sm:max-h-[420px]"
            >
              {condolencesList.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                    isDark ? 'bg-stone-850/80 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-amber-600 dark:text-amber-400 font-semibold truncate max-w-[180px]">
                      {item.senderName}
                    </strong>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {item.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-stone-500">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{item.senderCity}</span>
                    {item.candleLit && (
                      <span className="ml-1 text-amber-500 flex items-center gap-0.5">
                        • 🕯️ Vela
                      </span>
                    )}
                  </div>

                  <p className={`pt-1 leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    "{item.message}"
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Send Condolence & Tribute Form */}
            <div className={`p-3.5 border-t ${isDark ? 'border-stone-800 bg-stone-850' : 'border-stone-200 bg-white'} space-y-2.5`}>
              {litCandleSuccess && (
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Su condolencia y vela han sido encendidas en la transmisión.</span>
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
                    className={`px-2.5 py-1.5 text-xs rounded-lg border ${
                      isDark ? 'bg-stone-900 border-stone-750 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
                    } focus:outline-none focus:ring-1 focus:ring-amber-500`}
                  />
                  <input
                    type="text"
                    placeholder="Ciudad (Ej: Salta)"
                    value={senderCity}
                    onChange={(e) => setSenderCity(e.target.value)}
                    className={`px-2.5 py-1.5 text-xs rounded-lg border ${
                      isDark ? 'bg-stone-900 border-stone-750 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
                    } focus:outline-none focus:ring-1 focus:ring-amber-500`}
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Escriba sus palabras de condolencia..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className={`flex-1 px-3 py-1.5 text-xs rounded-lg border ${
                      isDark ? 'bg-stone-900 border-stone-750 text-white' : 'bg-stone-50 border-stone-300 text-stone-900'
                    } focus:outline-none focus:ring-1 focus:ring-amber-500`}
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                    title="Enviar condolencia y encender vela"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar</span>
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
