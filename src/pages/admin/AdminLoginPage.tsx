import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowLeft, Mail, AlertCircle, Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';
import { EmblemIcon } from '../../components/logos/CompanyLogos';
import { supabase } from '../../lib/supabase';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError('Por favor complete todos los campos.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email o contraseña incorrectos. Verifique sus datos de acceso.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('La cuenta aún no ha confirmado su correo electrónico.');
        } else if (authError.message.includes('Too many requests') || authError.status === 429) {
          setError('Demasiados intentos fallidos. Por seguridad, el acceso ha sido bloqueado temporalmente. Aguarde unos minutos.');
        } else {
          setError(authError.message || 'No se pudo iniciar sesión. Verifique su conexión.');
        }
        return;
      }

      if (data?.session) {
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error('Error durante el inicio de sesión:', err);
      setError('Error inesperado al conectar con el servidor de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col justify-between p-4 sm:p-6 relative select-none">
      
      {/* Background glow */}
      <div className="absolute inset-0 bg-radial-at-t from-amber-950/20 via-stone-950 to-stone-950 pointer-events-none" />

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
          <span>Acceso Seguro de Guardia</span>
        </div>
      </header>

      {/* Main Login Box */}
      <main className="relative z-10 max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-stone-900/95 border border-stone-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <EmblemIcon primaryColor="#D97706" className="w-10 h-10 drop-shadow" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-950/40 text-amber-400 border border-amber-800/40 mb-3">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Zona Restringida • Personal Autorizado</span>
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-100 tracking-wide mb-2">
            Panel de Velatorios
          </h1>

          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-6 font-light">
            Gestión de salas velatorias, homenajes virtuales y pantallas TV Box conectadas.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Mail className="w-4 h-4 text-amber-500/80" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="operador@cocheriajvgonzalez.com"
                  className="w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm text-stone-100 placeholder:text-stone-600 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Lock className="w-4 h-4 text-amber-500/80" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-stone-950 border border-stone-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-sm text-stone-100 placeholder:text-stone-600 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 text-xs text-red-300 bg-red-950/60 border border-red-800/60 rounded-xl p-3 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800/50 disabled:cursor-not-allowed text-stone-950 font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-amber-600/20 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Ingresar de Forma Segura</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-800/80 text-[11px] text-stone-500 leading-relaxed text-center">
            🔐 Acceso protegido con cifrado SSL/TLS de extremo a extremo y autenticación de sesión Supabase.
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-stone-500">
        <p>Cochería J.V. González • Sistema de Guardia y Velatorios &copy; {new Date().getFullYear()}</p>
      </footer>

    </div>
  );
};

