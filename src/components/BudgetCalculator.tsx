import React, { useState, useMemo } from 'react';
import { Calculator, Check, ShieldCheck, HeartHandshake, Phone, MessageCircle, FileText, Send, Sparkles, HelpCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { EMERGENCY_INFO } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export const BudgetCalculator: React.FC = () => {
  const { isDark } = useTheme();

  // Service configuration state
  const [serviceType, setServiceType] = useState<'tradicional' | 'suite' | 'cremacion' | 'traslado'>('tradicional');
  const [chapelOption, setChapelOption] = useState<'sala_central' | 'suite_vip' | 'domicilio' | 'directo'>('sala_central');
  const [casketQuality, setCasketQuality] = useState<'estandar' | 'semi_lujo' | 'presidencial'>('estandar');
  const [coverageType, setCoverageType] = useState<'particular' | 'pami' | 'obra_social' | 'prevision'>('particular');
  
  // Add-ons
  const [addFloral, setAddFloral] = useState(true);
  const [addStreaming, setAddStreaming] = useState(true);
  const [addCoffee, setAddCoffee] = useState(true);
  const [addSecondCar, setAddSecondCar] = useState(false);

  // Form contact data
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantNotes, setApplicantNotes] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<'inmediato' | 'prevision_futura'>('inmediato');
  const [submitted, setSubmitted] = useState(false);

  // Pricing calculation matrix (Values represented in ARS with respectful approximate estimates)
  const calculation = useMemo(() => {
    let basePrice = 0;
    let baseLabel = '';

    switch (serviceType) {
      case 'tradicional':
        basePrice = 480000;
        baseLabel = 'Servicio de Sepelio Tradicional';
        break;
      case 'suite':
        basePrice = 620000;
        baseLabel = 'Servicio Integral Suite Premium';
        break;
      case 'cremacion':
        basePrice = 540000;
        baseLabel = 'Servicio de Cremación con Urna & Ataúd Ecológico';
        break;
      case 'traslado':
        basePrice = 420000;
        baseLabel = 'Servicio con Traslado Especial Regional';
        break;
    }

    // Chapel adjustment
    let chapelCost = 0;
    if (chapelOption === 'suite_vip') chapelCost = 85000;
    if (chapelOption === 'domicilio') chapelCost = 25000;
    if (chapelOption === 'directo') chapelCost = -40000;

    // Casket adjustment
    let casketCost = 0;
    if (casketQuality === 'semi_lujo') casketCost = 75000;
    if (casketQuality === 'presidencial') casketCost = 140000;

    // Addons
    let addonsTotal = 0;
    if (addFloral) addonsTotal += 45000;
    if (addStreaming) addonsTotal += 18000;
    if (addCoffee) addonsTotal += 22000;
    if (addSecondCar) addonsTotal += 35000;

    const subtotal = basePrice + chapelCost + casketCost + addonsTotal;

    // Estimated deduction or subsidy
    let subsidyEstimated = 0;
    let subsidyLabel = '';
    if (coverageType === 'pami') {
      subsidyEstimated = 220000; // Standard ANSES/PAMI burial subsidy deduction
      subsidyLabel = 'Subsidio por Contención Familiar PAMI / ANSES (Estimado)';
    } else if (coverageType === 'obra_social') {
      subsidyEstimated = 180000;
      subsidyLabel = 'Reintegro estimado por Obra Social / Prepaga';
    } else if (coverageType === 'prevision') {
      subsidyEstimated = subtotal; // 100% covered if pre-need client
      subsidyLabel = 'Plan de Previsión Cochería J.V. González (100% Bonificado)';
    }

    const estimatedNet = Math.max(0, subtotal - subsidyEstimated);

    return {
      basePrice,
      baseLabel,
      chapelCost,
      casketCost,
      addonsTotal,
      subtotal,
      subsidyEstimated,
      subsidyLabel,
      estimatedNet
    };
  }, [serviceType, chapelOption, casketQuality, coverageType, addFloral, addStreaming, addCoffee, addSecondCar]);

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantPhone.trim()) return;

    // Construct respectful WhatsApp notification message
    const text = `*SOLICITUD DE PRESUPUESTO - COCHERÍA J.V. GONZÁLEZ*\n\n` +
      `*Solicitante:* ${applicantName}\n` +
      `*Teléfono:* ${applicantPhone}\n` +
      `*Email:* ${applicantEmail || 'No especificado'}\n` +
      `*Tipo de Servicio:* ${calculation.baseLabel}\n` +
      `*Sala:* ${chapelOption}\n` +
      `*Cobertura:* ${coverageType.toUpperCase()}\n` +
      `*Urgencia:* ${urgencyLevel === 'inmediato' ? 'ASISTENCIA INMEDIATA 24HS' : 'Planificación / Previsión'}\n` +
      `*Presupuesto Estimado:* $${calculation.estimatedNet.toLocaleString('es-AR')}\n` +
      (applicantNotes ? `*Notas familiares:* ${applicantNotes}\n` : '') +
      `\nSolicito contacto y confirmación formal de disponibilidad.`;

    const whatsappUrl = `https://wa.me/${EMERGENCY_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <section id="cotizador" className={`py-16 sm:py-20 ${
      isDark ? 'bg-stone-950 text-stone-100 border-stone-800' : 'bg-stone-50 text-stone-900 border-stone-200'
    } border-b transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${
            isDark ? 'bg-amber-950/70 border-amber-800/60 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900'
          } border text-xs font-semibold`}>
            <Calculator className="w-3.5 h-3.5 text-amber-600" />
            <span>Transparencia & Asesoramiento Sin Compromiso</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold font-serif ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>
            Cotizador de Servicios & Presupuesto Rápido
          </h2>
          <p className={`${isDark ? 'text-stone-300' : 'text-stone-700'} text-sm sm:text-base font-light leading-relaxed`}>
            Configure las opciones que mejor se adapten a las necesidades de su familia. Obtenga una estimación transparente al instante, considerando coberturas de PAMI y obras sociales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Options Selection Form (Left Columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Destination / Service Type */}
            <div className={`${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-sm'} p-5 rounded-2xl border space-y-3`}>
              <span className={`text-xs uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-800'} font-bold`}>Paso 1</span>
              <h3 className={`text-base font-semibold ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Seleccione el Tipo de Servicio Fúnebre</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  { id: 'tradicional', title: 'Sepelio Tradicional', desc: 'Inhumación en cementerio, ataúd seleccionado y cortejo.' },
                  { id: 'suite', title: 'Servicio Suite Imperial', desc: 'Capilla privada climatizada, servicio ceremonial VIP.' },
                  { id: 'cremacion', title: 'Cremación Integral', desc: 'Trámites, cremación certificada y urna cineraria.' },
                  { id: 'traslado', title: 'Servicio con Traslado', desc: 'Traslado fúnebre interprovincial o departamental.' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setServiceType(s.id as any)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      serviceType === s.id
                        ? isDark ? 'bg-amber-950/60 border-amber-500 text-stone-100 ring-1 ring-amber-500/40' : 'bg-amber-50 border-amber-500 text-stone-900 ring-1 ring-amber-500/40'
                        : isDark ? 'bg-stone-850 border-stone-750 text-stone-300 hover:border-stone-650' : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs sm:text-sm">{s.title}</span>
                      {serviceType === s.id && <Check className="w-4 h-4 text-amber-600" />}
                    </div>
                    <p className={`text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-500'} mt-1`}>{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Chapel Option */}
            <div className={`${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-sm'} p-5 rounded-2xl border space-y-3`}>
              <span className={`text-xs uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-800'} font-bold`}>Paso 2</span>
              <h3 className={`text-base font-semibold ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Instalación y Sala Velatoria</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  { id: 'sala_central', title: 'Sala Capilla "La Merced"', desc: 'Planta baja, climatizada, sala de espera e infusiones.' },
                  { id: 'suite_vip', title: 'Suite VIP "San Francisco"', desc: 'Ambiente exclusivo con habitación de descanso privado.' },
                  { id: 'domicilio', title: 'Capilla a Domicilio', desc: 'Acondicionamiento protocolar en residencia familiar.' },
                  { id: 'directo', title: 'Directo a Cementerio / Crematorio', desc: 'Sin velación previa, responso en capilla del cementerio.' }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setChapelOption(c.id as any)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      chapelOption === c.id
                        ? isDark ? 'bg-amber-950/60 border-amber-500 text-stone-100 ring-1 ring-amber-500/40' : 'bg-amber-50 border-amber-500 text-stone-900 ring-1 ring-amber-500/40'
                        : isDark ? 'bg-stone-850 border-stone-750 text-stone-300 hover:border-stone-650' : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs sm:text-sm">{c.title}</span>
                      {chapelOption === c.id && <Check className="w-4 h-4 text-amber-600" />}
                    </div>
                    <p className={`text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-500'} mt-1`}>{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Coverage & Mutuals */}
            <div className={`${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-sm'} p-5 rounded-2xl border space-y-3`}>
              <span className={`text-xs uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-800'} font-bold`}>Paso 3</span>
              <h3 className={`text-base font-semibold ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Cobertura de Salud o Previsión</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  { id: 'particular', title: 'Contratación Particular', desc: 'Sin cobertura previa, pago financiado o contado.' },
                  { id: 'pami', title: 'Afiliado PAMI / ANSES', desc: 'Aplicamos el subsidio fúnebre directo por convenio.' },
                  { id: 'obra_social', title: 'IPS / Obra Social / Prepaga', desc: 'Gestión de reintegro y arancel mutual convenido.' },
                  { id: 'prevision', title: 'Plan Previsión Cochería JVG', desc: 'Familia adherida previamente al plan familiar.' }
                ].map((cov) => (
                  <button
                    key={cov.id}
                    type="button"
                    onClick={() => setCoverageType(cov.id as any)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      coverageType === cov.id
                        ? isDark ? 'bg-amber-950/60 border-amber-500 text-stone-100 ring-1 ring-amber-500/40' : 'bg-amber-50 border-amber-500 text-stone-900 ring-1 ring-amber-500/40'
                        : isDark ? 'bg-stone-850 border-stone-750 text-stone-300 hover:border-stone-650' : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs sm:text-sm">{cov.title}</span>
                      {coverageType === cov.id && <Check className="w-4 h-4 text-amber-600" />}
                    </div>
                    <p className={`text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-500'} mt-1`}>{cov.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Complementary Services */}
            <div className={`${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-sm'} p-5 rounded-2xl border space-y-3`}>
              <span className={`text-xs uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-800'} font-bold`}>Paso 4</span>
              <h3 className={`text-base font-semibold ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>Servicios Adicionales de Acompañamiento</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <label className={`flex items-center gap-3 p-3 ${
                  isDark ? 'bg-stone-850 border-stone-750' : 'bg-stone-50 border-stone-200'
                } rounded-xl border cursor-pointer select-none`}>
                  <input
                    type="checkbox"
                    checked={addFloral}
                    onChange={(e) => setAddFloral(e.target.checked)}
                    className="w-4 h-4 rounded bg-stone-900 border-stone-700 text-amber-600 focus:ring-0"
                  />
                  <div className="text-xs">
                    <span className={`font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'} block`}>Corona Floral de Flores Frescas</span>
                    <span className={`text-[10px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Con cinta dedicatoria grabada</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 ${
                  isDark ? 'bg-stone-850 border-stone-750' : 'bg-stone-50 border-stone-200'
                } rounded-xl border cursor-pointer select-none`}>
                  <input
                    type="checkbox"
                    checked={addStreaming}
                    onChange={(e) => setAddStreaming(e.target.checked)}
                    className="w-4 h-4 rounded bg-stone-900 border-stone-700 text-amber-600 focus:ring-0"
                  />
                  <div className="text-xs">
                    <span className={`font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'} block`}>Transmisión Online & Obituario</span>
                    <span className={`text-[10px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Para familiares lejanos</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 ${
                  isDark ? 'bg-stone-850 border-stone-750' : 'bg-stone-50 border-stone-200'
                } rounded-xl border cursor-pointer select-none`}>
                  <input
                    type="checkbox"
                    checked={addCoffee}
                    onChange={(e) => setAddCoffee(e.target.checked)}
                    className="w-4 h-4 rounded bg-stone-900 border-stone-700 text-amber-600 focus:ring-0"
                  />
                  <div className="text-xs">
                    <span className={`font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'} block`}>Servicio de Cafetería Permanente</span>
                    <span className={`text-[10px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Café, té, agua y personal</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 ${
                  isDark ? 'bg-stone-850 border-stone-750' : 'bg-stone-50 border-stone-200'
                } rounded-xl border cursor-pointer select-none`}>
                  <input
                    type="checkbox"
                    checked={addSecondCar}
                    onChange={(e) => setAddSecondCar(e.target.checked)}
                    className="w-4 h-4 rounded bg-stone-900 border-stone-700 text-amber-600 focus:ring-0"
                  />
                  <div className="text-xs">
                    <span className={`font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'} block`}>Coche de Duelo Adicional</span>
                    <span className={`text-[10px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Para traslado cómodo de deudos</span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Real-Time Calculation & Contact Request Card (Right Column) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
            <div className={`${
              isDark ? 'bg-stone-900 border-amber-600/40' : 'bg-white border-amber-300 shadow-xl'
            } border rounded-2xl p-6 shadow-2xl space-y-5 transition-colors duration-200`}>
              
              <div className={`flex items-center justify-between border-b ${isDark ? 'border-stone-800' : 'border-stone-200'} pb-3`}>
                <div>
                  <h3 className={`font-serif font-bold text-lg ${isDark ? 'text-stone-50' : 'text-stone-900'}`}>Resumen Estimado</h3>
                  <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Valores orientativos sujetos a confirmación</p>
                </div>
                <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-amber-950 border-amber-800/60' : 'bg-amber-100 border-amber-300'} flex items-center justify-center border`}>
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
              </div>

              {/* Itemized summary */}
              <div className="space-y-2.5 text-xs">
                <div className={`flex justify-between ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                  <span>{calculation.baseLabel}</span>
                  <span className="font-mono font-medium">${calculation.basePrice.toLocaleString('es-AR')}</span>
                </div>

                {calculation.chapelCost !== 0 && (
                  <div className={`flex justify-between ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    <span>Ajuste de sala / modalidad</span>
                    <span className="font-mono">{calculation.chapelCost > 0 ? `+$${calculation.chapelCost.toLocaleString('es-AR')}` : `-$${Math.abs(calculation.chapelCost).toLocaleString('es-AR')}`}</span>
                  </div>
                )}

                {calculation.addonsTotal > 0 && (
                  <div className={`flex justify-between ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    <span>Servicios complementarios seleccionados</span>
                    <span className="font-mono">+${calculation.addonsTotal.toLocaleString('es-AR')}</span>
                  </div>
                )}

                <div className={`pt-2 border-t ${isDark ? 'border-stone-800 text-stone-300' : 'border-stone-200 text-stone-800'} flex justify-between font-semibold`}>
                  <span>Subtotal Bruto</span>
                  <span className="font-mono">${calculation.subtotal.toLocaleString('es-AR')}</span>
                </div>

                {calculation.subsidyEstimated > 0 && (
                  <div className={`p-2.5 ${isDark ? 'bg-emerald-950/60 border-emerald-800/60' : 'bg-emerald-50 border-emerald-300'} border rounded-xl space-y-1`}>
                    <div className={`flex justify-between ${isDark ? 'text-emerald-300' : 'text-emerald-800'} font-semibold`}>
                      <span>{calculation.subsidyLabel}</span>
                      <span className="font-mono">-${calculation.subsidyEstimated.toLocaleString('es-AR')}</span>
                    </div>
                    <p className={`text-[10px] ${isDark ? 'text-emerald-400/80' : 'text-emerald-700'}`}>
                      Gestionamos el subsidio de sepelio directamente ante ANSES / Mutual para su comodidad.
                    </p>
                  </div>
                )}

                {/* Final Estimated Total */}
                <div className={`pt-3 border-t ${isDark ? 'border-stone-750' : 'border-stone-200'} flex items-baseline justify-between`}>
                  <div>
                    <span className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'} block font-medium`}>Estimado Neto a Abonar:</span>
                    <span className={`text-[10px] ${isDark ? 'text-amber-300/80' : 'text-amber-800'}`}>Opciones de cuotas y financiación disponibles</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold font-mono ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>
                      ${calculation.estimatedNet.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instant Request Form */}
              <form onSubmit={handleSubmitQuote} className={`pt-3 border-t ${isDark ? 'border-stone-800' : 'border-stone-200'} space-y-3`}>
                <div className={`text-xs font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>
                  Solicitar Presupuesto Formal Inmediato:
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Su Nombre y Apellido *"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className={`w-full ${
                      isDark ? 'bg-stone-850 border-stone-750 text-stone-200' : 'bg-stone-50 border-stone-300 text-stone-900'
                    } border rounded-lg px-3 py-2 text-xs focus:border-amber-600 focus:outline-none`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="tel"
                    required
                    placeholder="Teléfono / WhatsApp *"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className={`w-full ${
                      isDark ? 'bg-stone-850 border-stone-750 text-stone-200' : 'bg-stone-50 border-stone-300 text-stone-900'
                    } border rounded-lg px-3 py-2 text-xs focus:border-amber-600 focus:outline-none`}
                  />
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className={`w-full ${
                      isDark ? 'bg-stone-850 border-stone-750 text-stone-200' : 'bg-stone-50 border-stone-300 text-stone-900'
                    } border rounded-lg px-3 py-2 text-xs focus:border-amber-600 focus:outline-none`}
                  />
                </div>

                <div className="flex gap-2 text-xs">
                  <label className={`flex-1 flex items-center gap-1.5 p-2 ${
                    isDark ? 'bg-stone-850 border-stone-750' : 'bg-stone-50 border-stone-250'
                  } rounded-lg border cursor-pointer`}>
                    <input
                      type="radio"
                      name="urgency"
                      checked={urgencyLevel === 'inmediato'}
                      onChange={() => setUrgencyLevel('inmediato')}
                      className="text-amber-600 focus:ring-0"
                    />
                    <span className={`text-[11px] ${isDark ? 'text-stone-200' : 'text-stone-800'} font-medium`}>Urgencia 24hs</span>
                  </label>
                  <label className={`flex-1 flex items-center gap-1.5 p-2 ${
                    isDark ? 'bg-stone-850 border-stone-750' : 'bg-stone-50 border-stone-250'
                  } rounded-lg border cursor-pointer`}>
                    <input
                      type="radio"
                      name="urgency"
                      checked={urgencyLevel === 'prevision_futura'}
                      onChange={() => setUrgencyLevel('prevision_futura')}
                      className="text-amber-600 focus:ring-0"
                    />
                    <span className={`text-[11px] ${isDark ? 'text-stone-200' : 'text-stone-800'} font-medium`}>Previsión Futura</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-stone-50 font-semibold py-3 rounded-xl text-xs sm:text-sm shadow-lg transition-all border border-amber-500/40"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>Enviar Presupuesto a WhatsApp</span>
                </button>

                {submitted && (
                  <div className={`p-3 ${
                    isDark ? 'bg-emerald-950 border-emerald-800 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  } border text-xs rounded-xl text-center animate-in fade-in`}>
                    ✓ Hemos preparado su solicitud de presupuesto. Se abrirá la conversación con nuestra guardia para confirmar los detalles.
                  </div>
                )}
              </form>

              {/* Direct call note */}
              <div className="text-center pt-1">
                <a
                  href={`tel:${EMERGENCY_INFO.phoneGuard24.replace(/\s+/g, '')}`}
                  className={`inline-flex items-center gap-1.5 text-[11px] ${
                    isDark ? 'text-stone-400 hover:text-amber-300' : 'text-stone-600 hover:text-amber-800'
                  } transition-colors`}
                >
                  <Phone className="w-3 h-3 text-amber-600" />
                  <span>¿Prefiere hablar directamente? Llámenos al {EMERGENCY_INFO.phoneGuard24}</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
