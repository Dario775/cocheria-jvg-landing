import React, { useState } from 'react';
import { Obituary, CondolenceMessage, MemorialTribute } from '../types';
import { X, Flame, Heart, Flower2, Share2, MapPin, Clock, Calendar, MessageSquareHeart, Check, Copy, Send, Sparkles, User, ShieldAlert, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ShareObituaryButton } from './ShareObituaryButton';
import { shareObituary } from '../utils/shareUtils';
import { sanitizeText } from '../utils/security';

interface ObituaryDetailModalProps {
  obituary: Obituary;
  onClose: () => void;
  onLightCandle: (obituaryId: string, authorName?: string) => void;
  onAddCondolence: (obituaryId: string, condolence: Omit<CondolenceMessage, 'id' | 'timestamp'>) => void;
  onAddTribute: (obituaryId: string, tribute: Omit<MemorialTribute, 'id' | 'timestamp'>) => void;
}

export const ObituaryDetailModal: React.FC<ObituaryDetailModalProps> = ({
  obituary,
  onClose,
  onLightCandle,
  onAddCondolence,
  onAddTribute
}) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'homenaje' | 'condolencias' | 'servicios'>('homenaje');
  const [authorName, setAuthorName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [condolenceText, setCondolenceText] = useState('');
  const [litCandleWithCondolence, setLitCandleWithCondolence] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [candleJustLit, setCandleJustLit] = useState(false);
  const [selectedPresetMessage, setSelectedPresetMessage] = useState('');
  const [tributeSuccessMessage, setTributeSuccessMessage] = useState<string | null>(null);

  // Lock scroll and handle Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalStyle;
    };
  }, [onClose]);

  const presetMessages = [
    'Acompañamos a la familia en este doloroso momento y elevamos una oración por su eterno descanso.',
    'Que la paz y el consuelo de Dios abracen sus corazones ante tan irreparable pérdida.',
    'Siempre recordaremos su bondad, generosidad y alegría. Un fuerte abrazo a toda la familia.',
    'Descansa en los brazos del Señor. Que brille para ti la luz que no tiene fin.'
  ];

  const handleApplyPreset = (msg: string) => {
    setSelectedPresetMessage(msg);
    setCondolenceText(msg);
  };

  const handleCandleClick = () => {
    onLightCandle(obituary.id, authorName || 'Un allegado');
    setCandleJustLit(true);
    setTributeSuccessMessage('Ha encendido una vela en homenaje.');
    setTimeout(() => {
      setCandleJustLit(false);
      setTributeSuccessMessage(null);
    }, 4000);
  };

  const handleTributeClick = (type: 'flower' | 'prayer' | 'heart', typeLabel: string) => {
    onAddTribute(obituary.id, {
      type,
      author: authorName || 'Familiar o amigo'
    });
    setTributeSuccessMessage(`Ha enviado un homenaje de ${typeLabel} en memoria de ${obituary.fullName}.`);
    setTimeout(() => {
      setTributeSuccessMessage(null);
    }, 4000);
  };

  const handleSubmitCondolence = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMsg = sanitizeText(condolenceText, 400);
    if (!cleanMsg) return;

    const finalAuthor = sanitizeText(authorName, 60) || 'Un allegado';
    const finalRel = sanitizeText(relationship, 50) || 'Allegado a la familia';

    onAddCondolence(obituary.id, {
      author: finalAuthor,
      relationship: finalRel,
      message: cleanMsg,
      candleLit: litCandleWithCondolence
    });

    setCondolenceText('');
    setAuthorName('');
    setRelationship('');
    setSelectedPresetMessage('');
    setTributeSuccessMessage('Su mensaje de condolencia ha sido publicado en el memorial.');
    setTimeout(() => {
      setTributeSuccessMessage(null);
    }, 4000);
  };

  const handleShareWhatsApp = () => {
    const text = `Memorial y Homenaje en recuerdo de ${obituary.fullName} en Cochería J.V. González.\n${obituary.epitaph ? `"${obituary.epitaph}"\n` : ''}Sala: ${obituary.funeralService.chapelRoom}.\nVer detalles y condolencias: ${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const isEnVelacion = obituary.status === 'en_velacion';

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
    >
      <div className={`relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] flex flex-col ${
        isDark ? 'bg-stone-900 border-stone-750 text-stone-100' : 'bg-white border-stone-200 text-stone-900 shadow-2xl'
      } border rounded-2xl shadow-2xl overflow-hidden`}>
        
        {/* Sticky Modal Header - Always Visible */}
        <div className={`sticky top-0 z-20 flex-shrink-0 ${
          isDark ? 'bg-stone-900/95 border-stone-800' : 'bg-white/95 border-stone-200'
        } backdrop-blur-md border-b p-3.5 sm:p-4 px-4 sm:px-6 flex items-center justify-between shadow-xs`}>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isEnVelacion
                ? isDark ? 'bg-amber-900/80 text-amber-300 border border-amber-600/50 animate-pulse' : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                : isDark ? 'bg-stone-800 text-stone-300 border border-stone-700' : 'bg-stone-100 text-stone-700 border border-stone-200'
            }`}>
              {isEnVelacion ? '• En Sala de Velación' : 'Descanso Eterno'}
            </span>
            <span className={`hidden sm:inline text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Memorial Cochería J.V. González</span>
          </div>

          <button
            onClick={onClose}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold ${
              isDark 
                ? 'bg-stone-800 text-stone-200 hover:bg-stone-700 border-stone-700 hover:text-white' 
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-300 hover:text-stone-900'
            } transition-all shadow-xs`}
            aria-label="Cerrar memorial"
          >
            <span>Cerrar</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className={`overflow-y-auto flex-1 p-4 sm:p-6 lg:p-8 ${isDark ? 'bg-stone-900' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            
            {/* Photo with dignified memorial frame */}
            <div className="relative flex-shrink-0 text-center">
              <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 ${
                isDark ? 'border-amber-700/60 bg-stone-800' : 'border-amber-600/40 bg-stone-100'
              } shadow-xl mx-auto p-1`}>
                <img
                  src={obituary.photoUrl}
                  alt={obituary.fullName}
                  className="w-full h-full object-cover rounded-full filter grayscale contrast-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Candles summary badge */}
              <div className={`mt-3 inline-flex items-center gap-1.5 ${
                isDark ? 'bg-amber-950/80 border-amber-700/40 text-amber-200' : 'bg-amber-100 border-amber-300 text-amber-900'
              } border px-3 py-1 rounded-full text-xs font-medium`}>
                <Flame className="w-4 h-4 text-amber-600 candle-flame" />
                <span>{obituary.candlesCount} Velas encendidas</span>
              </div>
            </div>

            {/* Memorial Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h2 className={`text-2xl sm:text-3xl font-bold font-serif ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
                {obituary.fullName}
              </h2>

              <p className={`text-xs sm:text-sm font-mono ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                {obituary.birthDate} — {obituary.passedDate} ({obituary.age} años)
              </p>

              {obituary.epitaph && (
                <blockquote className={`italic ${
                  isDark ? 'text-amber-200/90 border-amber-600/40' : 'text-amber-900 border-amber-500'
                } text-sm sm:text-base border-l-2 pl-3 py-1 my-2 font-serif`}>
                  "{obituary.epitaph}"
                </blockquote>
              )}

              <p className={`text-xs sm:text-sm ${isDark ? 'text-stone-300' : 'text-stone-700'} leading-relaxed pt-1`}>
                {obituary.biography}
              </p>

              {/* Family members tag */}
              <div className="pt-2">
                <span className={`text-xs font-semibold block mb-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Acompañan en el dolor:</span>
                <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                  {obituary.familyMembers.map((member, i) => (
                    <span key={i} className={`text-xs ${
                      isDark ? 'bg-stone-800 text-stone-300 border-stone-750' : 'bg-stone-100 text-stone-800 border-stone-200'
                    } px-2.5 py-0.5 rounded-md border`}>
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Banner Capilla Ardiente Virtual cuando está en velación activa */}
          {isEnVelacion && (
            <div className={`mt-5 p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-left ${
              isDark 
                ? 'bg-amber-950/30 border-amber-800/50 text-amber-200' 
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping flex-shrink-0" />
                <div className="text-xs">
                  <strong className="block font-semibold">Capilla Ardiente Virtual & Homenajes en Vivo</strong>
                  <span className={isDark ? 'text-stone-400' : 'text-stone-600'}>
                    Acompañe a la familia a la distancia, vea la transmisión o encienda una vela en sala.
                  </span>
                </div>
              </div>

              <a
                href={`/velatorio/${obituary.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs tracking-wide transition-all shadow-md flex-shrink-0"
              >
                <span>Ingresar a Capilla Virtual</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Quick Tribute Action Bar */}
          <div className={`mt-6 pt-5 border-t ${
            isDark ? 'border-stone-800 bg-stone-850/60' : 'border-stone-200 bg-stone-50'
          } flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl`}>
            <div className="flex flex-wrap items-center gap-2">
              {/* Light a Candle Button */}
              <button
                onClick={handleCandleClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-md ${
                  candleJustLit
                    ? 'bg-amber-500 text-stone-950 scale-105'
                    : 'bg-amber-700 hover:bg-amber-600 text-stone-50 border border-amber-500/50'
                }`}
              >
                <Flame className={`w-4 h-4 ${candleJustLit ? 'text-stone-950' : 'text-amber-200'} candle-flame`} />
                <span>Encender una Vela</span>
              </button>

              {/* Send Virtual Flowers */}
              <button
                onClick={() => handleTributeClick('flower', 'Flores Blancas')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium ${
                  isDark ? 'bg-stone-800 hover:bg-stone-750 text-stone-200 border-stone-700' : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300 shadow-xs'
                } border transition-colors`}
                title="Ofrendar flor blanca"
              >
                <Flower2 className="w-4 h-4 text-emerald-600" />
                <span>Ofrenda Floral</span>
              </button>

              {/* Send Prayer */}
              <button
                onClick={() => handleTributeClick('prayer', 'Oración de Fe')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium ${
                  isDark ? 'bg-stone-800 hover:bg-stone-750 text-stone-200 border-stone-700' : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300 shadow-xs'
                } border transition-colors`}
                title="Elevar una oración"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Elevar Oración</span>
              </button>
            </div>

            {/* Social Share Group */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'} hidden sm:inline`}>Compartir:</span>
              <ShareObituaryButton obituary={obituary} variant="pill" />
              <button
                onClick={handleShareWhatsApp}
                className="p-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                title="Compartir por WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="text-xs">WhatsApp</span>
              </button>
              <button
                onClick={handleShareFacebook}
                className="p-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs transition-colors shadow-xs"
                title="Compartir en Facebook"
              >
                Facebook
              </button>
              <button
                onClick={handleCopyLink}
                className={`p-2 rounded-lg ${
                  isDark ? 'bg-stone-800 hover:bg-stone-700 text-stone-300' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
                } text-xs flex items-center gap-1 transition-colors`}
                title="Copiar enlace"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Success Feedback Alert */}
          {tributeSuccessMessage && (
            <div className={`mt-3 p-3 ${
              isDark ? 'bg-emerald-950/80 border-emerald-700/60 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            } border text-xs rounded-xl flex items-center gap-2 animate-in fade-in`}>
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{tributeSuccessMessage}</span>
            </div>
          )}

          {/* Content Navigation Tabs */}
          <div className={`mt-6 border-b ${isDark ? 'border-stone-800' : 'border-stone-200'} flex gap-4 text-sm font-medium`}>
            <button
              onClick={() => setActiveTab('homenaje')}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === 'homenaje'
                  ? isDark ? 'border-amber-500 text-amber-200 font-semibold' : 'border-amber-700 text-amber-900 font-semibold'
                  : isDark ? 'border-transparent text-stone-400 hover:text-stone-200' : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              Servicio & Sepelio
            </button>
            <button
              onClick={() => setActiveTab('condolencias')}
              className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'condolencias'
                  ? isDark ? 'border-amber-500 text-amber-200 font-semibold' : 'border-amber-700 text-amber-900 font-semibold'
                  : isDark ? 'border-transparent text-stone-400 hover:text-stone-200' : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <span>Libro de Condolencias</span>
              <span className={`${
                isDark ? 'bg-stone-800 text-amber-300' : 'bg-stone-100 text-amber-900 border border-stone-200'
              } text-xs px-2 py-0.2 rounded-full font-bold`}>
                {obituary.condolences.length}
              </span>
            </button>
          </div>

          {/* Tab 1: Funeral & Wake Details */}
          {activeTab === 'homenaje' && (
            <div className="mt-6 space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Chapel Wake Info */}
                <div className={`${
                  isDark ? 'bg-stone-850 border-stone-800' : 'bg-stone-50 border-stone-200'
                } p-4 rounded-xl border space-y-2`}>
                  <div className={`flex items-center gap-2 ${isDark ? 'text-amber-400' : 'text-amber-800'} text-sm font-semibold`}>
                    <MapPin className="w-4 h-4" />
                    <span>Capilla Ardiente & Velatorio</span>
                  </div>
                  <p className={`text-sm font-bold ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>{obituary.funeralService.chapelRoom}</p>
                  <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>{obituary.funeralService.locationAddress}</p>
                  <div className={`pt-1 flex items-center gap-1.5 text-xs ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{obituary.funeralService.wakeHours}</span>
                  </div>
                </div>

                {/* Religious Mass & Procession Info */}
                <div className={`${
                  isDark ? 'bg-stone-850 border-stone-800' : 'bg-stone-50 border-stone-200'
                } p-4 rounded-xl border space-y-2`}>
                  <div className={`flex items-center gap-2 ${isDark ? 'text-amber-400' : 'text-amber-800'} text-sm font-semibold`}>
                    <Calendar className="w-4 h-4" />
                    <span>Misa & Salida del Cortejo</span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-stone-300' : 'text-stone-700'} leading-snug`}>{obituary.funeralService.massDetails}</p>
                  <div className={`pt-1 text-xs ${isDark ? 'text-amber-200' : 'text-amber-900'} font-semibold`}>
                    {obituary.funeralService.processionTime}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'} pt-0.5`}>
                    Destino: <span className={`${isDark ? 'text-stone-200' : 'text-stone-900'} font-semibold`}>{obituary.funeralService.cemeteryOrCrematory}</span>
                  </div>
                </div>

              </div>

              {/* Tributes summary wall */}
              {obituary.tributes.length > 0 && (
                <div className={`${
                  isDark ? 'bg-stone-850/40 border-stone-800' : 'bg-stone-50 border-stone-200'
                } p-3.5 rounded-xl border`}>
                  <span className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'} font-semibold uppercase tracking-wider block mb-2`}>
                    Últimos Homenajes Simbólicos
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {obituary.tributes.map((t) => (
                      <div key={t.id} className={`flex items-center gap-1.5 ${
                        isDark ? 'bg-stone-800 text-stone-300 border-stone-750' : 'bg-white text-stone-800 border-stone-200 shadow-xs'
                      } text-xs px-2.5 py-1 rounded-lg border`}>
                        {t.type === 'candle' && <Flame className="w-3.5 h-3.5 text-amber-600" />}
                        {t.type === 'flower' && <Flower2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {t.type === 'prayer' && <Sparkles className="w-3.5 h-3.5 text-amber-600" />}
                        {t.type === 'heart' && <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/30" />}
                        <span>{t.author}</span>
                        <span className={`text-[10px] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>• {t.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Condolences Book & Submission Form */}
          {activeTab === 'condolencias' && (
            <div className="mt-6 space-y-6 animate-in fade-in duration-150">
              
              {/* Submission Form */}
              <form onSubmit={handleSubmitCondolence} className={`${
                isDark ? 'bg-stone-850 border-stone-750' : 'bg-stone-50 border-stone-200'
              } p-4 sm:p-5 rounded-xl border space-y-3.5`}>
                <div className={`flex items-center gap-2 ${isDark ? 'text-amber-300 border-stone-750' : 'text-amber-900 border-stone-200'} text-sm font-semibold border-b pb-2`}>
                  <MessageSquareHeart className="w-4 h-4 text-amber-600" />
                  <span>Enviar Palabras de Condolencia a la Familia</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'} mb-1`}>Su Nombre y Apellido (Opcional)</label>
                    <input
                      type="text"
                      maxLength={60}
                      placeholder="Ej. Familia Rodríguez o María Giménez"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className={`w-full ${
                        isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-stone-300 text-stone-900'
                      } border rounded-lg px-3 py-2 text-xs focus:border-amber-600 focus:outline-none`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'} mb-1`}>Vínculo o Parentesco</label>
                    <input
                      type="text"
                      maxLength={50}
                      placeholder="Ej. Amigos de la infancia / Vecinos / Compañeros"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className={`w-full ${
                        isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-stone-300 text-stone-900'
                      } border rounded-lg px-3 py-2 text-xs focus:border-amber-600 focus:outline-none`}
                    />
                  </div>
                </div>

                {/* Preset Suggestions for Quick Respectful Notes */}
                <div>
                  <label className={`block text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-600'} mb-1`}>Mensajes sugeridos de respeto:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {presetMessages.map((msg, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleApplyPreset(msg)}
                        className={`text-left text-[11px] p-2 rounded-lg border transition-colors ${
                          selectedPresetMessage === msg
                            ? isDark ? 'bg-amber-950/60 border-amber-600/70 text-amber-200' : 'bg-amber-100 border-amber-400 text-amber-900'
                            : isDark ? 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200' : 'bg-white border-stone-250 text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        "{msg.slice(0, 65)}..."
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'} mb-1`}>Su Mensaje Personal *</label>
                  <textarea
                    required
                    maxLength={400}
                    rows={3}
                    placeholder="Escriba aquí sus palabras de consuelo, recuerdo o afecto..."
                    value={condolenceText}
                    onChange={(e) => setCondolenceText(e.target.value)}
                    className={`w-full ${
                      isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-stone-300 text-stone-900'
                    } border rounded-lg p-3 text-xs sm:text-sm focus:border-amber-600 focus:outline-none leading-relaxed`}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <label className={`flex items-center gap-2 text-xs ${isDark ? 'text-stone-300' : 'text-stone-700'} cursor-pointer select-none`}>
                    <input
                      type="checkbox"
                      checked={litCandleWithCondolence}
                      onChange={(e) => setLitCandleWithCondolence(e.target.checked)}
                      className="rounded bg-stone-900 border-stone-700 text-amber-600 focus:ring-0"
                    />
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      Encender una vela con este mensaje
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar Condolencia</span>
                  </button>
                </div>
              </form>

              {/* Published Condolences List */}
              <div className="space-y-3">
                <h3 className={`text-xs uppercase tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-600'} font-semibold`}>
                  Mensajes de Acompañamiento ({obituary.condolences.length})
                </h3>

                {obituary.condolences.length === 0 ? (
                  <p className={`text-xs ${isDark ? 'text-stone-500 bg-stone-850/40' : 'text-stone-500 bg-stone-50'} text-center py-6 rounded-xl`}>
                    Aún no hay mensajes publicados. Sea el primero en dejar sus palabras de aliento a la familia.
                  </p>
                ) : (
                  obituary.condolences.map((c) => (
                    <div key={c.id} className={`${
                      isDark ? 'bg-stone-850 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
                    } p-4 rounded-xl border space-y-1.5`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full ${
                            isDark ? 'bg-stone-800 text-amber-400' : 'bg-amber-100 text-amber-900'
                          } flex items-center justify-center font-bold text-xs`}>
                            {c.author.charAt(0)}
                          </div>
                          <div>
                            <span className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>{c.author}</span>
                            {c.relationship && (
                              <span className={`text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-500'} ml-2`}>({c.relationship})</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {c.candleLit && (
                            <span className={`inline-flex items-center gap-1 text-[10px] ${
                              isDark ? 'bg-amber-950 text-amber-300 border-amber-800/50' : 'bg-amber-100 text-amber-900 border-amber-300'
                            } px-2 py-0.5 rounded-full border`}>
                              <Flame className="w-2.5 h-2.5 text-amber-600" />
                              Vela
                            </span>
                          )}
                          <span className={`text-[10px] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>{c.timestamp}</span>
                        </div>
                      </div>
                      <p className={`text-xs sm:text-sm ${isDark ? 'text-stone-300' : 'text-stone-700'} pl-9 italic leading-relaxed`}>
                        "{c.message}"
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>

        {/* Sticky Modal Footer */}
        <div className={`sticky bottom-0 z-20 flex-shrink-0 ${
          isDark ? 'bg-stone-900/95 border-stone-800' : 'bg-white/95 border-stone-200'
        } backdrop-blur-md border-t p-3 sm:p-4 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-lg`}>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 hidden sm:inline" />
            <span className="text-[11px] sm:text-xs">Cochería J.V. González • Memorial Digital</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartir</span>
            </button>

            <button
              onClick={onClose}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isDark 
                  ? 'bg-stone-800 hover:bg-stone-750 text-stone-200 border-stone-700 hover:text-white' 
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
              }`}
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
