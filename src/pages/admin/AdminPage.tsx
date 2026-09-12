import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminDashboardPage } from './AdminDashboardPage';
import { supabase } from '../../lib/supabase';
import { EmblemIcon } from '../../components/logos/CompanyLogos';
import { Loader2 } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Obtener la sesión activa al montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Escuchar cambios de estado en tiempo real (login, logout, token refresh)
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    }
    setSession(null);
  };

  // Pantalla de carga mientras se verifica la sesión en Supabase
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-6 select-none">
        <div className="w-16 h-16 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center mb-4 animate-pulse">
          <EmblemIcon primaryColor="#D97706" className="w-10 h-10 drop-shadow" />
        </div>
        <div className="flex items-center gap-2 text-stone-400 text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
          <span>Verificando credenciales de seguridad...</span>
        </div>
      </div>
    );
  }

  // Si no hay sesión activa, requerir login
  if (!session) {
    return (
      <AdminLoginPage
        onLoginSuccess={() => {
          // El listener onAuthStateChange actualizará la sesión automáticamente
        }}
      />
    );
  }

  // Sesión validada con éxito
  return <AdminDashboardPage onLogout={handleLogout} user={session.user} />;
};

