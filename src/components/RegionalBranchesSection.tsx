import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, ArrowRight, Building2, CheckCircle2, ChevronRight } from 'lucide-react';
import { GROUP_BRANCHES, RegionalBranch } from '../data/mockData';
import { LogoJVGonzalez, LogoGuemes, LogoMetan, UnifiedCompanyLogo } from './logos/CompanyLogos';
import { useTheme } from '../context/ThemeContext';

interface RegionalBranchesSectionProps {
  onContactClick?: (branchId: string) => void;
}

export const RegionalBranchesSection: React.FC<RegionalBranchesSectionProps> = ({ onContactClick }) => {
  const { isDark } = useTheme();
  const [selectedBranchId, setSelectedBranchId] = useState<'jv_gonzalez' | 'guemes' | 'metan'>('jv_gonzalez');

  const currentBranch = GROUP_BRANCHES.find(b => b.id === selectedBranchId) || GROUP_BRANCHES[0];

  return (
    <section id="sucursales" className={`py-16 sm:py-24 ${
      isDark ? 'bg-stone-900/90 text-stone-100 border-stone-800' : 'bg-stone-50/80 text-stone-900 border-stone-200'
    } border-b transition-colors duration-300 relative overflow-hidden`}>
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${
            isDark ? 'bg-stone-800 border-stone-700 text-stone-300' : 'bg-white border-stone-300 text-stone-700'
          } border text-xs font-semibold shadow-xs`}>
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Red Regional de Servicios Fúnebres & Sociales</span>
          </div>
          
          <h2 className={`text-3xl sm:text-4xl font-bold font-serif ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
            Nuestras Tres Casas y Sedes en Salta
          </h2>
          
          <p className={`${isDark ? 'text-stone-300' : 'text-stone-700'} text-sm sm:text-base font-light leading-relaxed`}>
            Una sólida red de cocherías y servicios sociales con presencia histórica en <strong>Joaquín V. González</strong>, <strong>General Güemes</strong> y <strong>San José de Metán</strong>, unidas por los mismos valores de solemnidad, respeto y calidez humana.
          </p>
        </div>

        {/* 3 Interactive Brand Logos Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Cochería J.V. González */}
          <div
            onClick={() => setSelectedBranchId('jv_gonzalez')}
            className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border text-center flex flex-col items-center justify-between ${
              selectedBranchId === 'jv_gonzalez'
                ? isDark
                  ? 'bg-stone-850 border-sky-500 shadow-xl ring-2 ring-sky-500/30 -translate-y-1'
                  : 'bg-white border-sky-600 shadow-xl ring-2 ring-sky-600/20 -translate-y-1'
                : isDark
                  ? 'bg-stone-850/60 border-stone-800 hover:border-stone-700 hover:bg-stone-850'
                  : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white shadow-xs'
            }`}
          >
            <div className="w-full flex justify-end mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                selectedBranchId === 'jv_gonzalez'
                  ? 'bg-sky-900/30 text-sky-400 border-sky-500/40'
                  : 'bg-stone-800/40 text-stone-400 border-stone-700'
              }`}>
                Casa Central
              </span>
            </div>

            <div className="py-3 flex items-center justify-center min-h-[160px]">
              <LogoJVGonzalez variant="full" size="sm" isDark={isDark} />
            </div>

            <div className="w-full pt-4 border-t border-stone-200 dark:border-stone-800 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>Joaquín V. González (Anta)</span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                Av. General Güemes 450 • Cobertura integral en todo el Departamento Anta y rutas provinciales.
              </p>
            </div>

            <div className={`mt-4 w-full py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              selectedBranchId === 'jv_gonzalez'
                ? 'bg-sky-700 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}>
              <span>Ver información y guardia</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Servicios Sociales Güemes */}
          <div
            onClick={() => setSelectedBranchId('guemes')}
            className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border text-center flex flex-col items-center justify-between ${
              selectedBranchId === 'guemes'
                ? isDark
                  ? 'bg-stone-850 border-stone-400 shadow-xl ring-2 ring-stone-400/30 -translate-y-1'
                  : 'bg-white border-stone-900 shadow-xl ring-2 ring-stone-900/20 -translate-y-1'
                : isDark
                  ? 'bg-stone-850/60 border-stone-800 hover:border-stone-700 hover:bg-stone-850'
                  : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white shadow-xs'
            }`}
          >
            <div className="w-full flex justify-end mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                selectedBranchId === 'guemes'
                  ? 'bg-stone-800 text-stone-200 border-stone-500/40'
                  : 'bg-stone-800/40 text-stone-400 border-stone-700'
              }`}>
                Valle de Siancas
              </span>
            </div>

            <div className="py-3 flex items-center justify-center min-h-[160px]">
              <LogoGuemes variant="full" size="sm" isDark={isDark} />
            </div>

            <div className="w-full pt-4 border-t border-stone-200 dark:border-stone-800 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 dark:text-stone-300">
                <MapPin className="w-3.5 h-3.5" />
                <span>General Güemes (Centro)</span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                Alberdi 320 • Cobertura Campo Santo, El Bordo, Cobos y corredor Ruta Nacional 34.
              </p>
            </div>

            <div className={`mt-4 w-full py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              selectedBranchId === 'guemes'
                ? 'bg-stone-900 dark:bg-stone-200 text-white dark:text-stone-900'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}>
              <span>Ver información y guardia</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Cochería Metán */}
          <div
            onClick={() => setSelectedBranchId('metan')}
            className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border text-center flex flex-col items-center justify-between ${
              selectedBranchId === 'metan'
                ? isDark
                  ? 'bg-stone-850 border-rose-500 shadow-xl ring-2 ring-rose-500/30 -translate-y-1'
                  : 'bg-white border-rose-700 shadow-xl ring-2 ring-rose-700/20 -translate-y-1'
                : isDark
                  ? 'bg-stone-850/60 border-stone-800 hover:border-stone-700 hover:bg-stone-850'
                  : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white shadow-xs'
            }`}
          >
            <div className="w-full flex justify-end mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                selectedBranchId === 'metan'
                  ? 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                  : 'bg-stone-800/40 text-stone-400 border-stone-700'
              }`}>
                Sur de Salta
              </span>
            </div>

            <div className="py-3 flex items-center justify-center min-h-[160px]">
              <LogoMetan variant="full" size="sm" isDark={isDark} />
            </div>

            <div className="w-full pt-4 border-t border-stone-200 dark:border-stone-800 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-800 dark:text-rose-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>San José de Metán</span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                25 de Mayo 180 • Cobertura Río Piedras, El Galpón, Rosario de la Frontera y Ruta 9/34.
              </p>
            </div>

            <div className={`mt-4 w-full py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              selectedBranchId === 'metan'
                ? 'bg-rose-800 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}>
              <span>Ver información y guardia</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

        {/* Detailed Selected Branch Info Panel */}
        <div className={`rounded-3xl border ${
          isDark ? 'bg-stone-850 border-stone-800' : 'bg-white border-stone-200 shadow-xl'
        } p-6 sm:p-10 transition-all duration-300`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Brand Emblem & Quick Details */}
            <div className="lg:col-span-5 flex flex-col items-center text-center p-6 rounded-2xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
              <UnifiedCompanyLogo
                brand={currentBranch.id}
                variant="full"
                size="md"
                isDark={isDark}
              />

              <div className="mt-6 w-full space-y-2.5 text-xs text-left">
                <div className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                  <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900 dark:text-stone-100 font-semibold">{currentBranch.address}</strong>
                    <span>{currentBranch.city} ({currentBranch.department})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Guardia Fúnebre: <strong>Atención 24 Horas los 365 Días</strong></span>
                </div>
              </div>
            </div>

            {/* Right: Branch Specifics, Services and Direct Contact Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-block mb-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${currentBranch.badgeBg}`}>
                    {currentBranch.categoryTag}
                  </span>
                </div>
                <h3 className={`text-2xl sm:text-3xl font-serif font-bold ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
                  {currentBranch.brandName}
                </h3>
                <p className={`mt-2 text-xs sm:text-sm ${isDark ? 'text-stone-300' : 'text-stone-600'} leading-relaxed font-light`}>
                  {currentBranch.description}
                </p>
              </div>

              {/* Coverage & Services Bullet Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
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

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                  <span className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] block">
                    Servicios e Infraestructura:
                  </span>
                  <ul className="space-y-1.5 text-stone-600 dark:text-stone-300">
                    {currentBranch.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons for this specific branch */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={`tel:${currentBranch.phoneMobile.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Llamar Guardia {currentBranch.city}: {currentBranch.phoneMobile}</span>
                </a>

                <a
                  href={currentBranch.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Directo</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
