import React, { useState, useMemo } from 'react';
import { FAQ_ITEMS } from '../data/mockData';
import { HelpCircle, ChevronDown, Search, Phone, MessageCircle, FileQuestion } from 'lucide-react';
import { EMERGENCY_INFO } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export const FaqSection: React.FC = () => {
  const { isDark } = useTheme();
  const [openIndex, setOpenIndex] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'urgencias' | 'documentacion' | 'coberturas' | 'servicios' | 'prevision'>('all');

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, activeCategory]);

  const toggleFaq = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const categories = [
    { id: 'all', label: 'Todas las Preguntas' },
    { id: 'urgencias', label: 'Primeros Pasos / Urgencias' },
    { id: 'documentacion', label: 'Documentación Necesaria' },
    { id: 'coberturas', label: 'PAMI & Obras Sociales' },
    { id: 'servicios', label: 'Cremaciones & Traslados' },
    { id: 'prevision', label: 'Planes Familiares' }
  ];

  return (
    <section id="preguntas" className={`py-16 sm:py-24 ${
      isDark ? 'bg-stone-950 text-stone-100 border-stone-800' : 'bg-stone-100 text-stone-900 border-stone-200'
    } border-b transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${
            isDark ? 'bg-amber-950/70 border-amber-800/60 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900'
          } border text-xs font-semibold`}>
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Orientación & Respuestas Claras</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold font-serif ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
            Preguntas Frecuentes
          </h2>
          <p className={`${isDark ? 'text-stone-300' : 'text-stone-700'} text-sm sm:text-base font-light leading-relaxed`}>
            Resolvemos sus dudas sobre trámites legales, certificados médicos, cobertura de PAMI y pasos indispensables ante un duelo.
          </p>
        </div>

        {/* Search & Categories */}
        <div className="space-y-4 mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className={`w-4 h-4 ${isDark ? 'text-stone-400' : 'text-stone-500'} absolute left-3.5 top-1/2 -translate-y-1/2`} />
            <input
              type="text"
              placeholder="Buscar en preguntas (ej. PAMI, documentos, cremación)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${
                isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-stone-300 text-stone-900 shadow-xs'
              } border text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl focus:border-amber-600 focus:outline-none`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === c.id
                    ? 'bg-amber-700 text-white font-semibold'
                    : isDark ? 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800' : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-300 shadow-xs'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openIndex === faq.id;
            return (
              <div
                key={faq.id}
                className={`${
                  isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
                } rounded-2xl border overflow-hidden transition-all`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className={`w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 ${
                    isDark ? 'hover:bg-stone-850/60' : 'hover:bg-stone-50'
                  } transition-colors`}
                >
                  <span className={`font-serif font-semibold text-sm sm:text-base ${isDark ? 'text-stone-100' : 'text-stone-900'} pr-2`}>
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-full ${
                    isDark ? 'bg-stone-800 text-amber-400' : 'bg-stone-100 text-amber-800'
                  } transition-transform duration-200 ${isOpen ? 'rotate-180 bg-amber-950 text-amber-300' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className={`px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm ${
                    isDark ? 'text-stone-300 border-stone-800' : 'text-stone-700 border-stone-100'
                  } leading-relaxed border-t animate-in fade-in`}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help box */}
        <div className={`mt-10 p-6 rounded-2xl ${
          isDark ? 'bg-gradient-to-r from-stone-900 to-stone-850 border-amber-800/40' : 'bg-white border-amber-300 shadow-md'
        } border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left`}>
          <div>
            <h4 className={`font-serif font-bold text-base ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>¿Tiene una consulta particular o urgencia en este momento?</h4>
            <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'} mt-1`}>Nuestra guardia atiende de forma personalizada las 24 horas del día.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${EMERGENCY_INFO.phoneGuard24.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>Llamada 24hs</span>
            </a>
            <a
              href={`https://wa.me/${EMERGENCY_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
