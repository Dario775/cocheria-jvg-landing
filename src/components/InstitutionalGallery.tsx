import React, { useState } from 'react';
import { PHOTO_GALLERY } from '../data/mockData';
import { PhotoGalleryItem } from '../types';
import { Image as ImageIcon, X, ZoomIn, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const InstitutionalGallery: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'salas' | 'capilla' | 'flota' | 'jardines' | 'atencion'>('all');
  const [activePhoto, setActivePhoto] = useState<PhotoGalleryItem | null>(null);

  const filteredPhotos = PHOTO_GALLERY.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const categories = [
    { id: 'all', label: 'Todas las Instalaciones' },
    { id: 'salas', label: 'Salas & Suites' },
    { id: 'capilla', label: 'Oratorio & Capilla' },
    { id: 'flota', label: 'Flota Ceremonial' },
    { id: 'jardines', label: 'Jardines de Paz' },
    { id: 'atencion', label: 'Atención Familiar' }
  ];

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[nextIndex]);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[prevIndex]);
  };

  return (
    <section id="galeria" className={`py-16 sm:py-24 ${
      isDark ? 'bg-stone-950 text-stone-100 border-stone-800' : 'bg-stone-100 text-stone-900 border-stone-200'
    } border-b transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${
            isDark ? 'bg-amber-950/70 border-amber-800/60 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900'
          } border text-xs font-semibold`}>
            <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
            <span>Nuestras Instalaciones</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold font-serif ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
            Galería Institucional de Serenidad & Respeto
          </h2>
          <p className={`${isDark ? 'text-stone-300' : 'text-stone-700'} text-sm sm:text-base font-light leading-relaxed`}>
            Ambientes concebidos arquitectónicamente para brindar paz, privacidad, calidez y óptimo confort a las familias durante las honras fúnebres.
          </p>
        </div>

        {/* Filter Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-700 text-white font-semibold shadow-md'
                  : isDark 
                    ? 'bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800' 
                    : 'bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-950 border border-stone-300 shadow-xs'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className={`group relative rounded-2xl overflow-hidden ${
                isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-md'
              } border cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-stone-950">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95 contrast-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Overlay with details */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity p-5 flex flex-col justify-end">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-50 group-hover:text-amber-200 transition-colors">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-stone-200 line-clamp-2 mt-1 font-light">
                      {photo.description}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-stone-900/80 border border-stone-700 flex items-center justify-center text-amber-300 flex-shrink-0 ml-3">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative max-w-4xl w-full ${
              isDark ? 'bg-stone-900 border-stone-750 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
            } border rounded-2xl overflow-hidden shadow-2xl space-y-0`}
          >
            {/* Top Bar */}
            <div className={`p-4 flex items-center justify-between border-b ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
              <div>
                <h3 className={`font-serif font-bold text-lg ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>{activePhoto.title}</h3>
                <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>{activePhoto.description}</p>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className={`p-1.5 rounded-lg ${isDark ? 'text-stone-400 hover:text-white bg-stone-800' : 'text-stone-600 hover:text-stone-900 bg-stone-100'} transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Container */}
            <div className="relative aspect-video max-h-[70vh] bg-stone-950 flex items-center justify-center">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next buttons */}
              <button
                onClick={handlePrevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white border border-stone-700 transition-colors shadow-lg"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white border border-stone-700 transition-colors shadow-lg"
                aria-label="Siguiente foto"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
