import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import { EmblemIcon } from '../../components/logos/CompanyLogos';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // Default master PIN is 1943 (foundation year) or admin123
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === '1943' || pin.trim().toLowerCase() === 'admin' || pin.trim() === '1234') {
      onLoginSuccess();
    } else {
      setError('PIN incorrecto. Ingrese el código de guardia autorizado.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col justify-between p-6 relative select-none">
      
      {/* Background glow */}
      <div className="absolute inset-0 bg-radial-at-t from-stone-900/50 via-stone-950 to-stone-950 pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between max-w-4xl mx-auto w-full">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-200 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al sitio público</span>
        </button>

        <div className="inline-flex items-center gap-1.5 text-xs text-stone-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Panel Interno de Guardia</span>
        </div>
      </header>

      {/* Main Login Box */}
      <main className="relative z-10 max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <EmblemIcon primaryColor="#D97706" className="w-10 h-10 drop-shadow" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-stone-800 text-stone-300 border border-stone-700 mb-3">
            Acceso Personal de Guardia
          </span>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-100 tracking-wide mb-2">
            Panel de Velatorios y TV Box
          </h1>

          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-6 font-light">
            Gestión de transmisiones en directo, control remoto de pantallas en salas velatorias y moderación de condolencias.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-500">
                <KeyRound className="w-5 h-5 text-amber-500" />
              </div>
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Ingrese PIN de Operador (Ej: 1943)"
                className="w-full pl-12 pr-4 py-3.5 bg-stone-950 border border-stone-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-2xl text-center text-lg sm:text-xl font-mono tracking-widest text-stone-100 placeholder:text-stone-600 placeholder:font-sans placeholder:text-xs placeholder:tracking-normal transition-all"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/50 border border-red-900/50 rounded-xl p-2.5 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-amber-600/20 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Ingresar al Panel</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-800 text-[11px] text-stone-500">
            PIN predeterminado de guardia: <span className="font-mono text-amber-400 font-bold">1943</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-stone-500">
        <p>Cochería J.V. González • Sistema Autónomo de Velatorios &copy; {new Date().getFullYear()}</p>
      </footer>

    </div>
  );
};
