import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, ArrowRight, Building2, CheckCircle2, ChevronRight, Navigation } from 'lucide-react';
import { GROUP_BRANCHES, RegionalBranch } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface RegionalBranchesSectionProps {
  onContactClick?: (branchId: string) => void;
}

export const RegionalBranchesSection: React.FC<RegionalBranchesSectionProps> = ({ onContactClick }) => {
  const { isDark } = useTheme();
  const [selectedBranchId, setSelectedBranchId] = useState<'jv_gonzalez' | 'guemes' | 'metan'>('jv_gonzalez');

  const currentBranch = GROUP_BRANCHES.find(b => b.id === selectedBranchId) || GROUP_BRANCHES[0];

  const branchStyles = {
    jv_gonzalez: {
      accentBorder: 'border-sky-600 dark:border-sky-500',
      accentRing: 'ring-sky-500/20',
      accentBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300',
      activeBtn: 'bg-sky-700 hover:bg-sky-600 text-white',
      badge: 'bg-sky-100 dark:bg-sky-950/60 text-sky-900 dark:text-sky-300 border-sky-300 dark:border-sky-800'
    },
    guemes: {
      accentBorder: 'border-stone-600 dark:border-stone-400',
      accentRing: 'ring-stone-500/20',
      accentBg: 'bg-stone-100 dark:bg-stone-850 text-stone-800 dark:text-stone-200',
      activeBtn: 'bg-stone-800 dark:bg-stone-700 hover:bg-stone-700 text-white',
      badge: 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700'
    },
    metan: {
      accentBorder: 'border-rose-700 dark:border-rose-500',
      accentRing: 'ring-rose-500/20',
      accentBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300',
      activeBtn: 'bg-rose-800 hover:bg-rose-700 text-white',
      badge: 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-800'
    }
  };

  return (
    <section id="sucursales" className={`py-16 sm:py-24 ${
      isDark ? 'bg-stone-900/90 text-stone-100 border-stone-800' : 'bg-stone-50/80 text-stone-900 border-stone-200'
    } border-b transition-colors duration-300 relative overflow-hidden`}>
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 space-y-3">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${
            isDark ? 'bg-stone-800 border-stone-700 text-stone-300' : 'bg-white border-stone-300 text-stone-700'
          } border text-xs font-semibold shadow-xs`}>
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Red Regional de Cocherías & Servicios Sociales</span>
          </div>
          
          <h2 className={`text-3xl sm:text-4xl font-bold font-serif ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
            Nuestras Sedes en la Provincia de Salta
          </h2>
          
          <p className={`${isDark ? 'text-stone-300' : 'text-stone-700'} text-sm sm:text-base font-light leading-relaxed`}>
            Presencia histórica en <strong>Joaquín V. González</strong>, <strong>General Güemes</strong> y <strong>San José de Metán</strong>, brindando cobertura integral, salas velatorias de primer nivel y guardia permanente.
          </p>
        </div>

        {/* 3 Interactive Branch Selector Cards (Clean, Sober, Uncluttered) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {GROUP_BRANCHES.map((branch) => {
            const isSelected = selectedBranchId === branch.id;
            const style = branchStyles[branch.id as keyof typeof branchStyles];

            return (
              <motion.div
                key={branch.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedBranchId(branch.id as any)}
                className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border flex flex-col justify-between ${
                  isSelected
                    ? isDark
                      ? `bg-stone-850 ${style.accentBorder} shadow-xl ring-2 ${style.accentRing}`
                      : `bg-white ${style.accentBorder} shadow-xl ring-2 ${style.accentRing}`
                    : isDark
                      ? 'bg-stone-850/60 border-stone-800 hover:border-stone-700 hover:bg-stone-850'
                      : 'bg-white border-stone-200 hover:border-stone-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                      {branch.categoryTag}
                    </span>
                    <span className={`text-xs font-mono ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      Guardia 24hs
                    </span>
                  </div>

                  <h3 className={`font-serif font-bold text-xl mb-1.5 ${
                    isDark ? 'text-stone-100' : 'text-stone-900'
                  }`}>
                    {branch.brandName}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 mb-3">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{branch.city} • {branch.department}</span>
                  </div>

                  <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'} leading-relaxed line-clamp-2`}>
                    {branch.address} • {branch.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800/80">
                  <div className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    isSelected
                      ? style.activeBtn
                      : isDark ? 'bg-stone-800 text-stone-300 hover:bg-stone-750' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}>
                    <span>{isSelected ? 'Sede seleccionada' : 'Ver datos de guardia'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Selected Branch Info Panel with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBranch.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`rounded-3xl border ${
              isDark ? 'bg-stone-850 border-stone-800' : 'bg-white border-stone-200 shadow-xl'
            } p-6 sm:p-9 transition-all duration-300`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Direct Action & Location Box */}
              <div className="lg:col-span-5 space-y-4 p-6 rounded-2xl bg-stone-100/80 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800">
                <div className="space-y-1">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border inline-block ${currentBranch.badgeBg}`}>
                    {currentBranch.categoryTag}
                  </span>
                  <h4 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                    {currentBranch.brandName}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {currentBranch.city} • {currentBranch.department}, Salta
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-stone-200 dark:border-stone-800 text-xs">
                  <div className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                    <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-stone-900 dark:text-stone-100 font-semibold">{currentBranch.address}</strong>
                      <span className="text-[11px] text-stone-500">Atención presencial y administración</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                    <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Guardia Permanente: <strong>24 Horas los 365 Días</strong></span>
                  </div>
                </div>

                {/* Direct Call & WhatsApp Buttons */}
                <div className="pt-3 space-y-2">
                  <a
                    href={`tel:${currentBranch.phoneGuard.replace(/\s+/g, '')}`}
                    className="w-full flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-colors"
                  >
                    <Phone className="w-4 h-4 text-amber-200" />
                    <span>Llamar a Sede: {currentBranch.phoneGuard}</span>
                  </a>

                  <a
                    href={currentBranch.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp de Guardia Directo</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Coverage, Facilities & Description */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h3 className={`text-xl sm:text-2xl font-serif font-bold ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
                    Respaldo y Servicios en {currentBranch.city}
                  </h3>
                  <p className={`mt-2 text-xs sm:text-sm ${isDark ? 'text-stone-300' : 'text-stone-600'} leading-relaxed font-light`}>
                    {currentBranch.description}
                  </p>
                </div>

                {/* Coverage & Services Bullet Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] block">
                      Zonas de Cobertura Directa:
                    </span>
                    <ul className="space-y-1.5 text-stone-600 dark:text-stone-300">
                      {currentBranch.coverage.map((area, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] block">
                      Servicios e Infraestructura:
                    </span>
                    <ul className="space-y-1.5 text-stone-600 dark:text-stone-300">
                      {currentBranch.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Reassurance note */}
                <div className={`p-3.5 rounded-xl ${isDark ? 'bg-amber-950/30 border-amber-900/40 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'} border text-xs flex items-center gap-2.5`}>
                  <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    Atención directa a afiliados, convenios PAMI, obras sociales y particulares sin demoras.
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
