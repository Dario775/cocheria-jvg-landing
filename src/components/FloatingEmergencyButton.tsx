import React, { useState } from 'react';
import { Phone, MessageCircle, AlertCircle, X, Clock, HelpCircle, ShieldCheck } from 'lucide-react';
import { EMERGENCY_INFO } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface FloatingEmergencyButtonProps {
  onOpenQuickGuide: () => void;
  onOpenStreamingDemo?: () => void;
}

export const FloatingEmergencyButton: React.FC<FloatingEmergencyButtonProps> = ({ onOpenQuickGuide, onOpenStreamingDemo }) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {/* Expanded quick contact tray */}
      {isOpen && (
        <div className={`${
          isDark 
            ? 'bg-stone-900/95 border-amber-600/50 text-stone-100' 
            : 'bg-white/95 border-amber-500/50 text-stone-900 shadow-2xl'
        } border rounded-2xl shadow-2xl p-4 w-72 sm:w-80 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200`}>
          <div className={`flex items-center justify-between border-b ${isDark ? 'border-stone-800' : 'border-stone-200'} pb-2.5 mb-3`}>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className={`font-semibold text-sm ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Guardia de Urgencia 24hs</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`${isDark ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-stone-900'} p-1 rounded-md transition-colors`}
              aria-label="Cerrar opciones de urgencia"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className={`text-xs ${isDark ? 'text-stone-300' : 'text-stone-600'} mb-3 leading-relaxed`}>
            Estamos a su entera disposición en este difícil momento. Asistencia inmediata para traslados y trámites.
          </p>

          <div className="space-y-2">
            {/* Direct Mobile Call */}
            <a
              href={`tel:${EMERGENCY_INFO.phoneEmergencyMobile.replace(/\s+/g, '')}`}
              className="flex items-center justify-between w-full bg-amber-700 hover:bg-amber-600 text-white px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors shadow-md group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-amber-800 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 text-amber-200 group-hover:animate-bounce" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] text-amber-100">Llamada Celular Directa</div>
                  <div className="font-bold text-xs">{EMERGENCY_INFO.phoneEmergencyMobile}</div>
                </div>
              </div>
              <span className="text-[10px] bg-amber-900/60 text-amber-200 px-2 py-0.5 rounded-full">24hs</span>
            </a>

            {/* Landline */}
            <a
              href={`tel:${EMERGENCY_INFO.phoneGuard24.replace(/\s+/g, '')}`}
              className={`flex items-center justify-between w-full ${
                isDark ? 'bg-stone-800 hover:bg-stone-750 text-stone-200 border-stone-700' : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
              } px-3.5 py-2 rounded-xl text-xs transition-colors border`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className={`w-4 h-4 ${isDark ? 'text-stone-400' : 'text-stone-600'}`} />
                <div className="text-left">
                  <div className={`text-[10px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Teléfono Fijo Central</div>
                  <div className="font-semibold">{EMERGENCY_INFO.phoneGuard24}</div>
                </div>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={EMERGENCY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-2.5 rounded-xl font-medium text-xs transition-colors shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-800 flex items-center justify-center">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] text-emerald-100">Mensaje WhatsApp</div>
                  <div className="font-bold text-xs">Respuesta Inmediata</div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded-full">Online</span>
            </a>

            {/* Quick 3-step guide button */}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenQuickGuide();
              }}
              className={`flex items-center justify-center gap-2 w-full text-center py-1.5 text-xs ${
                isDark ? 'text-amber-300 hover:text-amber-200' : 'text-amber-800 hover:text-amber-900'
              } hover:underline font-medium`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              ¿Qué hacer ante un fallecimiento? (Guía)
            </button>

            {/* Internal Demo / Simulator trigger */}
            {onOpenStreamingDemo && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenStreamingDemo();
                }}
                className={`flex items-center justify-center gap-1.5 w-full text-center py-1 text-[11px] ${
                  isDark ? 'text-amber-400/80 hover:text-amber-300' : 'text-amber-700/80 hover:text-amber-900'
                } hover:underline font-mono border-t ${isDark ? 'border-stone-800' : 'border-stone-200'} pt-2`}
              >
                <span>🎥 Probar Velatorio Online & TV Box</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main floating trigger buttons */}
      <div className="flex items-center gap-2">
        {/* WhatsApp direct quick button */}
        <a
          href={EMERGENCY_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all border-2 border-emerald-400/50"
          aria-label="Abrir chat de WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        {/* Emergency phone toggle pulse button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group flex items-center gap-2.5 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white px-4 py-3 rounded-full shadow-2xl transition-all hover:scale-105 border-2 border-amber-400/60 ${
            isOpen ? 'ring-4 ring-amber-500/30' : ''
          }`}
          aria-label="Asistencia fúnebre de urgencia 24hs"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
          </span>

          <Phone className="w-5 h-5 text-amber-100 group-hover:rotate-12 transition-transform" />
          <span className="text-xs sm:text-sm font-bold tracking-wide">Urgencias 24hs</span>
        </button>
      </div>
    </div>
  );
};
