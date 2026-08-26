import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, MapPin, Menu, X, Sun, Moon, Flame } from 'lucide-react';
import { EMERGENCY_INFO } from '../data/mockData';
import { EmblemIcon } from './logos/CompanyLogos';
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
      
      {/* ── TOP UTILITY BAR (Modern, High Contrast & Very Readable) ── */}
      <div className={`${
        isDark 
          ? 'bg-stone-950 text-stone-200 border-stone-850' 
          : 'bg-stone-900 text-stone-100 border-stone-800'
      } border-b py-2 px-4 sm:px-8 text-xs sm:text-sm font-sans transition-colors duration-200 shadow-sm`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: 24/7 Status Badge & Regional Presence */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold px-3 py-1 rounded-full text-xs shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
              </span>
              <span>Guardia 24hs Permanente</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-stone-300 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Sedes: J.V. González • Gral. Güemes • San José de Metán</span>
            </div>
          </div>

          {/* Right: Direct Contacts, Font Sizer & Theme Toggle */}
          <div className="flex items-center gap-3 sm:gap-5">
            
            {/* Font Size Accessibility Pill */}
            <div className="hidden lg:flex items-center gap-1 bg-stone-800/90 px-2.5 py-1 rounded-lg border border-stone-700 text-xs font-semibold">
              <span className="text-stone-400 mr-1">Fuente:</span>
              <button
                onClick={() => onChangeFontSize('normal')}
                className={`px-2 py-0.5 rounded transition-all ${
                  fontSize === 'normal' ? 'bg-amber-600 text-white font-bold shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
                title="Tamaño normal"
              >
                A
              </button>
              <button
                onClick={() => onChangeFontSize('large')}
                className={`px-2 py-0.5 rounded transition-all ${
                  fontSize === 'large' ? 'bg-amber-600 text-white font-bold shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
                title="Tamaño grande"
              >
                A+
              </button>
            </div>

            {/* Dark / Light Mode Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-750 text-amber-300 border border-stone-700 transition-all hover:scale-105"
              title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Modo Oscuro</span>
                </>
              )}
            </button>

            {/* Phone Direct Link */}
            <a
              href={`tel:${EMERGENCY_INFO.phoneGuard24.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-stone-100 hover:text-amber-300 font-bold transition-colors text-xs sm:text-sm font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{EMERGENCY_INFO.phoneGuard24}</span>
            </a>

            {/* WhatsApp Urgent Direct Link */}
            <a
              href={EMERGENCY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg transition-all text-xs shadow-sm hover:scale-105"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Urgencias</span>
            </a>
          </div>

        </div>
      </div>

      {/* ── MAIN NAVBAR (Contemporary, Glassmorphic & Bold Luxury) ── */}
      <nav className={`${
        isDark 
          ? isScrolled ? 'bg-stone-950/95 border-stone-850 shadow-2xl shadow-black/60' : 'bg-stone-950/90 border-stone-900' 
          : isScrolled ? 'bg-white/95 border-stone-200 shadow-xl shadow-stone-900/10' : 'bg-white/90 border-stone-200'
      } backdrop-blur-xl border-b transition-all duration-300 ${isScrolled ? 'py-3' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Main Brand Logo - Bold, Modern & Impressive */}
          <button
            onClick={() => handleNavClick('inicio')}
            className="flex items-center gap-3 sm:gap-3.5 text-left group focus:outline-none flex-shrink-0"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-600/25 via-amber-500/10 to-transparent border-2 border-amber-600/40 flex items-center justify-center transition-transform group-hover:scale-105 shadow-md">
              <EmblemIcon primaryColor="#D97706" className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-brand-title text-lg sm:text-2xl font-black tracking-tight leading-none text-stone-900 dark:text-stone-50 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  COCHERA J.V. GONZÁLEZ
                </span>
              </div>
              <span className="block text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mt-1">
                Servicios Sociales & Fúnebres
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links - Comfortable font size & smooth pill highlight */}
          <div className="hidden xl:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 ${
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
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-red-600 text-white shadow-xs animate-pulse">
                      <Flame className="w-3 h-3" />
                      <span>{item.badge}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Button: 24hs Urgencia */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${EMERGENCY_INFO.phoneEmergencyMobile.replace(/\s+/g, '')}`}
              className="flex items-center gap-2.5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-amber-900/30 transition-all border border-amber-500/40 hover:scale-105"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              <span>Guardia 24hs</span>
            </a>
          </div>

          {/* Mobile Menu & Direct Call Toggle */}
          <div className="flex xl:hidden items-center gap-2.5">
            <a
              href={`tel:${EMERGENCY_INFO.phoneEmergencyMobile.replace(/\s+/g, '')}`}
              className="p-2.5 bg-amber-700 hover:bg-amber-600 text-white rounded-xl shadow-md"
              title="Llamada de urgencia 24hs"
            >
              <Phone className="w-5 h-5" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-xl focus:outline-none transition-all ${
                isDark 
                  ? 'text-stone-200 hover:text-white bg-stone-900 border border-stone-800' 
                  : 'text-stone-800 hover:text-stone-950 bg-stone-100 border border-stone-300'
              }`}
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                    className={`flex items-center justify-between p-3 rounded-xl text-sm font-bold text-left transition-all ${
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
              <a
                href={`tel:${EMERGENCY_INFO.phoneEmergencyMobile.replace(/\s+/g, '')}`}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-extrabold bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-lg shadow-amber-950/40"
              >
                <Phone className="w-4 h-4" />
                <span>Llamar a Guardia 24hs ({EMERGENCY_INFO.phoneGuard24})</span>
              </a>

              <a
                href={EMERGENCY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-extrabold bg-emerald-700 hover:bg-emerald-600 text-white shadow-md"
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
