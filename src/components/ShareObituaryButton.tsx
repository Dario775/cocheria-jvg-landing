import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { Obituary } from '../types';
import { shareObituary, ShareResult } from '../utils/shareUtils';
import { useTheme } from '../context/ThemeContext';

interface ShareObituaryButtonProps {
  obituary: Obituary;
  variant?: 'card' | 'modal' | 'icon-only' | 'pill';
  className?: string;
  onShared?: (result: ShareResult) => void;
}

export const ShareObituaryButton: React.FC<ShareObituaryButtonProps> = ({
  obituary,
  variant = 'card',
  className = '',
  onShared
}) => {
  const { isDark } = useTheme();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent card click
    if (isSharing) return;

    setIsSharing(true);
    try {
      const result = await shareObituary(obituary);
      if (onShared) onShared(result);

      if (result.success) {
        if (result.method === 'clipboard') {
          setFeedback('¡Copiado!');
        } else if (result.method === 'web-share') {
          setFeedback('¡Compartido!');
        } else if (result.method === 'whatsapp') {
          setFeedback('Abriendo...');
        }
        setTimeout(() => setFeedback(null), 2500);
      }
    } catch (err) {
      console.error('Error sharing obituary:', err);
    } finally {
      setIsSharing(false);
    }
  };

  if (variant === 'icon-only') {
    return (
      <button
        type="button"
        onClick={handleShare}
        title="Compartir homenaje en redes o mensajería"
        aria-label={`Compartir homenaje de ${obituary.fullName}`}
        className={`relative p-2 rounded-xl border transition-all duration-200 ${
          feedback
            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400'
            : isDark
              ? 'bg-stone-800/80 hover:bg-stone-750 text-stone-300 hover:text-amber-300 border-stone-700'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-amber-900 border-stone-200'
        } ${className}`}
      >
        {feedback ? (
          <Check className="w-3.5 h-3.5 text-emerald-500 animate-scale-in" />
        ) : (
          <Share2 className="w-3.5 h-3.5" />
        )}

        {feedback && (
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-stone-900 text-stone-100 text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30">
            {feedback}
          </span>
        )}
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleShare}
        title="Compartir homenaje"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
          feedback
            ? 'bg-emerald-600 text-white border-emerald-500'
            : isDark
              ? 'bg-stone-800 hover:bg-stone-750 text-stone-200 hover:text-amber-300 border-stone-700'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-800 hover:text-amber-900 border-stone-300'
        } ${className}`}
      >
        {feedback ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>{feedback}</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Compartir</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'modal') {
    return (
      <button
        type="button"
        onClick={handleShare}
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border transition-all shadow-xs ${
          feedback
            ? 'bg-emerald-600 text-white border-emerald-500'
            : isDark
              ? 'bg-stone-800 hover:bg-stone-750 text-stone-100 border-stone-700'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
        } ${className}`}
      >
        {feedback ? (
          <>
            <Check className="w-4 h-4" />
            <span>{feedback === '¡Copiado!' ? 'Enlace Copiado al Portapapeles' : feedback}</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 text-amber-600" />
            <span>Compartir Homenaje</span>
          </>
        )}
      </button>
    );
  }

  // Default 'card' variant
  return (
    <button
      type="button"
      onClick={handleShare}
      title="Compartir homenaje por WhatsApp, redes o copiar enlace"
      aria-label={`Compartir homenaje de ${obituary.fullName}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
        feedback
          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/50 scale-105'
          : isDark
            ? 'bg-stone-800/80 hover:bg-stone-750 text-stone-300 hover:text-amber-300 border-stone-700/80 hover:border-stone-600 shadow-xs'
            : 'bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border-stone-200/90 hover:border-stone-300 shadow-xs'
      } ${className}`}
    >
      {feedback ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-500 animate-in fade-in" />
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">{feedback}</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500 transition-transform group-hover:scale-110" />
          <span className="text-[11px]">Compartir</span>
        </>
      )}
    </button>
  );
};
