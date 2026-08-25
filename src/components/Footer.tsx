import React from 'react';
import { Phone, MessageCircle, MapPin, Mail, Clock, Heart, Shield, Facebook, Instagram, Youtube, ArrowUp, Building2 } from 'lucide-react';
import { EMERGENCY_INFO, GROUP_BRANCHES } from '../data/mockData';
import { EmblemIcon, LogoJVGonzalez, LogoGuemes, LogoMetan, UnifiedCompanyLogo } from './logos/CompanyLogos';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { isDark } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`${
      isDark ? 'bg-stone-950 text-stone-300 border-stone-800' : 'bg-stone-900 text-stone-300 border-stone-800'
    } border-t pt-16 pb-12 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 3-Brand Emblem Showcase in Footer */}
        <div className="mb-12 pb-10 border-b border-stone-800">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold flex items-center justify-center gap-1.5 mb-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Red Regional Salteña de Servicios Sociales & Fúnebres
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
              Nuestras 3 Empresas y Sedes Oficiales
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Brand 1: J.V. González */}
            <div 
              onClick={() => onNavigate('sucursales')}
              className="cursor-pointer p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-sky-500/50 hover:bg-stone-850 transition-all flex flex-col items-center text-center group"
            >
              <div className="py-2">
                <LogoJVGonzalez variant="compact" size="xs" isDark={true} />
              </div>
              <div className="mt-3 pt-3 border-t border-stone-800 w-full text-xs text-stone-400">
                <strong className="block text-stone-200">Casa Central • J.V. González</strong>
                <span>Av. General Güemes 450 • Anta</span>
              </div>
            </div>

            {/* Brand 2: Güemes */}
            <div 
              onClick={() => onNavigate('sucursales')}
              className="cursor-pointer p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-stone-400/50 hover:bg-stone-850 transition-all flex flex-col items-center text-center group"
            >
              <div className="py-2">
                <LogoGuemes variant="compact" size="xs" isDark={true} />
              </div>
              <div className="mt-3 pt-3 border-t border-stone-800 w-full text-xs text-stone-400">
                <strong className="block text-stone-200">Servicios Sociales Güemes</strong>
                <span>Alberdi 320 • Valle de Siancas</span>
              </div>
            </div>

            {/* Brand 3: Metán */}
            <div 
              onClick={() => onNavigate('sucursales')}
              className="cursor-pointer p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-rose-500/50 hover:bg-stone-850 transition-all flex flex-col items-center text-center group"
            >
              <div className="py-2">
                <LogoMetan variant="compact" size="xs" isDark={true} />
              </div>
              <div className="mt-3 pt-3 border-t border-stone-800 w-full text-xs text-stone-400">
                <strong className="block text-stone-200">Cochería Metán</strong>
                <span>25 de Mayo 180 • San José de Metán</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: Brand & Dignified Mission */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                <EmblemIcon primaryColor="#1B4D75" className="w-10 h-10 drop-shadow" />
              </div>
              <div>
                <span className="block font-serif text-base font-bold tracking-wider text-amber-100">
                  COCHERÍA J.V. GONZÁLEZ
                </span>
                <span className="block text-[10px] tracking-widest text-stone-400 uppercase">
                  Servicios Fúnebres & Sepelios • Desde 1982
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Más de 4 décadas de trayectoria acompañando a las familias de Joaquín V. González, el Departamento Anta y toda la provincia de Salta con inquebrantable respeto, solemnidad y calidez humana.
            </p>

            {/* Social Media Channels for Digital Visibility */}
            <div className="pt-2">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block mb-2 font-semibold">
                Nuestras Redes & Memoria Digital:
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href={EMERGENCY_INFO.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-amber-900/60 border border-stone-800 hover:border-amber-700 flex items-center justify-center text-stone-300 hover:text-amber-200 transition-colors"
                  aria-label="Facebook institucional"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={EMERGENCY_INFO.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-amber-900/60 border border-stone-800 hover:border-amber-700 flex items-center justify-center text-stone-300 hover:text-amber-200 transition-colors"
                  aria-label="Instagram institucional"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={EMERGENCY_INFO.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-emerald-900/60 border border-stone-800 hover:border-emerald-750 flex items-center justify-center text-stone-300 hover:text-emerald-300 transition-colors"
                  aria-label="WhatsApp directo"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href={EMERGENCY_INFO.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-red-900/60 border border-stone-800 hover:border-red-700 flex items-center justify-center text-stone-300 hover:text-red-300 transition-colors"
                  aria-label="YouTube Memoriales"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm text-stone-100 uppercase tracking-wider">
              Acceso Rápido
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('inicio')} className="hover:text-amber-300 transition-colors">
                  Inicio & Asistencia 24hs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sucursales')} className="hover:text-amber-300 transition-colors font-semibold text-amber-400">
                  Nuestras 3 Sedes (Anta, Güemes, Metán)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('servicios')} className="hover:text-amber-300 transition-colors">
                  Servicios de Sepelio & Cremación
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('obituario')} className="hover:text-amber-300 transition-colors">
                  Obituario Digital & Homenajes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cotizador')} className="hover:text-amber-300 transition-colors">
                  Presupuesto Rápido Online
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('galeria')} className="hover:text-amber-300 transition-colors">
                  Instalaciones & Capillas Ardientes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('preguntas')} className="hover:text-amber-300 transition-colors">
                  Preguntas Frecuentes & PAMI
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contacto')} className="hover:text-amber-300 transition-colors">
                  Ubicación & Casa Central
                </button>
              </li>
              <li className="pt-1.5 border-t border-stone-800/80">
                <a 
                  href={import.meta.env.VITE_CRM_URL || 'http://localhost:3000'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <span>→ Portal de Gestión & CRM</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Coverage Areas */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-stone-100 uppercase tracking-wider">
              Área de Cobertura
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>• Joaquín V. González</li>
              <li>• General Güemes</li>
              <li>• San José de Metán</li>
              <li>• Las Lajitas & El Quebrachal</li>
              <li>• Gaona & Tolloche</li>
              <li>• Rosario de la Frontera</li>
              <li>• Salta Capital & Todo el País</li>
            </ul>
          </div>

          {/* Col 4: Emergency Contacts */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-amber-400" />
              Guardia Permanente
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400 block">Celular Guardia Urgente:</span>
                <a
                  href={`tel:${EMERGENCY_INFO.phoneEmergencyMobile.replace(/\s+/g, '')}`}
                  className="font-bold text-sm text-amber-300 hover:underline block"
                >
                  {EMERGENCY_INFO.phoneEmergencyMobile}
                </a>
              </div>

              <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400 block">Teléfono Fijo Central:</span>
                <a
                  href={`tel:${EMERGENCY_INFO.phoneGuard24.replace(/\s+/g, '')}`}
                  className="font-semibold text-stone-200 hover:underline block"
                >
                  {EMERGENCY_INFO.phoneGuard24}
                </a>
              </div>

              <div className="text-[11px] text-stone-400 pt-1">
                <MapPin className="w-3.5 h-3.5 inline mr-1 text-stone-500" />
                {EMERGENCY_INFO.address}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} Cochería J.V. González. Todos los derechos reservados. Servicios Fúnebres y Sepelios.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-stone-400 hover:text-amber-300 transition-colors"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};

