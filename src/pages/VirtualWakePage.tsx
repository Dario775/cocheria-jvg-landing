import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { KeyRound, ShieldAlert, Video, Heart, Clock, MapPin, ArrowRight, Lock } from 'lucide-react';
import { sanitizePin } from '../utils/security';
import { VirtualWakeRoom } from '../components/streaming/VirtualWakeRoom';
import { useWakeServices } from '../context/WakeServicesContext';
import { EmblemIcon } from '../components/logos/CompanyLogos';

export const VirtualWakePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { getWakeById, getWakeByPin, wakeServices } = useWakeServices();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeWake, setActiveWake] = useState(() => {
    if (id) {
      return getWakeById(id) || getWakeByPin(id);
    }
    return undefined;
  });

  // Re-check when id changes
  useEffect(() => {
    if (id) {
      const found = getWakeById(id) || getWakeByPin(id);
      if (found) {
        setActiveWake(found);
      }
    }
  }, [id, getWakeById, getWakeByPin]);

  // Handle PIN validation
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    const targetWake = getWakeByPin(pinInput) || getWakeById(pinInput);
    if (targetWake) {
      setActiveWake(targetWake);
    } else {
      setPinError('El PIN ingresado no coincide con ninguna capilla activa. Verifique el código provisto por la familia.');
    }
  };

  // If wake is found and active, display full-screen virtual room
  if (activeWake) {
    return (
      <div className="w-screen h-screen bg-stone-950 overflow-hidden select-none">
        <VirtualWakeRoom
          hideHeader={false}
          onClose={() => navigate('/')}
          serviceData={{
            id: activeWake.id,
            deceasedName: activeWake.deceasedName,
            birthYear: activeWake.birthYear,
            passedYear: activeWake.passedYear,
            age: activeWake.age,
            photoUrl: activeWake.photoUrl,
            chapelRoom: activeWake.chapelRoom,
            branchName: activeWake.branchName,
            cortegeTime: activeWake.cortegeTime,
            accessPin: activeWake.accessPin,
            isLive: activeWake.isLive,
            streamUrl: activeWake.streamUrl
          }}
        />
      </div>
    );
  }

  // If no wake selected yet, show elegant PIN access screen
  return (
    <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden select-none">
      
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial-at-t from-stone-900/60 via-stone-950 to-stone-950 pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full pt-2">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-200 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al sitio institucional</span>
        </button>

        <div className="inline-flex items-center gap-1.5 text-xs text-stone-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Transmisión Privada y Encriptada</span>
        </div>
      </header>

      {/* Main Card */}
      <main className="relative z-10 max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <EmblemIcon primaryColor="#D97706" className="w-10 h-10 drop-shadow" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-950/80 text-amber-300 border border-amber-800/50 mb-3">
            Capilla Ardiente Virtual
          </span>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-50 tracking-wide mb-2">
            Ingreso Privado
          </h1>

          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-6 font-light">
            Ingrese el PIN de 4 dígitos provisto por la familia o el enlace directo para unirse a la sala de homenaje en directo.
          </p>

          <form onSubmit={handleVerifyPin} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-500">
                <KeyRound className="w-5 h-5 text-amber-500" />
              </div>
              <input
                type="text"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(sanitizePin(e.target.value, 8));
                  setPinError('');
                }}
                placeholder="Ej: 1234 o código de sala"
                maxLength={8}
                className="w-full pl-12 pr-4 py-3.5 bg-stone-950 border border-stone-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-2xl text-center text-lg sm:text-xl font-mono tracking-widest text-stone-100 placeholder:text-stone-600 placeholder:font-sans placeholder:text-sm placeholder:tracking-normal transition-all"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-400 font-medium bg-red-950/50 border border-red-900/50 rounded-xl p-2.5">
                {pinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-amber-600/20 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Acceder a la Capilla</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </form>

          {/* Quick links to active wakes for demo */}
          {wakeServices.length > 0 && (
            <div className="mt-6 pt-5 border-t border-stone-800/80 text-left">
              <p className="text-[11px] uppercase tracking-wider text-stone-500 font-bold mb-2">
                Salas activas en este momento:
              </p>
              <div className="space-y-1.5">
                {wakeServices.filter(s => s.status !== 'finalizado').map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveWake(s)}
                    className="w-full p-2 rounded-xl bg-stone-950/70 hover:bg-stone-800 border border-stone-800 text-left flex items-center justify-between text-xs transition-colors cursor-pointer group"
                  >
                    <div>
                      <span className="font-semibold text-stone-200 group-hover:text-amber-200 block">
                        {s.deceasedName}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {s.chapelRoom} • PIN: <span className="font-mono text-amber-400 font-bold">{s.accessPin}</span>
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                      {s.isLive ? 'EN VIVO' : 'SALA'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-stone-500 pb-2">
        <p>Cochería J.V. González • Sala Velatoria Virtual &copy; {new Date().getFullYear()}</p>
      </footer>

    </div>
  );
};
