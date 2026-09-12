/**
 * Utilidades de seguridad, sanitización y validación de campos
 * Cochería J.V. González
 */

/**
 * Elimina caracteres de control peligrosos y etiquetas HTML para prevenir inyecciones XSS y desbordamientos.
 */
export function sanitizeText(input: unknown, maxLength = 255): string {
  if (typeof input !== 'string') return '';
  
  // 1. Eliminar caracteres de control invisibles (excepto saltos de línea y tabulación)
  let clean = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // 2. Eliminar cualquier etiqueta HTML (<script>, <img>, etc.)
  clean = clean.replace(/<[^>]*>?/gm, '');

  // 3. Normalizar espacios excesivos
  clean = clean.replace(/[ \t]+/g, ' ').trim();

  // 4. Truncar longitud máxima segura
  return clean.slice(0, maxLength);
}

/**
 * Filtra caracteres para admitir solo dígitos numéricos (ej. años, cantidades)
 */
export function sanitizeDigits(input: unknown, maxLength = 10): string {
  if (typeof input !== 'string' && typeof input !== 'number') return '';
  return String(input).replace(/\D/g, '').slice(0, maxLength);
}

/**
 * Filtra caracteres para PINs de acceso (alfanumérico limpio sin espacios ni símbolos)
 */
export function sanitizePin(input: unknown, maxLength = 8): string {
  if (typeof input !== 'string' && typeof input !== 'number') return '';
  return String(input).replace(/[^0-9a-zA-Z]/g, '').slice(0, maxLength);
}

/**
 * Valida que una URL use exclusivamente protocolos seguros (http o https)
 */
export function isValidWebUrl(urlStr?: string): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const trimmed = urlStr.trim();
  if (!trimmed) return false;
  
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Sanitiza una URL asegurando protocolo seguro http/https (devuelve '' si no es segura)
 */
export function sanitizeUrl(urlStr?: string, maxLength = 500): string {
  if (!urlStr || typeof urlStr !== 'string') return '';
  const trimmed = urlStr.trim();
  if (!trimmed) return '';

  if (trimmed.length > maxLength) return '';
  
  // Prevenir inyecciones con javascript:, data:, vbscript:, etc.
  if (/^(javascript:|data:|vbscript:|file:)/i.test(trimmed)) {
    return '';
  }

  let normalized = trimmed;
  if (!/^https?:\/\//i.test(normalized)) {
    // Si parece un dominio válido o ruta de YouTube
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(normalized)) {
      normalized = `https://${normalized}`;
    } else {
      return '';
    }
  }

  return isValidWebUrl(normalized) ? normalized.slice(0, maxLength) : '';
}

/**
 * Valida y acota la edad de forma segura (0 a 130 años)
 */
export function sanitizeAge(val: unknown): number {
  const num = typeof val === 'number' ? val : parseInt(String(val), 10);
  if (isNaN(num) || num < 0) return 0;
  if (num > 130) return 130;
  return Math.floor(num);
}
