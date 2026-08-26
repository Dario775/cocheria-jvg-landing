import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Phone, MessageCircle, Search, Calculator, ShieldCheck, Clock, Award, ChevronRight, FileText, Building2, Sparkles } from 'lucide-react';
import { EMERGENCY_INFO } from '../data/mockData';
import { UnifiedCompanyLogo } from './logos/CompanyLogos';
import { useTheme } from '../context/ThemeContext';
import { FloatingCandleEmbers } from './effects/FloatingCandleEmbers';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  onOpenBereavementGuide: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenBereavementGuide }) => {
  const { isDark } = useTheme();
  const heroRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const bgBlobY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const heroContentY = useTransform(scrollYProgress, [0, 1], ['0px', '25px']);
  const cardFloatY = useTransform(scrollYProgress, [0, 1], ['0px', '-20px']);

  return (
    <section 
      ref={heroRef}
      className={`relative overflow-hidden ${
        isDark ? 'bg-stone-950 text-stone-100 border-stone-800' : 'bg-stone-100/80 text-stone-900 border-stone-200'
      } pt-10 pb-16 sm:pt-14 sm:pb-24 border-b transition-colors duration-300`}
    >
      {/* Dynamic Floating Candle Embers & Ambient Serene Lighting */}
      <FloatingCandleEmbers />

      {/* Parallax Glowing Light Blobs */}
      <motion.div 
        style={{ y: bgBlobY }}
        className="absolute inset-0 opacity-25 pointer-events-none"
      >
        <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full ${isDark ? 'bg-sky-600/30' : 'bg-sky-400/20'} blur-3xl`} />
        <div className={`absolute top-1/3 -right-32 w-96 h-96 rounded-full ${isDark ? 'bg-amber-600/20' : 'bg-amber-500/15'} blur-3xl`} />
        <div 
          className="w-full h-full opacity-10"
          style={{
            backgroundImage: isDark
              ? `radial-gradient(#5dade2 0.75px, transparent 0.75px), radial-gradient(#5dade2 0.75px, #0c0a09 0.75px)`
              : `radial-gradient(#1b4d75 0.75px, transparent 0.75px), radial-gradient(#1b4d75 0.75px, #f5f5f4 0.75px)`,
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 15px 15px'
          }}
        />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Top 3-Branch Network Trust Bar - Sleek & Uncluttered */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8 inline-flex flex-wrap items-center gap-3 px-4 py-2 rounded-full bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 backdrop-blur-md shadow-xs text-xs"
        >
          <div className="flex items-center gap-2 font-semibold text-stone-700 dark:text-stone-300">
            <Building2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>Presencia Regional:</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 text-stone-600 dark:text-stone-400">
            <button
              onClick={() => onNavigate('sucursales')}
              className="font-medium text-stone-800 dark:text-stone-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              J.V. González
            </button>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <button
              onClick={() => onNavigate('sucursales')}
              className="font-medium text-stone-800 dark:text-stone-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Gral. Güemes
            </button>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <button
              onClick={() => onNavigate('sucursales')}
              className="font-medium text-stone-800 dark:text-stone-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Metán
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Main Hero Copy & Authority with Motion Reveal */}
          <motion.div 
            style={{ y: heroContentY }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${
              isDark ? 'bg-amber-950/60 border-amber-800/60 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900'
            } border text-xs sm:text-sm font-medium shadow-xs`}>
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Empresa Líder de Servicios Fúnebres en Anta y la Región</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 hidden sm:inline animate-pulse" />
            </div>

            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight ${
              isDark ? 'text-stone-50' : 'text-stone-900'
            } leading-tight font-serif`}>
              Acompañando a las familias con <span className={`${isDark ? 'text-amber-200' : 'text-sky-900'} italic font-normal font-serif`}>dignidad, respeto</span> y calidez humana.
            </h1>

            <p className={`${isDark ? 'text-stone-300' : 'text-stone-700'} text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed`}>
              En los momentos más sensibles, le brindamos respaldo integral ininterrumpido. Salas velatorias climatizadas, gestión de trámites ante PAMI y obras sociales, traslados nacionales y obituario digital.
            </p>

            {/* Main Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <a
                href={`tel:${EMERGENCY_INFO.phoneEmergencyMobile.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-stone-50 font-semibold px-6 py-3.5 rounded-xl text-sm sm:text-base shadow-lg hover:shadow-amber-900/40 transition-all duration-300 border border-amber-500/30 group hover:scale-[1.02]"
              >
                <Phone className="w-5 h-5 text-amber-200 group-hover:animate-bounce" />
                <span>Guardia 24hs: {EMERGENCY_INFO.phoneEmergencyMobile}</span>
              </a>

              <button
                onClick={() => onNavigate('obituario')}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 ${
                  isDark 
                    ? 'bg-stone-900 hover:bg-stone-850 text-stone-200 hover:text-white border-stone-700' 
                    : 'bg-white hover:bg-stone-50 text-stone-800 hover:text-stone-950 border-stone-300 shadow-xs'
                } font-medium px-5 py-3.5 rounded-xl text-sm sm:text-base border transition-all duration-200 hover:scale-[1.02]`}
              >
                <Search className="w-4 h-4 text-amber-600" />
                <span>Consultar Obituario Digital</span>
              </button>
            </div>

            {/* Quick reassurance strip */}
            <div className={`pt-4 border-t ${isDark ? 'border-stone-800/80' : 'border-stone-300'} grid grid-cols-2 sm:grid-cols-3 gap-3 text-left`}>
              <div className={`flex items-center gap-2 ${isDark ? 'text-stone-300' : 'text-stone-700'} text-xs sm:text-sm`}>
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Atención los 365 días las 24 horas</span>
              </div>
              <div className={`flex items-center gap-2 ${isDark ? 'text-stone-300' : 'text-stone-700'} text-xs sm:text-sm`}>
                <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Cobertura PAMI y Obras Sociales</span>
              </div>
              <div className={`col-span-2 sm:col-span-1 flex items-center gap-2 ${isDark ? 'text-stone-300' : 'text-stone-700'} text-xs sm:text-sm`}>
                <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Más de 40 años de trayectoria</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Interactive Access Card on the Right with Parallax Float */}
          <motion.div 
            style={{ y: cardFloatY }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5"
          >
            <div className={`${
              isDark 
                ? 'bg-stone-900/90 border-stone-800 text-stone-100' 
                : 'bg-white/95 border-stone-200 text-stone-900 shadow-xl'
            } border rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden transition-colors duration-200 hover:border-amber-500/40`}>
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

              <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                <div>
                  <h2 className={`text-lg font-bold font-serif ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Centro de Asistencia Inmediata</h2>
                  <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Canales de respuesta directa y orientación</p>
                </div>
                <div className={`w-9 h-9 rounded-full ${isDark ? 'bg-amber-950 border-amber-700/50' : 'bg-amber-100 border-amber-300'} border flex items-center justify-center`}>
                  <Phone className="w-4 h-4 text-amber-600" />
                </div>
              </div>

              {/* Step by step immediate prompt */}
              <div className="my-5 space-y-3">
                <div className={`${
                  isDark 
                    ? 'bg-stone-850/80 border-stone-750 hover:border-amber-700/50' 
                    : 'bg-stone-50 border-stone-200 hover:border-amber-400'
                } p-3.5 rounded-xl border flex items-start gap-3 transition-colors`}>
                  <div className={`w-7 h-7 rounded-lg ${
                    isDark ? 'bg-amber-900/60 text-amber-300' : 'bg-amber-100 text-amber-900'
                  } font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    1
                  </div>
                  <div>
                    <h3 className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>¿Fallecimiento reciente?</h3>
                    <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'} mt-0.5`}>
                      Llámenos de inmediato. Un asesor fúnebre tomará el caso y se desplazará a donde usted lo indique.
                    </p>
                  </div>
                </div>

                <div className={`${
                  isDark 
                    ? 'bg-stone-850/80 border-stone-750 hover:border-amber-700/50' 
                    : 'bg-stone-50 border-stone-200 hover:border-amber-400'
                } p-3.5 rounded-xl border flex items-start gap-3 transition-colors`}>
                  <div className={`w-7 h-7 rounded-lg ${
                    isDark ? 'bg-amber-900/60 text-amber-300' : 'bg-amber-100 text-amber-900'
                  } font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    2
                  </div>
                  <div>
                    <h3 className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>Gestión de Trámites y PAMI</h3>
                    <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'} mt-0.5`}>
                      Nos encargamos del certificado médico, acta de defunción y convenios con obras sociales.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Hero Card */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => onNavigate('servicios')}
                  className={`w-full flex items-center justify-between ${
                    isDark 
                      ? 'bg-stone-800 hover:bg-stone-750 text-stone-200 border-stone-700' 
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                  } px-4 py-3 rounded-xl text-xs sm:text-sm font-medium border transition-all group`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Ver Servicios Fúnebres y Coberturas</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isDark ? 'text-stone-400' : 'text-stone-600'} group-hover:translate-x-1 transition-transform`} />
                </button>

                <button
                  onClick={onOpenBereavementGuide}
                  className={`w-full flex items-center justify-between ${
                    isDark 
                      ? 'bg-amber-950/40 hover:bg-amber-950/70 text-amber-200 border-amber-900/40' 
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                  } px-4 py-3 rounded-xl text-xs sm:text-sm font-medium border transition-all group`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>Guía Familiar: ¿Qué hacer ante un duelo?</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Direct WhatsApp fast response */}
              <div className={`mt-4 pt-3 border-t ${isDark ? 'border-stone-800' : 'border-stone-200'} text-center`}>
                <a
                  href={EMERGENCY_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 text-xs ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-800'} font-medium transition-colors`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>¿Prefiere escribirnos? WhatsApp de Urgencias Activo</span>
                </a>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
