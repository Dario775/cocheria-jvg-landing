import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, MapPin, Menu, X, Sun, Moon, Building2, ChevronDown, LogIn } from 'lucide-react';
import { EMERGENCY_INFO, GROUP_BRANCHES } from '../data/mockData';
import { EmblemIcon, LogoJVGonzalez, UnifiedCompanyLogo } from './logos/CompanyLogos';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  activeObituariesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  fontSize,
  onChangeFontSize,
  activeObituariesCount
}) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'sucursales', label: 'Nuestras 3 Sedes', badge: 'Red Salta' },
    { id: 'servicios', label: 'Servicios' },
    { 
      id: 'obituario', 
      label: 'Obituario Digital',
      badge: activeObituariesCount > 0 ? `${activeObituariesCount} en sala` : undefined
    },
    { id: 'cotizador', label: 'Presupuesto' },
    { id: 'galeria', label: 'Instalaciones' },
    { id: 'testimonios', label: 'Testimonios' },
    { id: 'preguntas', label: 'Preguntas' },
    { id: 'contacto', label: 'Contacto' }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setBranchDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Emergency Topbar */}
      <div className={`${isDark ? 'bg-stone-900 text-stone-300 border-stone-800' : 'bg-stone-100 text-stone-700 border-stone-250'} text-xs sm:text-sm border-b py-1.5 px-4 sm:px-6 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Emergency 24/7 Status Indicator */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className={`flex items-center gap-1.5 ${isDark ? 'bg-amber-950/70 border-amber-800/60 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900'} border font-medium px-2.5 py-0.5 rounded-full text-xs`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
              </span>
              Guardia 24/7 Permanente
            </div>
            <span className={`hidden md:inline-flex items-center gap-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              Joaquín V. González, Salta
            </span>
          </div>

          {/* Quick Contact & Accessibility tools */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Font size selector for accessibility */}
            <div className={`hidden sm:flex items-center gap-1 ${isDark ? 'bg-stone-800/80 text-stone-300 border-stone-700' : 'bg-stone-200/80 text-stone-800 border-stone-300'} px-2 py-0.5 rounded text-xs border`}>
              <span className={`${isDark ? 'text-stone-400' : 'text-stone-600'} mr-1 text-[11px]`}>Texto:</span>
              <button
                onClick={() => onChangeFontSize('normal')}
                className={`px-1.5 py-0.5 rounded font-semibold transition-colors ${
                  fontSize === 'normal' 
                    ? isDark ? 'bg-stone-600 text-white' : 'bg-white text-stone-900 shadow-xs' 
                    : isDark ? 'hover:text-white' : 'hover:text-stone-950'
                }`}
                title="Tamaño normal"
              >
                A
              </button>
              <button
                onClick={() => onChangeFontSize('large')}
                className={`px-1.5 py-0.5 rounded font-bold text-sm transition-colors ${
                  fontSize === 'large' 
                    ? isDark ? 'bg-stone-600 text-white' : 'bg-white text-stone-900 shadow-xs' 
                    : isDark ? 'hover:text-white' : 'hover:text-stone-950'
                }`}
                title="Tamaño grande"
              >
                A+
              </button>
              <button
                onClick={() => onChangeFontSize('xlarge')}
                className={`px-1.5 py-0.5 rounded font-extrabold text-base transition-colors ${
                  fontSize === 'xlarge' 
                    ? isDark ? 'bg-stone-600 text-white' : 'bg-white text-stone-900 shadow-xs' 
                    : isDark ? 'hover:text-white' : 'hover:text-stone-950'
                }`}
                title="Tamaño extra grande"
              >
                A++
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                isDark 
                  ? 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700' 
                  : 'bg-white hover:bg-stone-100 text-amber-900 border border-stone-300 shadow-xs'
              }`}
              title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              aria-label="Alternar modo claro y oscuro"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-800" />
                  <span className="hidden sm:inline">Modo Oscuro</span>
                </>
              )}
            </button>

            {/* Direct Phone */}
            <a
              href={`tel:${EMERGENCY_INFO.phoneGuard24.replace(/\s+/g, '')}`}
              className={`flex items-center gap-1.5 ${isDark ? 'text-amber-300 hover:text-amber-200' : 'text-amber-800 hover:text-amber-900'} font-semibold transition-colors`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Guardia: {EMERGENCY_INFO.phoneGuard24}</span>
              <span className="sm:hidden">{EMERGENCY_INFO.phoneGuard24}</span>
            </a>

            {/* WhatsApp link */}
            <a
              href={EMERGENCY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-0.5 rounded-full font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
              <span>WhatsApp Urgente</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`${
        isDark 
          ? 'bg-stone-950/95 text-stone-100 border-stone-800' 
          : 'bg-white/95 text-stone-900 border-stone-200'
      } backdrop-blur-md border-b transition-all ${isScrolled ? 'shadow-lg py-2.5' : 'py-3'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo with authentic gothic arch & cross emblem */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavClick('inicio')}
              className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
                <EmblemIcon primaryColor="#1B4D75" className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow" />
              </div>
              <div>
                <span className="block text-[9px] sm:text-[10px] tracking-[0.28em] font-serif italic font-semibold text-sky-800 dark:text-sky-400 uppercase">
                  C O C H E R Í A
                </span>
                <span className={`block font-serif text-base sm:text-xl font-black tracking-wide leading-none ${
                  isDark ? 'text-stone-100 group-hover:text-amber-200' : 'text-sky-950 group-hover:text-amber-900'
                } transition-colors`}>
                  J.V. GONZALEZ
                </span>
                <span className={`block text-[9px] tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-500'} uppercase font-light mt-0.5`}>
                  Sepelios • Dpto. Anta, Salta
                </span>
              </div>
            </button>

            {/* Quick 3-Brand Indicator Pill */}
            <div className="relative hidden 2xl:block">
              <button
                onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                  isDark ? 'bg-stone-900 border-stone-750 text-stone-300 hover:border-amber-600' : 'bg-stone-100 border-stone-300 text-stone-700 hover:border-amber-600'
                }`}
              >
                <Building2 className="w-3 h-3 text-amber-600" />
                <span>3 Sedes: Anta • Güemes • Metán</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${branchDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Branch quick dropdown */}
              {branchDropdownOpen && (
                <div className={`absolute top-full left-0 mt-2 w-72 rounded-xl shadow-2xl border p-2 z-50 animate-in fade-in ${
                  isDark ? 'bg-stone-900 border-stone-750 text-stone-200' : 'bg-white border-stone-200 text-stone-900'
                }`}>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-800/50 mb-1">
                    Red de Cocherías del Grupo
                  </div>
                  {GROUP_BRANCHES.map(branch => (
                    <button
                      key={branch.id}
                      onClick={() => handleNavClick('sucursales')}
                      className={`w-full text-left p-2 rounded-lg flex items-center gap-2.5 transition-colors ${
                        isDark ? 'hover:bg-stone-800' : 'hover:bg-stone-100'
                      }`}
                    >
                      <UnifiedCompanyLogo brand={branch.id} variant="emblem" size="xs" />
                      <div>
                        <div className="font-bold text-xs">{branch.brandName}</div>
                        <div className="text-[10px] text-stone-400">{branch.city} • {branch.phoneGuard}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-all duration-200 ${
                    isActive
                      ? isDark 
                        ? 'text-amber-200 bg-stone-800/90 shadow-sm' 
                        : 'text-amber-900 bg-amber-100/70 font-semibold shadow-xs'
                      : isDark
                        ? 'text-stone-300 hover:text-white hover:bg-stone-850'
                        : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className={`${
                        isDark ? 'bg-amber-600/90 text-stone-950' : 'bg-amber-700 text-white'
                      } font-bold text-[10px] px-1.5 py-0.2 rounded-full animate-pulse`}>
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Direct Emergency Call Button & CRM Access */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href={import.meta.env.VITE_CRM_URL || 'http://localhost:3000'}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all ${
                isDark 
                  ? 'bg-stone-900 hover:bg-stone-800 text-amber-300 border-stone-700 hover:border-amber-500/60 shadow-xs' 
                  : 'bg-stone-100 hover:bg-stone-200 text-amber-950 border-stone-300 shadow-xs'
              }`}
              title="Acceso al Sistema CRM y Gestión de Afiliados"
            >
              <LogIn className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Acceso CRM</span>
            </a>

            <a
              href={`tel:${EMERGENCY_INFO.phoneEmergencyMobile.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-stone-50 font-semibold px-4 py-2 rounded-lg text-xs sm:text-sm shadow-md hover:shadow-amber-900/30 transition-all border border-amber-600/40"
            >
              <Phone className="w-4 h-4 animate-bounce text-amber-200" />
              <span>Asistencia Inmediata</span>
            </a>
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                isDark ? 'bg-stone-800 text-amber-300' : 'bg-stone-100 text-amber-800 border border-stone-200'
              }`}
              title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
              aria-label="Alternar modo de color"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a
              href={`tel:${EMERGENCY_INFO.phoneEmergencyMobile.replace(/\s+/g, '')}`}
              className="p-2 bg-amber-700 hover:bg-amber-600 text-stone-50 rounded-lg"
              title="Llamar a la guardia"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg focus:outline-none ${
                isDark 
                  ? 'text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700' 
                  : 'text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200'
              }`}
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className={`xl:hidden ${
            isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
          } border-b px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200`}>
            
            {/* Theme and Font size controls for mobile */}
            <div className={`flex justify-between items-center ${isDark ? 'bg-stone-800/80' : 'bg-stone-100'} p-2.5 rounded-lg`}>
              <span className={`text-xs ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>Tema y Accesibilidad:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium flex items-center gap-1 ${
                    isDark ? 'bg-stone-700 text-amber-300' : 'bg-white text-amber-900 border border-stone-300'
                  }`}
                >
                  {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{isDark ? 'Claro' : 'Oscuro'}</span>
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => onChangeFontSize('normal')}
                    className={`px-2 py-0.5 text-xs rounded ${fontSize === 'normal' ? 'bg-amber-700 text-white font-bold' : isDark ? 'bg-stone-700 text-stone-200' : 'bg-stone-200 text-stone-800'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => onChangeFontSize('large')}
                    className={`px-2 py-0.5 text-xs rounded ${fontSize === 'large' ? 'bg-amber-700 text-white font-bold' : isDark ? 'bg-stone-700 text-stone-200' : 'bg-stone-200 text-stone-800'}`}
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                    activeSection === item.id
                      ? isDark 
                        ? 'bg-amber-900/40 text-amber-200 font-semibold border-l-4 border-amber-500' 
                        : 'bg-amber-100 text-amber-900 font-semibold border-l-4 border-amber-600'
                      : isDark
                        ? 'text-stone-300 hover:bg-stone-800'
                        : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`${isDark ? 'bg-amber-600 text-stone-950' : 'bg-amber-700 text-white'} text-[11px] font-bold px-2 py-0.5 rounded-full`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Action Buttons */}
            <div className={`pt-3 border-t ${isDark ? 'border-stone-800' : 'border-stone-200'} space-y-2`}>
              <a
                href={import.meta.env.VITE_CRM_URL || 'http://localhost:3000'}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                  isDark 
                    ? 'bg-stone-800 hover:bg-stone-750 text-amber-300 border-stone-700' 
                    : 'bg-stone-100 hover:bg-stone-200 text-amber-950 border-stone-300'
                }`}
              >
                <LogIn className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Acceso al Portal CRM
              </a>
              <a
                href={`tel:${EMERGENCY_INFO.phoneEmergencyMobile.replace(/\s+/g, '')}`}
                className="w-full flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg text-sm shadow-md"
              >
                <Phone className="w-4 h-4" />
                Llamar Guardia Urgente (24 Horas)
              </a>
              <a
                href={EMERGENCY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg text-sm shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
