import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, Send, ShieldCheck, Navigation, CheckCircle2, Globe, Building2 } from 'lucide-react';
import { EMERGENCY_INFO, GROUP_BRANCHES } from '../data/mockData';
import { EmblemIcon, UnifiedCompanyLogo } from './logos/CompanyLogos';
import { useTheme } from '../context/ThemeContext';

export const LocationAndContact: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedBranchId, setSelectedBranchId] = useState<'jv_gonzalez' | 'guemes' | 'metan'>('jv_gonzalez');
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('urgencia');
  const [formMessage, setFormMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const activeBranch = GROUP_BRANCHES.find(b => b.id === selectedBranchId) || GROUP_BRANCHES[0];

  const mapUrls: Record<string, string> = {
    jv_gonzalez: 'https://maps.google.com/maps?q=Joaquin%20V%20Gonzalez,%20Salta,%20Argentina&t=&z=15&ie=UTF8&iwloc=&output=embed',
    guemes: 'https://maps.google.com/maps?q=General%20Guemes,%20Salta,%20Argentina&t=&z=15&ie=UTF8&iwloc=&output=embed',
    metan: 'https://maps.google.com/maps?q=San%20Jose%20de%20Metan,%20Salta,%20Argentina&t=&z=15&ie=UTF8&iwloc=&output=embed'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    const subjectLabels: Record<string, string> = {
      urgencia: 'URGENCIA INMEDIATA 24HS',
      prevision: 'CONSULTA PLAN DE PREVISIÓN FAMILIAR',
      traslado: 'CONSULTA POR TRASLADO FÚNEBRE',
      consulta_general: 'CONSULTA GENERAL / ADMINISTRACIÓN'
    };

    const text = `*MENSAJE DESDE LA WEB - ${activeBranch.brandName.toUpperCase()}*\n\n` +
      `*Sede de Referencia:* ${activeBranch.city} (${activeBranch.department})\n` +
      `*Motivo:* ${subjectLabels[formSubject] || formSubject}\n` +
      `*Nombre:* ${formName}\n` +
      `*Teléfono:* ${formPhone}\n` +
      `*Email:* ${formEmail || 'No indicado'}\n` +
      `*Mensaje:* ${formMessage || 'Sin mensaje adicional'}`;

    const cleanWhatsapp = activeBranch.phoneMobile.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanWhatsapp.startsWith('54') ? cleanWhatsapp : '549' + cleanWhatsapp}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFormName('');
      setFormPhone('');
      setFormEmail('');
      setFormMessage('');
    }, 4000);
  };

  return (
    <section id="contacto" className={`py-16 sm:py-24 ${
      isDark ? 'bg-stone-900 text-stone-100 border-stone-800' : 'bg-white text-stone-900 border-stone-200'
    } border-b transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${
            isDark ? 'bg-amber-950/70 border-amber-800/60 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900'
          } border text-xs font-semibold`}>
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Red Regional de Cocherías • Salta Interior</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold font-serif ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
            Sedes, Ubicación & Contacto 24/7
          </h2>
          <p className={`${isDark ? 'text-stone-300' : 'text-stone-700'} text-sm sm:text-base font-light leading-relaxed`}>
            Consulte la ubicación y líneas de guardia directa de cualquiera de nuestras 3 empresas en Joaquín V. González, General Güemes y San José de Metán.
          </p>
        </div>

        {/* 3-Branch Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {GROUP_BRANCHES.map(branch => (
            <button
              key={branch.id}
              onClick={() => setSelectedBranchId(branch.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                selectedBranchId === branch.id
                  ? isDark
                    ? 'bg-stone-800 border-amber-500 text-amber-200 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-amber-50 border-amber-600 text-amber-950 shadow-md ring-2 ring-amber-600/20'
                  : isDark
                    ? 'bg-stone-850 border-stone-800 text-stone-400 hover:text-stone-200'
                    : 'bg-stone-100 border-stone-200 text-stone-600 hover:text-stone-900'
              }`}
            >
              <UnifiedCompanyLogo brand={branch.id} variant="emblem" size="xs" />
              <span>{branch.brandName}</span>
              <span className="text-[10px] opacity-75 font-normal">({branch.city})</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info & Interactive Map for Selected Branch */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Emergency Card */}
              <div className={`${
                isDark ? 'bg-stone-850 border-amber-600/40' : 'bg-stone-50 border-amber-300 shadow-sm'
              } p-5 rounded-2xl border space-y-2`}>
                <div className={`flex items-center gap-2 ${isDark ? 'text-amber-400' : 'text-amber-800'} font-semibold text-xs uppercase tracking-wider`}>
                  <Phone className="w-4 h-4" />
                  <span>Guardia Fúnebre 24hs ({activeBranch.city})</span>
                </div>
                <div className={`text-lg font-bold ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                  <a href={`tel:${activeBranch.phoneMobile.replace(/\s+/g, '')}`} className="hover:text-amber-600 transition-colors">
                    {activeBranch.phoneMobile}
                  </a>
                </div>
                <div className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  Tel. Fijo: <a href={`tel:${activeBranch.phoneGuard.replace(/\s+/g, '')}`} className={`${isDark ? 'text-stone-300' : 'text-stone-800'} hover:underline font-medium`}>{activeBranch.phoneGuard}</a>
                </div>
                <p className={`text-[11px] ${isDark ? 'text-amber-300/80' : 'text-amber-800'} pt-1`}>
                  Atención ininterrumpida los 365 días del año.
                </p>
              </div>

              {/* Location Card */}
              <div className={`${
                isDark ? 'bg-stone-850 border-stone-800' : 'bg-stone-50 border-stone-200 shadow-sm'
              } p-5 rounded-2xl border space-y-2`}>
                <div className={`flex items-center gap-2 ${isDark ? 'text-amber-400' : 'text-amber-800'} font-semibold text-xs uppercase tracking-wider`}>
                  <MapPin className="w-4 h-4" />
                  <span>Dirección {activeBranch.city}</span>
                </div>
                <p className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                  {activeBranch.address}
                </p>
                <div className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'} flex items-center gap-1 pt-1`}>
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Guardia y salas: 24hs ininterrumpidas</span>
                </div>
                <p className={`text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {activeBranch.department}
                </p>
              </div>

            </div>

            {/* Embedded Google Map */}
            <div className={`${
              isDark ? 'bg-stone-850 border-stone-800' : 'bg-stone-50 border-stone-200 shadow-sm'
            } rounded-2xl border overflow-hidden space-y-0`}>
              <div className={`p-3.5 border-b ${isDark ? 'border-stone-800' : 'border-stone-200'} flex items-center justify-between`}>
                <div className="flex items-center gap-2 text-xs">
                  <Navigation className="w-4 h-4 text-amber-600" />
                  <span className={`font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>
                    Mapa de Ubicación: {activeBranch.brandName} ({activeBranch.city})
                  </span>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(activeBranch.address + ', ' + activeBranch.city + ', Salta')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[11px] ${isDark ? 'text-amber-300 hover:text-amber-200' : 'text-amber-800 hover:text-amber-900'} underline font-medium`}
                >
                  Abrir en Google Maps
                </a>
              </div>
              
              <div className="aspect-[16/9] w-full bg-stone-950 relative">
                <iframe
                  title={`Mapa Ubicacion ${activeBranch.brandName}`}
                  src={mapUrls[selectedBranchId]}
                  className="w-full h-full border-0 filter contrast-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>

          {/* Right: Quick Direct Contact Form */}
          <div className="lg:col-span-5">
            <div className={`${
              isDark ? 'bg-stone-850 border-stone-800' : 'bg-stone-50 border-stone-200 shadow-lg'
            } border rounded-2xl p-6 sm:p-7 space-y-4`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <UnifiedCompanyLogo brand={activeBranch.id} variant="emblem" size="xs" />
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                    Contacto Directo • {activeBranch.city}
                  </span>
                </div>
                <h3 className={`font-serif font-bold text-xl ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
                  Mensaje a {activeBranch.brandName}
                </h3>
                <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'} mt-1 leading-relaxed`}>
                  Complete el formulario y le responderemos con la máxima reserva, prontitud y respeto.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className={`block ${isDark ? 'text-stone-300' : 'text-stone-700'} mb-1 font-medium`}>Motivo del Contacto *</label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className={`w-full ${
                      isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-stone-300 text-stone-900'
                    } border rounded-xl px-3 py-2.5 text-xs focus:border-amber-600 focus:outline-none`}
                  >
                    <option value="urgencia">🚨 Asistencia Fúnebre Inmediata (Urgencia 24hs)</option>
                    <option value="prevision">🛡️ Información sobre Plan de Previsión Familiar</option>
                    <option value="traslado">🚗 Traslados Regionales / Nacionales</option>
                    <option value="consulta_general">💬 Consulta General / Trámites / Administración</option>
                  </select>
                </div>

                <div>
                  <label className={`block ${isDark ? 'text-stone-300' : 'text-stone-700'} mb-1 font-medium`}>Nombre y Apellido *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Roberto Sánchez"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={`w-full ${
                      isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-stone-300 text-stone-900'
                    } border rounded-xl px-3 py-2.5 text-xs focus:border-amber-600 focus:outline-none`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`block ${isDark ? 'text-stone-300' : 'text-stone-700'} mb-1 font-medium`}>Teléfono / Celular *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. +54 3877 123456"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className={`w-full ${
                        isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-stone-300 text-stone-900'
                      } border rounded-xl px-3 py-2.5 text-xs focus:border-amber-600 focus:outline-none`}
                    />
                  </div>
                  <div>
                    <label className={`block ${isDark ? 'text-stone-300' : 'text-stone-700'} mb-1 font-medium`}>Correo Electrónico</label>
                    <input
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className={`w-full ${
                        isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-stone-300 text-stone-900'
                      } border rounded-xl px-3 py-2.5 text-xs focus:border-amber-600 focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block ${isDark ? 'text-stone-300' : 'text-stone-700'} mb-1 font-medium`}>Mensaje o Consulta</label>
                  <textarea
                    rows={4}
                    placeholder="Detalle su consulta o requerimiento particular..."
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className={`w-full ${
                      isDark ? 'bg-stone-900 border-stone-700 text-stone-200' : 'bg-white border-stone-300 text-stone-900'
                    } border rounded-xl p-3 text-xs focus:border-amber-600 focus:outline-none leading-relaxed`}
                  />
                </div>

                {isSent ? (
                  <div className={`p-3 ${
                    isDark ? 'bg-emerald-950 text-emerald-200' : 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                  } text-xs rounded-xl flex items-center justify-center gap-2 animate-in fade-in`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Conectando con guardia de {activeBranch.city}...</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar a Guardia de {activeBranch.city}</span>
                  </button>
                )}
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

