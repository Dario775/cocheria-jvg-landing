import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FUNERAL_SERVICES } from '../data/mockData';
import { FuneralServiceItem } from '../types';
import { Shield, Home, Flame, Truck, FileText, Flower2, HeartHandshake, CheckCircle2, ChevronRight, X, Phone, MessageCircle, Sparkles } from 'lucide-react';
import { EMERGENCY_INFO } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Home,
  Flame,
  Truck,
  FileText,
  Flower2,
  HeartHandshake
};

export const ServicesSection: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedService, setSelectedService] = useState<FuneralServiceItem | null>(null);

  return (
    <section id="servicios" className={`py-16 sm:py-24 ${
      isDark ? 'bg-stone-900 text-stone-100 border-stone-800' : 'bg-white text-stone-900 border-stone-200'
    } border-b transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${
            isDark ? 'bg-amber-950/70 border-amber-800/60 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900'
          } border text-xs font-semibold`}>
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Nuestra Cobertura & Compromiso</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold font-serif ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
            Servicios Fúnebres Integrales de Excelencia
          </h2>
          <p className={`${isDark ? 'text-stone-300' : 'text-stone-700'} text-sm sm:text-base font-light leading-relaxed`}>
            Soluciones completas y personalizadas para brindar a su ser querido la despedida que merece, acompañándole con serenidad, contención humana y rigurosa puntualidad.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FUNERAL_SERVICES.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Shield;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => setSelectedService(service)}
                className={`group relative rounded-2xl p-6 border transition-all duration-300 hover:shadow-2xl cursor-pointer flex flex-col justify-between ${
                  isDark
                    ? service.highlighted
                      ? 'border-amber-600/60 bg-gradient-to-b from-stone-850 to-stone-900 ring-1 ring-amber-500/20 shadow-amber-950/20'
                      : 'bg-stone-850/90 border-stone-800 hover:border-amber-500/40 hover:bg-stone-850'
                    : service.highlighted
                      ? 'border-amber-400 bg-amber-50/60 ring-1 ring-amber-400/40 shadow-md'
                      : 'bg-white border-stone-200 hover:border-amber-400/60 hover:shadow-lg'
                }`}
              >
                <div>
                  {/* Icon & Title */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${
                      isDark ? 'bg-amber-950/80 border-amber-700/50 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900'
                    } border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {service.pricingIndication && (
                      <span className={`text-[11px] ${
                        isDark ? 'text-amber-300 bg-amber-950/60 border-amber-800/50' : 'text-amber-900 bg-amber-100 border-amber-300'
                      } border px-2.5 py-0.5 rounded-full font-medium`}>
                        {service.pricingIndication}
                      </span>
                    )}
                  </div>

                  <h3 className={`font-serif font-bold text-lg ${
                    isDark ? 'text-stone-100 group-hover:text-amber-200' : 'text-stone-900 group-hover:text-amber-900'
                  } transition-colors mb-2`}>
                    {service.title}
                  </h3>

                  <p className={`text-xs sm:text-sm ${
                    isDark ? 'text-stone-300' : 'text-stone-600'
                  } leading-relaxed line-clamp-3 mb-4`}>
                    {service.shortDesc}
                  </p>

                  {/* Highlights checklist */}
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className={`flex items-start gap-2 text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`pt-4 border-t ${
                  isDark ? 'border-stone-800 text-amber-400 group-hover:text-amber-300' : 'border-stone-200 text-amber-800 group-hover:text-amber-900'
                } flex items-center justify-between text-xs font-semibold`}>
                  <span>Conocer más detalles</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className={`relative w-full max-w-2xl ${
            isDark ? 'bg-stone-900 border-stone-750 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
          } border rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6`}>
            
            <div className={`flex items-start justify-between border-b ${isDark ? 'border-stone-800' : 'border-stone-200'} pb-4`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${
                  isDark ? 'bg-amber-950 border-amber-700/60 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900'
                } border flex items-center justify-center`}>
                  {React.createElement(iconMap[selectedService.icon] || Shield, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h3 className={`font-serif font-bold text-xl ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>{selectedService.title}</h3>
                  <span className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>{selectedService.pricingIndication}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className={`${isDark ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-stone-900'} p-1 rounded-md`}
                aria-label="Cerrar detalles del servicio"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className={`text-sm ${isDark ? 'text-stone-300' : 'text-stone-700'} leading-relaxed`}>
              {selectedService.fullDesc}
            </p>

            <div>
              <h4 className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'} mb-3`}>
                Características y elementos incluidos:
              </h4>
              <ul className="space-y-2.5">
                {selectedService.features.map((feat, i) => (
                  <li key={i} className={`flex items-start gap-2.5 text-xs sm:text-sm ${
                    isDark ? 'text-stone-300 bg-stone-850 border-stone-800' : 'text-stone-800 bg-stone-50 border-stone-200'
                  } p-2.5 rounded-lg border`}>
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons inside service modal */}
            <div className={`pt-4 border-t ${isDark ? 'border-stone-800' : 'border-stone-200'} flex flex-col sm:flex-row gap-3 justify-end`}>
              <a
                href={EMERGENCY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultar por este servicio</span>
              </a>

              <a
                href={`tel:${EMERGENCY_INFO.phoneEmergencyMobile.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>Llamar a Guardia 24hs</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
