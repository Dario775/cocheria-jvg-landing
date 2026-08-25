import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Obituary, CondolenceMessage, MemorialTribute } from '../types';
import { Search, Flame, MessageSquare, ChevronRight, Calendar, MapPin, Sparkles, Filter, Heart, Clock, Share2 } from 'lucide-react';
import { ObituaryDetailModal } from './ObituaryDetailModal';
import { ShareObituaryButton } from './ShareObituaryButton';
import { useTheme } from '../context/ThemeContext';

interface DigitalObituaryProps {
  obituaries: Obituary[];
  onLightCandle: (obituaryId: string, authorName?: string) => void;
  onAddCondolence: (obituaryId: string, condolence: Omit<CondolenceMessage, 'id' | 'timestamp'>) => void;
  onAddTribute: (obituaryId: string, tribute: Omit<MemorialTribute, 'id' | 'timestamp'>) => void;
}

export const DigitalObituary: React.FC<DigitalObituaryProps> = ({
  obituaries,
  onLightCandle,
  onAddCondolence,
  onAddTribute
}) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'en_velacion' | 'inhumado' | 'cremado'>('all');
  const [selectedObituary, setSelectedObituary] = useState<Obituary | null>(null);

  const filteredObituaries = useMemo(() => {
    return obituaries.filter((item) => {
      const matchSearch = item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.familyMembers.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.funeralService.chapelRoom.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = statusFilter === 'all' ? true : item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [obituaries, searchQuery, statusFilter]);

  // Keep selectedObituary synchronized if it was updated (e.g. new candle or condolence)
  const currentSelectedObituary = useMemo(() => {
    if (!selectedObituary) return null;
    return obituaries.find(o => o.id === selectedObituary.id) || selectedObituary;
  }, [obituaries, selectedObituary]);

  const activeCount = obituaries.filter(o => o.status === 'en_velacion').length;

  return (
    <section id="obituario" className={`py-16 sm:py-20 ${
      isDark ? 'bg-stone-900 text-stone-100 border-stone-800' : 'bg-stone-100/60 text-stone-900 border-stone-200'
    } border-b transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${
            isDark ? 'bg-amber-950/70 border-amber-800/60 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900'
          } border text-xs font-semibold`}>
            <Flame className="w-3.5 h-3.5 text-amber-600 candle-flame" />
            <span>Homenajes & Memoria Eterna</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold font-serif ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
            Obituario Digital & Servicios Vigentes
          </h2>
          <p className={`${isDark ? 'text-stone-300' : 'text-stone-700'} text-sm sm:text-base font-light leading-relaxed`}>
            Consulte los servicios fúnebres actuales, horarios de cortejo, encienda una vela conmemorativa y exprese sus condolencias a las familias dolientes desde cualquier lugar.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className={`${
          isDark ? 'bg-stone-850 border-stone-750' : 'bg-white border-stone-200 shadow-sm'
        } p-4 sm:p-5 rounded-2xl border mb-8 space-y-4`}>
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            
            {/* Search input */}
            <div className="relative w-full md:w-96">
              <Search className={`w-4 h-4 ${isDark ? 'text-stone-400' : 'text-stone-500'} absolute left-3.5 top-1/2 -translate-y-1/2`} />
              <input
                type="text"
                placeholder="Buscar por nombre, familia o sala..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${
                  isDark ? 'bg-stone-900 border-stone-700 text-stone-200 placeholder:text-stone-500' : 'bg-stone-50 border-stone-300 text-stone-900 placeholder:text-stone-400'
                } border text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl focus:border-amber-600 focus:outline-none`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${isDark ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-stone-900'}`}
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === 'all'
                    ? 'bg-amber-700 text-white font-semibold shadow-md'
                    : isDark ? 'bg-stone-800 text-stone-300 hover:bg-stone-750' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Todos ({obituaries.length})
              </button>

              <button
                onClick={() => setStatusFilter('en_velacion')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  statusFilter === 'en_velacion'
                    ? isDark ? 'bg-amber-600 text-stone-950 font-bold shadow-md' : 'bg-amber-700 text-white font-bold shadow-md'
                    : isDark ? 'bg-stone-800 text-amber-300 hover:bg-stone-750' : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                </span>
                En Velación ({activeCount})
              </button>

              <button
                onClick={() => setStatusFilter('inhumado')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === 'inhumado'
                    ? 'bg-amber-700 text-white font-semibold shadow-md'
                    : isDark ? 'bg-stone-800 text-stone-300 hover:bg-stone-750' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Inhumaciones
              </button>

              <button
                onClick={() => setStatusFilter('cremado')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === 'cremado'
                    ? 'bg-amber-700 text-white font-semibold shadow-md'
                    : isDark ? 'bg-stone-800 text-stone-300 hover:bg-stone-750' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Cremaciones
              </button>
            </div>

          </div>
        </div>

        {/* Obituaries Grid */}
        {filteredObituaries.length === 0 ? (
          <div className={`${isDark ? 'bg-stone-850 border-stone-800' : 'bg-white border-stone-200 shadow-sm'} border rounded-2xl p-10 text-center space-y-3`}>
            <p className={`${isDark ? 'text-stone-400' : 'text-stone-600'} text-sm`}>
              No se encontraron registros de homenajes para la búsqueda "{searchQuery}".
            </p>
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
              className="text-xs text-amber-700 hover:underline font-medium"
            >
              Ver todos los obituarios
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredObituaries.map((obit, index) => {
              const isEnVelacion = obit.status === 'en_velacion';
              return (
                <motion.div
                  key={obit.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: index * 0.07, ease: 'easeOut' }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  onClick={() => setSelectedObituary(obit)}
                  className={`group relative rounded-2xl border transition-all duration-300 hover:shadow-2xl cursor-pointer overflow-hidden flex flex-col justify-between ${
                    isDark
                      ? isEnVelacion
                        ? 'bg-stone-850/95 border-amber-600/60 hover:border-amber-400 ring-1 ring-amber-600/20 shadow-amber-950/20'
                        : 'bg-stone-850/90 border-stone-800 hover:border-stone-700 hover:bg-stone-850'
                      : isEnVelacion
                        ? 'bg-white border-amber-400 hover:border-amber-500 ring-1 ring-amber-400/40 shadow-md'
                        : 'bg-white border-stone-200 hover:border-amber-400/50 shadow-xs'
                  }`}
                >
                  {/* Top Bar Status */}
                  <div className="p-5 pb-0 flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide flex items-center gap-1 ${
                      isEnVelacion
                        ? isDark ? 'bg-amber-950 text-amber-300 border border-amber-700/50' : 'bg-amber-100 text-amber-900 border border-amber-300'
                        : isDark ? 'bg-stone-800 text-stone-400 border border-stone-750' : 'bg-stone-100 text-stone-600 border border-stone-200'
                    }`}>
                      {isEnVelacion ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                          En Sala de Velación
                        </>
                      ) : (
                        'Descanso Eterno'
                      )}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Candle count badge */}
                      <div className={`flex items-center gap-1 text-xs ${
                        isDark ? 'text-amber-300 bg-stone-900/80 border-stone-750' : 'text-amber-900 bg-amber-50 border-amber-200'
                      } px-2 py-0.5 rounded-full border`}>
                        <Flame className="w-3.5 h-3.5 text-amber-600 candle-flame" />
                        <span>{obit.candlesCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Main Body */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-start gap-4">
                      {/* Photo */}
                      <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 ${
                        isDark ? 'border-amber-700/50 bg-stone-800' : 'border-amber-600/40 bg-stone-100'
                      } flex-shrink-0 shadow-md`}>
                        <img
                          src={obit.photoUrl}
                          alt={obit.fullName}
                          className="w-full h-full object-cover filter grayscale contrast-105 group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Name & Epitaph */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-serif font-bold text-base sm:text-lg ${
                          isDark ? 'text-stone-100 group-hover:text-amber-200' : 'text-stone-900 group-hover:text-amber-900'
                        } transition-colors truncate`}>
                          {obit.fullName}
                        </h3>
                        <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'} font-mono mt-0.5`}>
                          {obit.passedDate} ({obit.age} años)
                        </p>
                        {obit.epitaph && (
                          <p className={`text-xs ${isDark ? 'text-stone-300/90' : 'text-stone-600'} italic line-clamp-2 mt-1 font-serif`}>
                            "{obit.epitaph}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Funeral schedule highlight */}
                    <div className={`${
                      isDark ? 'bg-stone-900/90 border-stone-800' : 'bg-stone-50 border-stone-200'
                    } p-3 rounded-xl border text-xs space-y-1.5`}>
                      <div className={`flex items-center gap-1.5 ${isDark ? 'text-stone-300' : 'text-stone-800'} font-medium truncate`}>
                        <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span className="truncate">{obit.funeralService.chapelRoom}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{obit.funeralService.wakeHours}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action Bar */}
                  <div className={`px-5 py-3.5 ${
                    isDark ? 'bg-stone-900 border-stone-800 text-stone-400' : 'bg-stone-50/80 border-stone-200 text-stone-600'
                  } border-t flex items-center justify-between text-xs gap-2`}>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[11px]">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {obit.condolences.length}
                      </span>
                      <ShareObituaryButton obituary={obit} variant="card" />
                    </div>

                    <span className={`${
                      isDark ? 'text-amber-400 group-hover:text-amber-300' : 'text-amber-800 group-hover:text-amber-900'
                    } font-semibold flex items-center gap-1 text-xs shrink-0`}>
                      Ver Homenaje <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Obituary Detail & Memorial Modal */}
      {currentSelectedObituary && (
        <ObituaryDetailModal
          obituary={currentSelectedObituary}
          onClose={() => setSelectedObituary(null)}
          onLightCandle={onLightCandle}
          onAddCondolence={onAddCondolence}
          onAddTribute={onAddTribute}
        />
      )}
    </section>
  );
};
