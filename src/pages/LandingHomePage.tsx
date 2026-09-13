import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Obituary, CondolenceMessage, MemorialTribute, WakeService } from '../types';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { RegionalBranchesSection } from '../components/RegionalBranchesSection';
import { DigitalObituary } from '../components/DigitalObituary';
import { ServicesSection } from '../components/ServicesSection';
import { InstitutionalGallery } from '../components/InstitutionalGallery';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FaqSection } from '../components/FaqSection';
import { LocationAndContact } from '../components/LocationAndContact';
import { Footer } from '../components/Footer';
import { FloatingEmergencyButton } from '../components/FloatingEmergencyButton';
import { BereavementGuideModal } from '../components/BereavementGuideModal';
import { ParallaxQuoteSection } from '../components/effects/ParallaxQuoteSection';
import { useTheme } from '../context/ThemeContext';
import { useWakeServices } from '../context/WakeServicesContext';

// Mapeador inteligente de Velatorio (Supabase) a Obituario Digital
const mapWakeToObituary = (wake: WakeService, moderation: any[] = []): Obituary => {
  const isEnVelacion = wake.status === 'en_vivo' || wake.status === 'preparacion';
  
  const wakeApprovedCondolences = moderation
    .filter(m => m.wakeId === wake.id && m.status === 'aprobado')
    .map(m => ({
      id: m.id,
      author: m.senderName,
      relationship: m.senderCity || 'Comunidad y allegados',
      message: m.message,
      timestamp: m.timestamp,
      candleLit: m.tributeType === 'candle',
      floralTribute: m.tributeType === 'flower' ? 'Ofrenda floral' : undefined
    }));

  const wakeApprovedTributes = moderation
    .filter(m => m.wakeId === wake.id && m.status === 'aprobado')
    .map(m => ({
      id: `trib-${m.id}`,
      type: (m.tributeType as 'candle' | 'flower' | 'prayer' | 'heart') || 'candle',
      author: m.senderName,
      timestamp: m.timestamp
    }));

  const totalCandles = Math.max(
    wake.candlesCount || 0,
    wakeApprovedCondolences.filter(c => c.candleLit).length
  );

  return {
    id: wake.id,
    fullName: wake.deceasedName,
    epitaph: wake.epitaph || 'Su recuerdo y amor vivirán por siempre en nuestros corazones.',
    birthDate: wake.birthYear ? `Año ${wake.birthYear}` : '---',
    passedDate: wake.passedYear ? `${wake.passedYear}` : `${new Date().getFullYear()}`,
    age: wake.age || 0,
    photoUrl: wake.photoUrl || '',
    biography: wake.epitaph 
      ? `Homenaje en memoria de ${wake.deceasedName}. "${wake.epitaph}". Acompañamos a su familia en este momento de conmemoración y recogimiento.`
      : `Servicio memorial de ${wake.deceasedName} a cargo de Cochería J.V. González en ${wake.chapelRoom} (${wake.branchName}). Acompañamos con profundo respeto y estima a sus seres queridos.`,
    familyMembers: ['Familiares, deudos y allegados'],
    status: isEnVelacion ? 'en_velacion' : 'inhumado',
    funeralService: {
      chapelRoom: `${wake.chapelRoom} • ${wake.branchName}`,
      wakeDate: isEnVelacion ? 'Capilla Ardiente en Curso' : 'Servicio Concluido',
      wakeHours: isEnVelacion ? 'Guardia y acompañamiento permanente 24hs' : 'Cortejo realizado',
      massDetails: 'Misa y responso en capilla',
      processionTime: wake.cortegeTime || 'A coordinar por la familia',
      cemeteryOrCrematory: 'Cementerio Parque de la Paz',
      locationAddress: wake.branchName
    },
    candlesCount: totalCandles,
    condolences: wakeApprovedCondolences,
    tributes: wakeApprovedTributes
  };
};

