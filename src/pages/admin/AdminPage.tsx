import React, { useState } from 'react';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminDashboardPage } from './AdminDashboardPage';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('cocheria_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const handleLoginSuccess = () => {
    try {
      sessionStorage.setItem('cocheria_admin_auth', 'true');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('cocheria_admin_auth');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboardPage onLogout={handleLogout} />;
};
