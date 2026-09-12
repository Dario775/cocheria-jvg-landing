import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WakeServicesProvider } from './context/WakeServicesContext';
import { LandingHomePage } from './pages/LandingHomePage';
import { VirtualWakePage } from './pages/VirtualWakePage';
import { TVKioskPage } from './pages/TVKioskPage';
import { AdminPage } from './pages/admin/AdminPage';

export default function App() {
  return (
    <WakeServicesProvider>
      <BrowserRouter>
        <Routes>
          {/* Web Pública Institucional & Obituario Digital */}
          <Route path="/" element={<LandingHomePage />} />

          {/* Capilla Ardiente Virtual para Familiares y Allegados (con PIN o enlace directo) */}
          <Route path="/velatorio" element={<VirtualWakePage />} />
          <Route path="/velatorio/:id" element={<VirtualWakePage />} />

          {/* Receptor Kiosco TV Box para Pantallas de Salas Físicas (ej: /tv/TV-JVG-01) */}
          <Route path="/tv" element={<TVKioskPage />} />
          <Route path="/tv/:deviceCode" element={<TVKioskPage />} />

          {/* Panel de Gestión y Guardia de Velatorios */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WakeServicesProvider>
  );
}
