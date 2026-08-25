import React, { useState, useEffect } from 'react';
import { OBITUARIES_DATA } from './data/mockData';
import { Obituary, CondolenceMessage, MemorialTribute } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RegionalBranchesSection } from './components/RegionalBranchesSection';
import { DigitalObituary } from './components/DigitalObituary';
import { BudgetCalculator } from './components/BudgetCalculator';
import { ServicesSection } from './components/ServicesSection';
import { InstitutionalGallery } from './components/InstitutionalGallery';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { LocationAndContact } from './components/LocationAndContact';
import { Footer } from './components/Footer';
import { FloatingEmergencyButton } from './components/FloatingEmergencyButton';
import { BereavementGuideModal } from './components/BereavementGuideModal';
import { ParallaxQuoteSection } from './components/effects/ParallaxQuoteSection';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('inicio');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Initialize obituaries with local storage caching for tributes and candles
  const [obituaries, setObituaries] = useState<Obituary[]>(() => {
    try {
      const saved = localStorage.getItem('cocheria_jvg_obituaries');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load cached obituaries', e);
    }
    return OBITUARIES_DATA;
  });

  // Save obituaries whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('cocheria_jvg_obituaries', JSON.stringify(obituaries));
    } catch (e) {
      console.error('Failed to save obituaries', e);
    }
  }, [obituaries]);

  // Handle candle lighting
  const handleLightCandle = (obituaryId: string, authorName = 'Un allegado') => {
    setObituaries(prev => prev.map(item => {
      if (item.id === obituaryId) {
        const newTribute: MemorialTribute = {
          id: `t-${Date.now()}`,
          type: 'candle',
          author: authorName,
          timestamp: 'Recientemente'
        };
        return {
          ...item,
          candlesCount: item.candlesCount + 1,
          tributes: [newTribute, ...item.tributes]
        };
      }
      return item;
    }));
  };

  // Handle adding condolence
  const handleAddCondolence = (obituaryId: string, condolence: Omit<CondolenceMessage, 'id' | 'timestamp'>) => {
    setObituaries(prev => prev.map(item => {
      if (item.id === obituaryId) {
        const newEntry: CondolenceMessage = {
          id: `c-${Date.now()}`,
          ...condolence,
          timestamp: 'Hace un momento'
        };

        const updatedCandles = condolence.candleLit ? item.candlesCount + 1 : item.candlesCount;
        const updatedTributes = condolence.candleLit ? [
          {
            id: `t-${Date.now()}`,
            type: 'candle' as const,
            author: condolence.author,
            timestamp: 'Hace un momento'
          },
          ...item.tributes
        ] : item.tributes;

        return {
          ...item,
          candlesCount: updatedCandles,
          condolences: [newEntry, ...item.condolences],
          tributes: updatedTributes
        };
      }
      return item;
    }));
  };

  // Handle adding symbolic tribute (flower, prayer, heart)
  const handleAddTribute = (obituaryId: string, tribute: Omit<MemorialTribute, 'id' | 'timestamp'>) => {
    setObituaries(prev => prev.map(item => {
      if (item.id === obituaryId) {
        const newTribute: MemorialTribute = {
          id: `t-${Date.now()}`,
          ...tribute,
          timestamp: 'Hace un momento'
        };
        return {
          ...item,
          tributes: [newTribute, ...item.tributes]
        };
      }
      return item;
    }));
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
      const sections = ['inicio', 'sucursales', 'servicios', 'obituario', 'cotizador', 'galeria', 'testimonios', 'preguntas', 'contacto'];
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

  const activeObituariesCount = obituaries.filter(o => o.status === 'en_velacion').length;

  // Font size modifier classes
  const fontSizeClasses = {
    normal: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  }[fontSize];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-stone-950 text-stone-100' : 'bg-stone-50 text-stone-900'} flex flex-col ${fontSizeClasses} transition-colors duration-300`}>
      
      {/* Top Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        activeObituariesCount={activeObituariesCount}
      />

      {/* Main Content */}
      <main className="flex-1">
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
          obituaries={obituaries}
          onLightCandle={handleLightCandle}
          onAddCondolence={handleAddCondolence}
          onAddTribute={handleAddTribute}
        />

        <BudgetCalculator />

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
}
