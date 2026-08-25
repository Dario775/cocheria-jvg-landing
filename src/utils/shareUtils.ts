import { Obituary } from '../types';

export interface ShareResult {
  method: 'web-share' | 'clipboard' | 'whatsapp';
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Shares an obituary using the Web Share API (navigator.share) with intelligent fallbacks
 * to Clipboard or WhatsApp for desktop / unsupported browsers.
 */
export async function shareObituary(obit: Obituary): Promise<ShareResult> {
  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
  const shareUrl = `${baseUrl}#obituario`;
  const shareTitle = `Memorial de ${obit.fullName} • Cochería J.V. González`;

  let shareText = `🕊️ En memoria de ${obit.fullName} (${obit.passedDate}, ${obit.age} años).\n`;
  if (obit.epitaph) {
    shareText += `"${obit.epitaph}"\n`;
  }
  if (obit.status === 'en_velacion') {
    shareText += `🕯️ Sala de Velación: ${obit.funeralService.chapelRoom} (${obit.funeralService.wakeHours})\n`;
    if (obit.funeralService.processionTime) {
      shareText += `⛪ Sepelio / Cortejo: ${obit.funeralService.processionTime} hacia ${obit.funeralService.cemeteryOrCrematory}\n`;
    }
  } else if (obit.funeralService.cemeteryOrCrematory) {
    shareText += `Lugar de descanso: ${obit.funeralService.cemeteryOrCrematory}\n`;
  }
  shareText += `Envíe sus condolencias o encienda una vela conmemorativa aquí:`;

  // 1. Try Native Web Share API first
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      });
      return { 
        method: 'web-share', 
        success: true, 
        message: 'Homenaje compartido con éxito.' 
      };
    } catch (err: unknown) {
      const error = err as Error;
      // User cancelled share dialog
      if (error.name === 'AbortError') {
        return { 
          method: 'web-share', 
          success: false, 
          error: 'cancelled' 
        };
      }
      // If another error occurred, proceed to clipboard fallback
      console.warn('Web Share API failed, falling back to clipboard:', error);
    }
  }

  // 2. Fallback: Copy full tribute and link to clipboard
  const fullTextToCopy = `${shareTitle}\n\n${shareText}\n${shareUrl}`;
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(fullTextToCopy);
      return { 
        method: 'clipboard', 
        success: true, 
        message: '¡Enlace y datos del homenaje copiados al portapapeles!' 
      };
    } catch (clipErr) {
      console.warn('Clipboard write failed, falling back to WhatsApp:', clipErr);
    }
  }

  // 3. Fallback 2: WhatsApp Web / Deep link
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullTextToCopy)}`;
  window.open(whatsappUrl, '_blank');
  return { 
    method: 'whatsapp', 
    success: true, 
    message: 'Abriendo WhatsApp para compartir...' 
  };
}
