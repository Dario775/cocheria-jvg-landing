import React, { useState } from 'react';
import { TESTIMONIALS } from '../data/mockData';
import { TestimonialItem } from '../types';
import { Star, MessageSquareHeart, ShieldCheck, Heart, Send, CheckCircle2, User, PlusCircle, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const TestimonialsSection: React.FC = () => {
  const { isDark } = useTheme();
  const [testimonialsList, setTestimonialsList] = useState<TestimonialItem[]>(TESTIMONIALS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newDeceasedMention, setNewDeceasedMention] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamilyName.trim() || !newComment.trim()) return;

    const newEntry: TestimonialItem = {
      id: `test-${Date.now()}`,
      familyName: newFamilyName.trim(),
      deceasedMention: newDeceasedMention.trim() ? `En memoria de ${newDeceasedMention.trim()}` : 'Agradecimiento familiar',
      serviceDate: 'Agosto 2026',
      comment: newComment.trim(),
      rating: newRating,
      verifiedFamily: true,
      location: newLocation.trim() || 'Joaquín V. González'
    };

    setTestimonialsList([newEntry, ...testimonialsList]);
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setShowAddModal(false);
      setNewFamilyName('');
      setNewDeceasedMention('');
      setNewComment('');
      setNewLocation('');
    }, 2000);
  };

  return (
    <section id="testimonios" className={`py-16 sm:py-24 ${
      isDark ? 'bg-stone-900 text-stone-100 border-stone-800' : 'bg-white text-stone-900 border-stone-200'
    } border-b transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${
              isDark ? 'bg-amber-950/70 border-amber-800/60 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900'
            } border text-xs font-semibold`}>
              <Heart className="w-3.5 h-3.5 text-amber-600" />
              <span>Voces de Gratitud</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold font-serif ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
              Testimonios de Familias Atendidas
            </h2>
            <p className={`${isDark ? 'text-stone-300' : 'text-stone-700'} text-sm sm:text-base font-light leading-relaxed`}>
              La confianza de nuestra comunidad es nuestro mayor compromiso. Compartimos las palabras de quienes nos permitieron acompañarles en su despedida.
            </p>
          </div>

          <div>
            <button
              onClick={() => setShowAddModal(true)}
              className={`inline-flex items-center gap-2 ${
                isDark ? 'bg-stone-800 hover:bg-stone-750 text-amber-300 border-amber-600/40' : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
              } border px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-md`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Dejar un Agradecimiento</span>
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonialsList.map((test) => (
            <div
              key={test.id}
              className={`${
                isDark ? 'bg-stone-850 border-stone-800' : 'bg-stone-50 border-stone-200'
              } p-6 rounded-2xl border flex flex-col justify-between shadow-md relative`}
            >
              <div className="space-y-3">
                {/* Rating stars and verified badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  {test.verifiedFamily && (
                    <span className={`inline-flex items-center gap-1 text-[11px] ${
                      isDark ? 'text-emerald-300 bg-emerald-950/70 border-emerald-800/60' : 'text-emerald-800 bg-emerald-100 border-emerald-300'
                    } border px-2 py-0.5 rounded-full font-medium`}>
                      <ShieldCheck className="w-3 h-3" />
                      Familia Atendida
                    </span>
                  )}
                </div>

                {/* Comment quote */}
                <blockquote className={`text-xs sm:text-sm ${isDark ? 'text-stone-200' : 'text-stone-800'} leading-relaxed italic pt-1 font-serif`}>
                  "{test.comment}"
                </blockquote>
              </div>

              <div className={`mt-5 pt-4 border-t ${isDark ? 'border-stone-800' : 'border-stone-200'} flex items-center justify-between text-xs`}>
                <div>
                  <h4 className={`font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>{test.familyName}</h4>
                  <p className={`text-[11px] ${isDark ? 'text-amber-400/80' : 'text-amber-800'}`}>{test.deceasedMention}</p>
                </div>
                <div className={`text-right ${isDark ? 'text-stone-400' : 'text-stone-500'} text-[11px]`}>
                  <span>{test.location}</span>
                  <span className="block text-[10px] opacity-75">{test.serviceDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal to leave a testimonial */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className={`relative max-w-lg w-full ${
            isDark ? 'bg-stone-900 border-stone-750 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
          } border rounded-2xl p-6 shadow-2xl space-y-4`}>
            
            <div className={`flex items-center justify-between border-b ${isDark ? 'border-stone-800' : 'border-stone-200'} pb-3`}>
              <div className="flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-amber-600" />
                <h3 className={`font-serif font-bold text-lg ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>Dejar Testimonio de Gratitud</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className={`p-1.5 rounded-lg ${isDark ? 'text-stone-400 hover:text-white bg-stone-800' : 'text-stone-500 hover:text-stone-900 bg-stone-100'} transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTestimonial} className="space-y-3.5 text-xs">
              <div>
                <label className={`block ${isDark ? 'text-stone-400' : 'text-stone-600'} mb-1`}>Nombre de la Familia o Solicitante *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Familia Gómez Navarro"
                  value={newFamilyName}
                  onChange={(e) => setNewFamilyName(e.target.value)}
                  className={`w-full ${
                    isDark ? 'bg-stone-850 border-stone-750 text-stone-200' : 'bg-stone-50 border-stone-300 text-stone-900'
                  } border rounded-lg px-3 py-2 focus:border-amber-600 focus:outline-none`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block ${isDark ? 'text-stone-400' : 'text-stone-600'} mb-1`}>En memoria de (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej. Don Carlos Gómez"
                    value={newDeceasedMention}
                    onChange={(e) => setNewDeceasedMention(e.target.value)}
                    className={`w-full ${
                      isDark ? 'bg-stone-850 border-stone-750 text-stone-200' : 'bg-stone-50 border-stone-300 text-stone-900'
                    } border rounded-lg px-3 py-2 focus:border-amber-600 focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`block ${isDark ? 'text-stone-400' : 'text-stone-600'} mb-1`}>Localidad</label>
                  <input
                    type="text"
                    placeholder="Ej. Joaquín V. González"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className={`w-full ${
                      isDark ? 'bg-stone-850 border-stone-750 text-stone-200' : 'bg-stone-50 border-stone-300 text-stone-900'
                    } border rounded-lg px-3 py-2 focus:border-amber-600 focus:outline-none`}
                  />
                </div>
              </div>

              <div>
                <label className={`block ${isDark ? 'text-stone-400' : 'text-stone-600'} mb-1`}>Calificación</label>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= newRating ? 'text-amber-500 fill-amber-500' : isDark ? 'text-stone-700' : 'text-stone-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block ${isDark ? 'text-stone-400' : 'text-stone-600'} mb-1`}>Su Mensaje o Experiencia *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Comparta su experiencia con nuestro servicio y atención humana..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className={`w-full ${
                    isDark ? 'bg-stone-850 border-stone-750 text-stone-200' : 'bg-stone-50 border-stone-300 text-stone-900'
                  } border rounded-lg p-3 focus:border-amber-600 focus:outline-none leading-relaxed`}
                />
              </div>

              {feedbackSuccess ? (
                <div className={`p-3 ${
                  isDark ? 'bg-emerald-950 text-emerald-200' : 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                } rounded-lg text-center flex items-center justify-center gap-2 animate-in fade-in`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>¡Gracias por sus sentidas palabras! Se han publicado.</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Publicar Testimonio</span>
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
