import React from 'react';
import { X, Phone, MessageCircle, AlertCircle, FileText, CheckCircle2, HeartHandshake, ShieldCheck, Clock } from 'lucide-react';
import { EMERGENCY_INFO } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface BereavementGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BereavementGuideModal: React.FC<BereavementGuideModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className={`relative w-full max-w-3xl ${
        isDark ? 'bg-stone-900 border-stone-750 text-stone-100' : 'bg-white border-stone-200 text-stone-900 shadow-2xl'
      } border rounded-2xl shadow-2xl overflow-hidden my-6`}>
        
        {/* Header */}
        <div className={`${
          isDark ? 'bg-gradient-to-r from-stone-850 to-stone-900 border-stone-800' : 'bg-gradient-to-r from-stone-100 to-white border-stone-200'
        } border-b p-5 sm:p-6 flex items-start justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${
              isDark ? 'bg-amber-950 border-amber-700/60 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900'
            } border flex items-center justify-center flex-shrink-0`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`font-serif font-bold text-xl ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
                Guía Familiar: ¿Qué hacer ante un fallecimiento?
              </h2>
              <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                Pasos claros y orientación legal y humana para momentos difíciles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg ${isDark ? 'text-stone-400 hover:text-white hover:bg-stone-800' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'} transition-colors`}
            aria-label="Cerrar guía"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Top urgency reminder */}
          <div className={`${
            isDark ? 'bg-amber-950/60 border-amber-800/60' : 'bg-amber-50 border-amber-300'
          } border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div className={`text-xs ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
                <span className={`font-bold ${isDark ? 'text-amber-200' : 'text-amber-900'} block text-sm`}>Nuestra Guardia 24hs está a su disposición</span>
                Usted no tiene que afrontar estos trámites en soledad. Nosotros nos ocupamos de todo.
              </div>
            </div>
            <a
              href={`tel:${EMERGENCY_INFO.phoneEmergencyMobile.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shadow"
            >
              <Phone className="w-3.5 h-3.5" />
              Llamar Guardia
            </a>
          </div>

          {/* 3 Step Protocol */}
          <div className="space-y-4">
            <h3 className={`font-serif font-bold text-xs uppercase tracking-wider ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
              Protocolo según el lugar del deceso:
            </h3>

            {/* Scenario A: Hospital or Clinic */}
            <div className={`${
              isDark ? 'bg-stone-850 border-stone-800' : 'bg-stone-50 border-stone-200'
            } p-4 rounded-xl border space-y-2`}>
              <div className={`flex items-center gap-2 ${isDark ? 'text-stone-100' : 'text-stone-900'} font-semibold text-sm`}>
                <span className={`w-6 h-6 rounded-full ${
                  isDark ? 'bg-amber-900/80 text-amber-300' : 'bg-amber-200 text-amber-900'
                } flex items-center justify-center text-xs font-bold`}>
                  A
                </span>
                <span>Fallecimiento en Hospital, Clínica o Sanatorio</span>
              </div>
              <p className={`text-xs ${isDark ? 'text-stone-300' : 'text-stone-700'} leading-relaxed pl-8`}>
                El médico de cabecera o de guardia de la institución confeccionará el <strong>Certificado Médico de Defunción</strong>. Una vez emitido, comuníquese con Cochería J.V. González para que nuestro personal se presente a retirar el cuerpo y coordinar el velatorio o traslado.
              </p>
            </div>

            {/* Scenario B: At Home */}
            <div className={`${
              isDark ? 'bg-stone-850 border-stone-800' : 'bg-stone-50 border-stone-200'
            } p-4 rounded-xl border space-y-2`}>
              <div className={`flex items-center gap-2 ${isDark ? 'text-stone-100' : 'text-stone-900'} font-semibold text-sm`}>
                <span className={`w-6 h-6 rounded-full ${
                  isDark ? 'bg-amber-900/80 text-amber-300' : 'bg-amber-200 text-amber-900'
                } flex items-center justify-center text-xs font-bold`}>
                  B
                </span>
                <span>Fallecimiento en el Domicilio Particular</span>
              </div>
              <p className={`text-xs ${isDark ? 'text-stone-300' : 'text-stone-700'} leading-relaxed pl-8`}>
                Llámenos de inmediato. Si el familiar contaba con médico tratante, se le solicitará que asista a certificar el óbito. En caso de no contar con médico particular, nuestro equipo le asesorará para el llamado al servicio de emergencias médicas o médico policial según corresponda.
              </p>
            </div>

            {/* Scenario C: Public Road or Accident */}
            <div className={`${
              isDark ? 'bg-stone-850 border-stone-800' : 'bg-stone-50 border-stone-200'
            } p-4 rounded-xl border space-y-2`}>
              <div className={`flex items-center gap-2 ${isDark ? 'text-stone-100' : 'text-stone-900'} font-semibold text-sm`}>
                <span className={`w-6 h-6 rounded-full ${
                  isDark ? 'bg-amber-900/80 text-amber-300' : 'bg-amber-200 text-amber-900'
                } flex items-center justify-center text-xs font-bold`}>
                  C
                </span>
                <span>Fallecimiento en Vía Pública o Causa Dudosa</span>
              </div>
              <p className={`text-xs ${isDark ? 'text-stone-300' : 'text-stone-700'} leading-relaxed pl-8`}>
                Interviene la autoridad judicial y policial. Se traslada el cuerpo a la morgue judicial para la correspondiente autopsia de ley. En paralelo, nuestra empresa puede iniciar todos los preparativos de la sala y gestiones ante el Registro Civil.
              </p>
            </div>
          </div>

          {/* Documentation Checklist */}
          <div className={`${
            isDark ? 'bg-stone-850 border-stone-800' : 'bg-stone-50 border-stone-200'
          } p-5 rounded-2xl border space-y-3`}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
              <ShieldCheck className="w-4 h-4" />
              <span>Documentación Indispensable a Reunir</span>
            </div>

            <ul className={`space-y-2 text-xs ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>DNI original del fallecido</strong> (indispensable para inscripción en el Registro Civil de las Personas).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Certificado Médico de Defunción</strong> original firmado por el profesional matriculado.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>DNI del familiar declarante</strong> (cónyuge, hijo/a, padre/madre o apoderado directo).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Carnet de PAMI o recibo de haberes</strong> si corresponde para la aplicación del subsidio de sepelio.</span>
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className={`pt-2 border-t ${isDark ? 'border-stone-800' : 'border-stone-200'} flex flex-col sm:flex-row gap-3 justify-end`}>
            <button
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl text-xs font-medium ${
                isDark ? 'bg-stone-800 hover:bg-stone-750 text-stone-300' : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              } transition-colors`}
            >
              Cerrar Guía
            </button>
            <a
              href={`https://wa.me/${EMERGENCY_INFO.whatsappNumber}?text=${encodeURIComponent('Hola Cochería J.V. González, necesito asesoramiento sobre los primeros pasos ante un fallecimiento.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Consultar por WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
