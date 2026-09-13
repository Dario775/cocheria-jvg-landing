import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Menu, X, Sun, Moon, Flame, FileText } from 'lucide-react';
import { EMERGENCY_INFO } from '../data/mockData';
import { EmblemIcon } from './logos/CompanyLogos';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  fontSize?: 'normal' | 'large' | 'xlarge';
  onChangeFontSize?: (size: 'normal' | 'large' | 'xlarge') => void;
  activeObituariesCount: number;
  onOpenBereavementGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  activeObituariesCount,
  onOpenBereavementGuide
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'sucursales', label: 'Sedes' },
    { id: 'servicios', label: 'Servicios' },
    { 
      id: 'obituario', 
      label: 'Obituario',
      badge: activeObituariesCount > 0 ? `${activeObituariesCount} en sala` : undefined
    },
    { id: 'galeria', label: 'Instalaciones' },
    { id: 'testimonios', label: 'Testimonios' },
    { id: 'preguntas', label: 'Preguntas' },
    { id: 'contacto', label: 'Contacto' }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full select-none transition-all duration-300">
      {/* ── BARRA ÚNICA DE NAVEGACIÓN (Clean, Glassmorphic & Modern) ── */}
      <nav className={`${
        isDark 
          ? isScrolled ? 'bg-stone-950/95 border-stone-850 shadow-2xl shadow-black/60' : 'bg-stone-950/90 border-stone-900' 
          : isScrolled ? 'bg-white/95 border-stone-200 shadow-xl shadow-stone-900/10' : 'bg-white/90 border-stone-200'
      } backdrop-blur-xl border-b transition-all duration-300 py-3 sm:py-3.5`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Main Brand Logo */}
          <button
            onClick={() => handleNavClick('inicio')}
            className="flex items-center gap-2.5 sm:gap-3.5 text-left group focus:outline-none flex-shrink-0 cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-600/25 via-amber-500/10 to-transparent border-2 border-amber-600/40 flex items-center justify-center transition-transform group-hover:scale-105 shadow-md flex-shrink-0">
              <EmblemIcon primaryColor="#D97706" className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow" />
            </div>

            <div>
              <span className="font-brand-title text-base sm:text-xl font-black tracking-tight leading-none text-stone-900 dark:text-stone-50 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors block">
                COCHERÍA J.V. GONZÁLEZ
              </span>
              <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mt-0.5">
                Servicios Sociales & Fúnebres
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-1.5 text-xs 2xl:text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? isDark 
                        ? 'text-amber-300 bg-amber-950/60 border border-amber-600/50 shadow-md shadow-amber-950/40' 
                        : 'text-amber-950 bg-amber-100 border border-amber-400 shadow-sm'
                      : isDark
                        ? 'text-stone-300 hover:text-white hover:bg-stone-900 border border-transparent'
                        : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100 border border-transparent'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-600 text-white shadow-xs animate-pulse">
                      <Flame className="w-2.5 h-2.5" />
                      <span>{item.badge}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop Right Actions: Guide + Theme + WhatsApp + 24hs Call */}
          <div className="hidden lg:flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {/* Quick Bereavement Guide Button */}
            {onOpenBereavementGuide && (
              <button
                onClick={onOpenBereavementGuide}
                className={`hidden 2xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-stone-900 hover:bg-stone-850 text-amber-300 border-stone-800 hover:border-amber-500/40' 
                    : 'bg-stone-100 hover:bg-amber-50 text-amber-900 border-stone-200 hover:border-amber-300'
                }`}
                title="Guía ante fallecimiento: ¿Qué hacer?"
              >
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>¿Qué hacer?</span>
              </button>
            )}

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-stone-900 hover:bg-stone-850 text-amber-400 border-stone-800 hover:border-amber-500/40' 
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200 hover:text-amber-700'
              }`}
              title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              aria-label="Cambiar tema de color"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            {/* WhatsApp Urgent Direct Link */}
            <a
              href={EMERGENCY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs hover:scale-105 cursor-pointer"
              title="Escribir por WhatsApp Urgencias"
              aria-label="WhatsApp Urgencias"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Main 24hs Emergency Button */}
            <a
              href={`tel:${EMERGENCY_INFO.phoneEmergencyMobile.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-500 text-white font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-amber-900/30 transition-all border border-amber-500/40 hover:scale-105 flex-shrink-0"
              title="Llamar a guardia de urgencias las 24 horas"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Guardia 24hs</span>
            </a>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Theme Toggle Button for Mobile */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-stone-900 text-amber-400 border-stone-800' 
                  : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}
              title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              aria-label="Cambiar tema de color"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            {/* Direct Emergency Call Button for Mobile */}
            <a
              href={`tel:${EMERGENCY_INFO.phoneEmergencyMobile.replace(/\s+/g, '')}`}
              className="p-2 bg-amber-700 hover:bg-amber-600 text-white rounded-xl shadow-md cursor-pointer"
              title="Llamada de urgencia 24hs"
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl focus:outline-none transition-all cursor-pointer ${
                isDark 
                  ? 'text-stone-200 hover:text-white bg-stone-900 border border-stone-800' 
                  : 'text-stone-800 hover:text-stone-950 bg-stone-100 border border-stone-300'
              }`}
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-down Drawer Menu */}
        {mobileMenuOpen && (
          <div className={`xl:hidden ${
            isDark ? 'bg-stone-950 border-stone-850' : 'bg-white border-stone-200'
          } border-b px-4 pt-4 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top-3 duration-200`}>
            
            {/* Quick Links Grid */}
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between p-3 rounded-xl text-sm font-bold text-left transition-all cursor-pointer ${
                      isActive
                        ? isDark 
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-600/60 shadow-xs' 
                          : 'bg-amber-100 text-amber-950 border border-amber-400 shadow-xs'
                        : isDark
                          ? 'bg-stone-900 text-stone-300 hover:bg-stone-850 border border-stone-800'
                          : 'bg-stone-50 text-stone-800 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-red-600 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Action Buttons */}
            <div className="pt-3 border-t border-stone-800/80 space-y-2.5">
              {onOpenBereavementGuide && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBereavementGuide();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-amber-950/70 text-amber-300 border border-amber-800/60 hover:bg-amber-900/80 transition-colors shadow-sm cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Guía Familiar: ¿Qué hacer ante un duelo?</span>
                </button>
              )}

              <a
                href={`tel:${EMERGENCY_INFO.phoneEmergencyMobile.replace(/\s+/g, '')}`}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-extrabold bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-lg shadow-amber-950/40 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Llamar a Guardia 24hs ({EMERGENCY_INFO.phoneGuard24})</span>
              </a>

              <a
                href={EMERGENCY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-extrabold bg-emerald-700 hover:bg-emerald-600 text-white shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Escribir por WhatsApp Urgente</span>
              </a>
            </div>

          </div>
        )}
      </nav>
    </header>
  );
};