export const LandingHomePage: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { wakeServices, moderationQueue, addCondolenceToQueue, lightWakeCandle } = useWakeServices();
  const [activeSection, setActiveSection] = useState('inicio');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Limpiar cualquier residuo de datos mock previamente cacheados en localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('cocheria_jvg_obituaries');
    } catch (e) {
      console.warn('Error al limpiar caché local de obituarios', e);
    }
  }, []);

  // Obituarios 100% dinámicos en tiempo real desde Supabase (wake_services + wake_condolences)
  const dynamicObituaries = useMemo(() => {
    return wakeServices.map(w => mapWakeToObituary(w, moderationQueue));
  }, [wakeServices, moderationQueue]);

  // Handle candle lighting (sincronizado directamente con Supabase)
  const handleLightCandle = (obituaryId: string, authorName = 'Un allegado') => {
    lightWakeCandle(obituaryId);
    addCondolenceToQueue({
      wakeId: obituaryId,
      senderName: authorName,
      senderCity: 'Comunidad',
      message: '🕯️ Ha encendido una vela en memoria del homenajeado.',
      tributeType: 'candle'
    });
  };

  // Handle adding condolence (sincronizado directamente con Supabase)
  const handleAddCondolence = (obituaryId: string, condolence: Omit<CondolenceMessage, 'id' | 'timestamp'>) => {
    addCondolenceToQueue({
      wakeId: obituaryId,
      senderName: condolence.author,
      senderCity: condolence.relationship || 'Comunidad',
      message: condolence.message,
      tributeType: condolence.candleLit ? 'candle' : 'prayer'
    });
    if (condolence.candleLit) {
      lightWakeCandle(obituaryId);
    }
  };

  // Handle adding symbolic tribute (flower, prayer, heart - sincronizado con Supabase)
  const handleAddTribute = (obituaryId: string, tribute: Omit<MemorialTribute, 'id' | 'timestamp'>) => {
    const typeLabels: Record<string, string> = {
      candle: '🕯️ Encendió una vela en su memoria',
      flower: '🌸 Ofrendó flores en su memoria',
      prayer: '🙏 Elevó una oración por su eterno descanso',
      heart: '❤️ Envió un homenaje de cariño'
    };
    addCondolenceToQueue({
      wakeId: obituaryId,
      senderName: tribute.author,
      senderCity: 'Comunidad',
      message: typeLabels[tribute.type] || 'Ofrendó un tributo conmemorativo',
      tributeType: tribute.type
    });
    if (tribute.type === 'candle') {
      lightWakeCandle(obituaryId);
    }
  };

  // Smooth navigation handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      const navOffset = 80;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Scroll listener to update active navbar section
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = ['inicio', 'sucursales', 'servicios', 'obituario', 'galeria', 'testimonios', 'preguntas', 'contacto'];
      const scrollPos = window.scrollY + 200;

      for (const sec of sections) {
        if (sec === 'inicio' && window.scrollY < 300) {
          setActiveSection('inicio');
          break;
        }
        const elem = document.getElementById(sec);
        if (elem) {
          const top = elem.offsetTop;
          const height = elem.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  const activeObituariesCount = dynamicObituaries.filter(o => o.status === 'en_velacion').length;

  // Font size modifier classes
  const fontSizeClasses = {
    normal: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  }[fontSize];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-stone-950 text-stone-100' : 'bg-stone-50 text-stone-900'} ${fontSizeClasses} font-sans selection:bg-amber-600 selection:text-white transition-colors duration-300`}>
      
      {/* Top Main Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        activeObituariesCount={activeObituariesCount}
        onOpenBereavementGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Sections Body */}
      <main>
        <div id="inicio">
          <Hero
            onNavigate={handleNavigate}
            onOpenBereavementGuide={() => setIsGuideOpen(true)}
          />
        </div>

        <RegionalBranchesSection onContactClick={handleNavigate} />

        <ServicesSection />

        <ParallaxQuoteSection />

        <DigitalObituary
          obituaries={dynamicObituaries}
          onLightCandle={handleLightCandle}
          onAddCondolence={handleAddCondolence}
          onAddTribute={handleAddTribute}
        />

        <InstitutionalGallery />

        <TestimonialsSection />

        <FaqSection />

        <LocationAndContact />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating 24/7 Emergency Assistance Widget */}
      <FloatingEmergencyButton
        onOpenQuickGuide={() => setIsGuideOpen(true)}
      />

      {/* Bereavement 3-Step Guide Modal */}
      <BereavementGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
};
