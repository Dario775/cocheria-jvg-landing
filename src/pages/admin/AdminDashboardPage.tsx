import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tv, 
  Radio, 
  PlusCircle, 
  Users, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Copy, 
  ExternalLink, 
  Check, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  LogOut, 
  Flame, 
  Heart, 
  Flower2, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Play,
  Square,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useWakeServices } from '../../context/WakeServicesContext';
import { WakeService } from '../../types';
import { EmblemIcon } from '../../components/logos/CompanyLogos';
import { 
  sanitizeText, 
  sanitizeDigits, 
  sanitizePin, 
  sanitizeUrl, 
  sanitizeAge 
} from '../../utils/security';

interface AdminDashboardPageProps {
  onLogout: () => void;
  user?: User | null;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const { 
    wakeServices, 
    tvDevices, 
    moderationQueue, 
    createWakeService, 
    updateWakeService, 
    deleteWakeService, 
    setWakeStatus, 
    toggleTVMode,
    assignWakeToTV,
    approveCondolence,
    rejectCondolence,
    resetToDefaults
  } = useWakeServices();

  const [activeTab, setActiveTab] = useState<'velatorios' | 'nuevo' | 'tv_kiosk' | 'moderacion'>('velatorios');
  const [editingWakeId, setEditingWakeId] = useState<string | null>(null);
  const [copiedWakeId, setCopiedWakeId] = useState<string | null>(null);
  const [copiedTVCode, setCopiedTVCode] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Form State limpio sin datos de prueba harcodeados
  const initialFormData = {
    deceasedName: '',
    birthYear: '',
    passedYear: new Date().getFullYear().toString(),
    age: '' as number | '',
    photoUrl: '',
    epitaph: '',
    chapelRoom: 'Sala Magna A',
    branchName: 'Casa Central • Joaquín V. González',
    cortegeTime: '',
    accessPin: Math.floor(1000 + Math.random() * 9000).toString(),
    streamUrl: '',
    isLiveImmediately: true
  };

  const [formData, setFormData] = useState(initialFormData);

  // Cálculo automático de edad al cambiar los años con sanitización numérica
  const handleBirthYearChange = (val: string) => {
    const cleanDigits = sanitizeDigits(val, 4);
    const bYear = parseInt(cleanDigits);
    const pYear = parseInt(formData.passedYear);
    let calculatedAge: number | '' = formData.age;
    if (!isNaN(bYear) && !isNaN(pYear) && pYear >= bYear && bYear > 1900) {
      calculatedAge = sanitizeAge(pYear - bYear);
    }
    setFormData(prev => ({ ...prev, birthYear: cleanDigits, age: calculatedAge }));
  };

  const handlePassedYearChange = (val: string) => {
    const cleanDigits = sanitizeDigits(val, 4);
    const pYear = parseInt(cleanDigits);
    const bYear = parseInt(formData.birthYear);
    let calculatedAge: number | '' = formData.age;
    if (!isNaN(bYear) && !isNaN(pYear) && pYear >= bYear && bYear > 1900) {
      calculatedAge = sanitizeAge(pYear - bYear);
    }
    setFormData(prev => ({ ...prev, passedYear: cleanDigits, age: calculatedAge }));
  };

  const showNotification = (text: string) => {
    setNotificationMsg(text);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Iniciar edición de un velatorio existente
  const handleStartEdit = (wake: WakeService) => {
    setEditingWakeId(wake.id);
    setFormData({
      deceasedName: wake.deceasedName,
      birthYear: wake.birthYear || '',
      passedYear: wake.passedYear || new Date().getFullYear().toString(),
      age: wake.age || '',
      photoUrl: wake.photoUrl || '',
      epitaph: wake.epitaph || '',
      chapelRoom: wake.chapelRoom || 'Sala Magna A',
      branchName: wake.branchName || 'Casa Central • Joaquín V. González',
      cortegeTime: wake.cortegeTime || '',
      accessPin: wake.accessPin || Math.floor(1000 + Math.random() * 9000).toString(),
      streamUrl: wake.streamUrl || '',
      isLiveImmediately: wake.isLive ?? true
    });
    setActiveTab('nuevo');
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingWakeId(null);
    setFormData({
      ...initialFormData,
      accessPin: Math.floor(1000 + Math.random() * 9000).toString()
    });
    setActiveTab('velatorios');
  };

  // Guardar (Crear o Modificar) con validaciones y sanitizaciones de seguridad
  const handleSaveWake = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validar nombre del homenajeado
    const cleanName = sanitizeText(formData.deceasedName, 100);
    if (!cleanName || cleanName.length < 2) {
      alert('Por favor ingrese un nombre y apellido válido para el homenajeado (mínimo 2 letras).');
      return;
    }

    // 2. Validar y sanitizar años y edad
    const cleanBirthYear = sanitizeDigits(formData.birthYear, 4);
    const cleanPassedYear = sanitizeDigits(formData.passedYear, 4) || new Date().getFullYear().toString();
    
    let calculatedAge = 0;
    if (formData.age !== '') {
      calculatedAge = sanitizeAge(formData.age);
    } else if (cleanBirthYear && cleanPassedYear) {
      const diff = parseInt(cleanPassedYear) - parseInt(cleanBirthYear);
      calculatedAge = sanitizeAge(diff >= 0 ? diff : 0);
    }

    // 3. Validar URL de foto (opcional, pero si se coloca debe ser HTTPS/HTTP seguro)
    let cleanPhotoUrl = '';
    if (formData.photoUrl.trim()) {
      cleanPhotoUrl = sanitizeUrl(formData.photoUrl);
      if (!cleanPhotoUrl) {
        alert('La URL de la foto no es válida. Ingrese una dirección web que inicie con https:// o http://');
        return;
      }
    }

    // 4. Validar enlace de streaming (opcional, pero si se coloca debe ser seguro)
    let cleanStreamUrl = '';
    if (formData.streamUrl.trim()) {
      cleanStreamUrl = sanitizeUrl(formData.streamUrl);
      if (!cleanStreamUrl) {
        alert('El enlace de transmisión debe ser una dirección web válida (ej: https://youtube.com/live/...)');
        return;
      }
    }

    // 5. Validar PIN de acceso
    const cleanPin = sanitizePin(formData.accessPin, 8);
    if (!cleanPin || cleanPin.length < 4) {
      alert('El PIN de acceso debe tener entre 4 y 8 caracteres (letras y números sin espacios ni símbolos).');
      return;
    }

    // 6. Sanitizar textos libres
    const cleanEpitaph = sanitizeText(formData.epitaph, 250);
    const cleanCortege = sanitizeText(formData.cortegeTime, 150);

    if (editingWakeId) {
      updateWakeService(editingWakeId, {
        deceasedName: cleanName,
        birthYear: cleanBirthYear,
        passedYear: cleanPassedYear,
        age: calculatedAge,
        photoUrl: cleanPhotoUrl,
        epitaph: cleanEpitaph,
        chapelRoom: formData.chapelRoom,
        branchName: formData.branchName,
        cortegeTime: cleanCortege,
        accessPin: cleanPin,
        streamUrl: cleanStreamUrl,
        isLive: formData.isLiveImmediately,
        status: formData.isLiveImmediately ? 'en_vivo' : 'preparacion'
      });
      showNotification(`Velatorio de "${cleanName}" actualizado con éxito.`);
      setEditingWakeId(null);
    } else {
      createWakeService({
        deceasedName: cleanName,
        birthYear: cleanBirthYear,
        passedYear: cleanPassedYear,
        age: calculatedAge,
        photoUrl: cleanPhotoUrl,
        epitaph: cleanEpitaph,
        chapelRoom: formData.chapelRoom,
        branchName: formData.branchName,
        cortegeTime: cleanCortege,
        accessPin: cleanPin,
        streamUrl: cleanStreamUrl,
        isLive: formData.isLiveImmediately,
        status: formData.isLiveImmediately ? 'en_vivo' : 'preparacion'
      });
      showNotification(`Velatorio de "${cleanName}" publicado y sincronizado.`);
    }

    setActiveTab('velatorios');
    setFormData({
      ...initialFormData,
      accessPin: Math.floor(1000 + Math.random() * 9000).toString()
    });
  };

  // Copy WhatsApp invitation for family
  const handleCopyWhatsAppText = (wake: WakeService) => {
    const origin = window.location.origin;
    const wakeUrl = `${origin}/velatorio/${wake.accessPin}`;
    const message = `🕊️ *Cochería J.V. González — Capilla Ardiente Virtual*\n\nAcompañamos a la familia en este momento de recogimiento en memoria de *${wake.deceasedName}*.\n\nPuede acceder a la transmisión en directo e ingresar al libro de homenajes (velas, flores y pésames) desde el siguiente enlace:\n🔗 ${wakeUrl}\n\n🔑 *PIN de Acceso Privado:* ${wake.accessPin}\n📍 *${wake.chapelRoom}* — ${wake.branchName}`;

    navigator.clipboard.writeText(message);
    setCopiedWakeId(wake.id);
    showNotification('Mensaje para WhatsApp copiado al portapapeles.');
    setTimeout(() => setCopiedWakeId(null), 3000);
  };

  // Copy TV Link
  const handleCopyTVLink = (deviceCode: string) => {
    const url = `${window.location.origin}/tv/${deviceCode}`;
    navigator.clipboard.writeText(url);
    setCopiedTVCode(deviceCode);
    showNotification(`Enlace para la pantalla ${deviceCode} copiado.`);
    setTimeout(() => setCopiedTVCode(null), 3000);
  };

  const pendingModerationsCount = moderationQueue.filter(m => m.status === 'pendiente').length;
  const liveWakesCount = wakeServices.filter(w => w.status === 'en_vivo').length;
  const activeTVsCount = tvDevices.filter(tv => tv.isOnline).length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans select-none">
      
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Top Bar Institutional Header */}
      <header className="bg-stone-900 border-b border-stone-800 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
            <EmblemIcon primaryColor="#D97706" className="w-6 h-6 drop-shadow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-base sm:text-lg tracking-wide text-stone-100">
                Cochería J.V. González
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-600/20 border border-amber-500/40 text-amber-300 font-bold uppercase tracking-wider font-mono">
                Panel de Guardia
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-stone-400">
              <span>Operador:</span>
              <span className="text-stone-200 font-medium font-mono">{user?.email || 'Personal Autorizado'}</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded-md font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Sesión Segura</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-xs font-semibold text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            <span>Ver Web Pública</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-900/60 text-xs font-semibold text-red-300 hover:text-red-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </header>

      {/* Status Highlights Bar */}
      <div className="bg-stone-900/60 border-b border-stone-800/80 px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4 text-xs overflow-x-auto">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-stone-400">Transmisiones en Vivo:</span>
            <strong className="text-stone-100 font-mono">{liveWakesCount}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-stone-400">Pantallas TV Box:</span>
            <strong className="text-stone-100 font-mono">{activeTVsCount} conectadas</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-stone-400">Condolencias Pendientes:</span>
            <strong className="text-amber-300 font-mono font-bold">{pendingModerationsCount}</strong>
          </div>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs shadow-inner">
          <button
            onClick={() => setActiveTab('velatorios')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'velatorios'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Velatorios ({wakeServices.length})</span>
          </button>

          <button
            onClick={() => {
              if (editingWakeId) {
                setActiveTab('nuevo');
              } else {
                setFormData({
                  ...initialFormData,
                  accessPin: Math.floor(1000 + Math.random() * 9000).toString()
                });
                setActiveTab('nuevo');
              }
            }}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'nuevo'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {editingWakeId ? <Edit3 className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
            <span>{editingWakeId ? '✏️ Modificar' : '+ Nuevo Servicio'}</span>
          </button>

          <button
            onClick={() => setActiveTab('tv_kiosk')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tv_kiosk'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Control TV Box ({tvDevices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('moderacion')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer relative ${
              activeTab === 'moderacion'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Condolencias</span>
            {pendingModerationsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                {pendingModerationsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8">

        {/* ── TAB 1: VELATORIOS EN CURSO ── */}
        {activeTab === 'velatorios' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                  Servicios y Capillas en Vivo
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  Administre las salas virtuales activas, enlaces de YouTube, PINs familiares y estados de transmisión.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingWakeId(null);
                  setFormData({
                    ...initialFormData,
                    accessPin: Math.floor(1000 + Math.random() * 9000).toString()
                  });
                  setActiveTab('nuevo');
                }}
                className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nuevo Velatorio</span>
              </button>
            </div>

            {wakeServices.length === 0 ? (
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-12 text-center text-stone-400">
                <Users className="w-12 h-12 mx-auto text-stone-600 mb-3" />
                <p className="font-serif text-lg">No hay velatorios registrados en este momento.</p>
                <button
                  onClick={() => {
                    setEditingWakeId(null);
                    setFormData({
                      ...initialFormData,
                      accessPin: Math.floor(1000 + Math.random() * 9000).toString()
                    });
                    setActiveTab('nuevo');
                  }}
                  className="mt-4 px-4 py-2 bg-amber-600 text-stone-950 rounded-xl text-xs font-bold"
                >
                  Registrar Primer Velatorio
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {wakeServices.map(wake => {
                  const isLive = wake.status === 'en_vivo';
                  return (
                    <div
                      key={wake.id}
                      className={`bg-stone-900/90 border ${
                        isLive ? 'border-amber-500/50 shadow-amber-950/20' : 'border-stone-800'
                      } rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between gap-5 transition-all`}
                    >
                      {/* Top Header Card */}
                      <div className="flex items-start gap-4">
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-600/50 shadow-md flex-shrink-0 bg-stone-950 flex items-center justify-center">
                          {wake.photoUrl ? (
                            <img
                              src={wake.photoUrl}
                              alt={wake.deceasedName}
                              className="w-full h-full object-cover filter grayscale"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-900 to-stone-950 text-amber-400 font-serif font-bold text-lg select-none">
                              <span>{wake.deceasedName.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase() || '🕊️'}</span>
                              <span className="text-[8px] font-sans font-normal text-stone-500 tracking-wider uppercase">Homenaje</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider ${
                              isLive 
                                ? 'bg-red-600/20 text-red-400 border border-red-500/40' 
                                : 'bg-stone-800 text-stone-400 border border-stone-700'
                            }`}>
                              {isLive ? '🔴 EN VIVO' : '⚪ EN PREPARACIÓN'}
                            </span>
                            <span className="text-xs text-stone-400 font-mono">
                              PIN: <strong className="text-amber-400 font-bold tracking-widest">{wake.accessPin}</strong>
                            </span>
                          </div>

                          <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-100 truncate">
                            {wake.deceasedName}
                          </h3>

                          <p className="text-xs text-stone-400 font-mono">
                            {wake.birthYear && wake.passedYear ? `${wake.birthYear} — ${wake.passedYear} ` : ''}
                            {wake.age ? `(${wake.age} años)` : ''}
                          </p>

                          <div className="flex items-center gap-1.5 text-xs text-stone-300 mt-2">
                            <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            <span className="truncate">{wake.chapelRoom} • {wake.branchName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stream & Cortege details */}
                      <div className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-stone-400">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Cortejo:</span>
                          </span>
                          <span className="font-medium text-stone-200 truncate max-w-[240px]">{wake.cortegeTime || 'A confirmar'}</span>
                        </div>
                        <div className="flex items-center justify-between text-stone-400">
                          <span className="flex items-center gap-1.5">
                            <Radio className="w-3.5 h-3.5 text-red-400" />
                            <span>Transmisión:</span>
                          </span>
                          <span className="font-mono text-[11px] text-amber-300 truncate max-w-[240px]">
                            {wake.streamUrl || 'Sin streaming configurado'}
                          </span>
                        </div>
                      </div>

                      {/* Actions toolbar */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-800/80 flex-wrap">
                        {/* WhatsApp family message */}
                        <button
                          onClick={() => handleCopyWhatsAppText(wake)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            copiedWakeId === wake.id 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300'
                          }`}
                          title="Copiar mensaje con link y PIN para WhatsApp de la familia"
                        >
                          {copiedWakeId === wake.id ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                          <span>{copiedWakeId === wake.id ? 'Copiado' : 'Link WhatsApp'}</span>
                        </button>

                        {/* View in virtual wake */}
                        <a
                          href={`/velatorio/${wake.accessPin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-xs font-semibold text-stone-200 flex items-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                          <span>Ver Capilla</span>
                        </a>

                        {/* Edit Wake */}
                        <button
                          onClick={() => handleStartEdit(wake)}
                          className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Editar datos del velatorio"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        {/* Toggle Live */}
                        <button
                          onClick={() => setWakeStatus(wake.id, isLive ? 'preparacion' : 'en_vivo')}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isLive 
                              ? 'bg-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-600/30' 
                              : 'bg-red-600 hover:bg-red-500 text-white'
                          }`}
                        >
                          {isLive ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                          <span>{isLive ? 'Pausar Transmisión' : 'Iniciar Directo'}</span>
                        </button>

                        {/* Delete/Archive */}
                        <button
                          onClick={() => {
                            if (confirm(`¿Finalizar y archivar el velatorio de ${wake.deceasedName}?`)) {
                              deleteWakeService(wake.id);
                              showNotification(`Velatorio de ${wake.deceasedName} archivado.`);
                            }
                          }}
                          className="p-2 rounded-xl text-stone-500 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Finalizar y archivar servicio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: NUEVO / MODIFICAR VELATORIO FORM ── */}
        {activeTab === 'nuevo' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                  {editingWakeId ? 'Modificar Servicio Velatorio' : 'Alta de Servicio Velatorio'}
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 mt-1">
                  {editingWakeId 
                    ? `Actualizando los datos del velatorio. Los cambios se guardarán y sincronizarán en tiempo real.`
                    : 'Complete los datos para habilitar la Capilla Virtual, el enlace para familiares y sincronizar el Smart TV de la sala.'}
                </p>
              </div>

              {editingWakeId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-xs font-semibold text-stone-300 transition-colors"
                >
                  Cancelar Edición
                </button>
              )}
            </div>

            <form onSubmit={handleSaveWake} className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
              
              {/* Deceased Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  Nombre y Apellido del Homenajeado *
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.deceasedName}
                  onChange={e => setFormData({ ...formData, deceasedName: e.target.value })}
                  placeholder="Ej: Don Roberto Ernesto Figueroa"
                  className="w-full px-4 py-3 bg-stone-950 border border-stone-700 focus:border-amber-500 rounded-2xl text-stone-100 text-sm focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Years & Age */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Año Nacimiento
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Ej: 1943"
                    value={formData.birthYear}
                    onChange={e => handleBirthYearChange(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-950 border border-stone-700 rounded-2xl text-stone-100 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Año Fallecimiento
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Ej: 2026"
                    value={formData.passedYear}
                    onChange={e => handlePassedYearChange(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-950 border border-stone-700 rounded-2xl text-stone-100 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Edad (Auto)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={130}
                    placeholder="Años"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value === '' ? '' : sanitizeAge(e.target.value) })}
                    className="w-full px-4 py-3 bg-stone-950 border border-stone-700 rounded-2xl text-stone-100 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  URL de Foto Conmemorativa (Opcional)
                </label>
                <input
                  type="url"
                  maxLength={500}
                  value={formData.photoUrl}
                  onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://... (dejar vacío si no hay foto para mostrar monograma solemne)"
                  className="w-full px-4 py-3 bg-stone-950 border border-stone-700 focus:border-amber-500 rounded-2xl text-stone-100 text-sm"
                />
              </div>

              {/* Epitaph */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  Epitafio / Frase Recordatoria (Opcional)
                </label>
                <input
                  type="text"
                  maxLength={250}
                  value={formData.epitaph}
                  onChange={e => setFormData({ ...formData, epitaph: e.target.value })}
                  placeholder="Ej: Su recuerdo vivirá por siempre en nuestros corazones."
                  className="w-full px-4 py-3 bg-stone-950 border border-stone-700 focus:border-amber-500 rounded-2xl text-stone-100 text-sm"
                />
              </div>

              {/* Branch & Chapel Room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Sucursal
                  </label>
                  <select
                    value={formData.branchName}
                    onChange={e => setFormData({ ...formData, branchName: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-950 border border-stone-700 rounded-2xl text-stone-100 text-sm"
                  >
                    <option value="Casa Central • Joaquín V. González">Casa Central • Joaquín V. González</option>
                    <option value="Sucursal San José de Metán">Sucursal San José de Metán</option>
                    <option value="Sucursal General Güemes">Sucursal General Güemes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Sala Asignada
                  </label>
                  <select
                    value={formData.chapelRoom}
                    onChange={e => setFormData({ ...formData, chapelRoom: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-950 border border-stone-700 rounded-2xl text-stone-100 text-sm"
                  >
                    <option value="Sala Magna A">Sala Magna A (Central)</option>
                    <option value="Sala B (Capilla Menor)">Sala B (Capilla Menor)</option>
                    <option value="Sala Memorial Metán">Sala Memorial Metán</option>
                    <option value="Sala Jardín Güemes">Sala Jardín Güemes</option>
                  </select>
                </div>
              </div>

              {/* Cortege Time */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                  Horario y Destino del Cortejo (Opcional)
                </label>
                <input
                  type="text"
                  maxLength={150}
                  value={formData.cortegeTime}
                  onChange={e => setFormData({ ...formData, cortegeTime: e.target.value })}
                  placeholder="Ej: Mañana a las 10:00 hs hacia Cementerio Parque El Recuerdo"
                  className="w-full px-4 py-3 bg-stone-950 border border-stone-700 focus:border-amber-500 rounded-2xl text-stone-100 text-sm"
                />
              </div>

              {/* Stream URL & PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Enlace de Transmisión (YouTube Live / Cámara)
                  </label>
                  <input
                    type="text"
                    maxLength={500}
                    value={formData.streamUrl}
                    onChange={e => setFormData({ ...formData, streamUrl: e.target.value })}
                    placeholder="https://youtube.com/live/... o dejar vacío"
                    className="w-full px-4 py-3 bg-stone-950 border border-stone-700 focus:border-amber-500 rounded-2xl text-stone-100 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    PIN de Acceso Privado para la Familia
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={8}
                      value={formData.accessPin}
                      onChange={e => setFormData({ ...formData, accessPin: sanitizePin(e.target.value, 8) })}
                      className="w-full px-4 py-3 bg-stone-950 border border-stone-700 rounded-2xl text-stone-100 text-sm font-mono tracking-widest text-center"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, accessPin: Math.floor(1000 + Math.random() * 9000).toString() })}
                      className="px-3 bg-stone-800 hover:bg-stone-750 text-stone-300 rounded-xl text-xs font-medium"
                      title="Generar nuevo PIN"
                    >
                      Aleatorio
                    </button>
                  </div>
                </div>
              </div>

              {/* Immediate Live Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-950 border border-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isLiveImmediately}
                    onChange={e => setFormData({ ...formData, isLiveImmediately: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded bg-stone-900 border-stone-700"
                  />
                  <div>
                    <strong className="block text-xs text-stone-200">
                      {editingWakeId ? 'Mantener o poner transmisión en directo activa' : 'Activar transmisión en directo de inmediato'}
                    </strong>
                    <span className="text-[11px] text-stone-400">
                      Sincroniza automáticamente la pantalla TV Box de la sala seleccionada.
                    </span>
                  </div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={editingWakeId ? handleCancelEdit : () => setActiveTab('velatorios')}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-lg cursor-pointer flex items-center gap-2"
                >
                  {editingWakeId ? <Check className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                  <span>{editingWakeId ? 'Guardar Cambios' : 'Publicar y Activar Servicio'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ── TAB 3: CONTROL REMOTO TV BOX ── */}
        {activeTab === 'tv_kiosk' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                Control Remoto de Pantallas TV Box en Salas
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Conmute de manera instantánea entre el Modo Transmisión (homenaje al difunto y condolencias) y el Modo Espera (guardia institucional 24hs) para cada Smart TV.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {tvDevices.map(tv => {
                const isTransmitting = tv.mode === 'transmision';
                const assignedWake = tv.assignedWakeId ? wakeServices.find(w => w.id === tv.assignedWakeId) : undefined;

                return (
                  <div
                    key={tv.deviceCode}
                    className={`bg-stone-900/90 border ${
                      isTransmitting ? 'border-amber-500/50 shadow-amber-950/20' : 'border-stone-800'
                    } rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between gap-5`}
                  >
                    <div>
                      {/* Device Header */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${tv.isOnline ? 'bg-emerald-500' : 'bg-stone-600'}`} />
                          <span className="font-mono text-xs font-bold text-stone-300">
                            {tv.deviceCode}
                          </span>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-mono ${
                          isTransmitting 
                            ? 'bg-red-600/20 text-red-400 border border-red-500/40' 
                            : 'bg-stone-800 text-stone-400 border border-stone-700'
                        }`}>
                          {isTransmitting ? '🔴 Modo Transmisión' : '⚪ Modo Espera'}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-100">
                        {tv.roomName}
                      </h3>
                      <p className="text-xs text-stone-400">
                        {tv.branchName}
                      </p>

                      {/* Current Display Status */}
                      <div className="mt-4 p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs">
                        <div className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-1">
                          Contenido actual en la pantalla:
                        </div>
                        {assignedWake ? (
                          <div className="flex items-center gap-3 mt-2">
                            {assignedWake.photoUrl ? (
                              <img
                                src={assignedWake.photoUrl}
                                alt=""
                                className="w-10 h-10 rounded-xl object-cover grayscale flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-750 flex items-center justify-center text-amber-400 text-xs font-serif font-bold flex-shrink-0">
                                {assignedWake.deceasedName.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <strong className="block text-stone-200 text-xs sm:text-sm">
                                {assignedWake.deceasedName}
                              </strong>
                              <span className="text-[11px] text-stone-400">
                                {assignedWake.birthYear} — {assignedWake.passedYear}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-stone-400 italic py-1">
                            Sin velatorio asignado (Mostrando pantalla institucional de guardia 24hs).
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Controls & Actions */}
                    <div className="space-y-3 pt-3 border-t border-stone-800/80">
                      
                      {/* 1-Click Remote Toggle */}
                      <button
                        onClick={() => {
                          toggleTVMode(tv.deviceCode);
                          showNotification(`Pantalla ${tv.deviceCode} conmutada a ${!isTransmitting ? 'Modo Transmisión' : 'Modo Espera'}.`);
                        }}
                        className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                          isTransmitting
                            ? 'bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700'
                            : 'bg-red-700 hover:bg-red-600 text-white'
                        }`}
                      >
                        <Radio className="w-4 h-4" />
                        <span>{isTransmitting ? 'Conmutar a Modo Espera' : 'Conmutar a Modo Transmisión'}</span>
                      </button>

                      {/* Assign Wake Selector */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-stone-400 flex-shrink-0">Asignar difunto:</span>
                        <select
                          value={tv.assignedWakeId || ''}
                          onChange={e => assignWakeToTV(tv.deviceCode, e.target.value || null)}
                          className="w-full bg-stone-950 border border-stone-700 rounded-xl px-2.5 py-1.5 text-stone-200 text-xs"
                        >
                          <option value="">(Ninguno / Sala Libre)</option>
                          {wakeServices.map(w => (
                            <option key={w.id} value={w.id}>{w.deceasedName}</option>
                          ))}
                        </select>
                      </div>

                      {/* Links */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          onClick={() => handleCopyTVLink(tv.deviceCode)}
                          className="text-xs text-stone-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedTVCode === tv.deviceCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedTVCode === tv.deviceCode ? 'Enlace copiado' : 'Copiar URL para el TV'}</span>
                        </button>

                        <a
                          href={`/tv/${tv.deviceCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors font-medium"
                        >
                          <span>Abrir visor TV</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 4: MODERADOR DE CONDOLENCIAS ── */}
        {activeTab === 'moderacion' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                Moderación de Homenajes y Condolencias
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Revise los mensajes, velas y flores enviados por familiares y allegados desde la web antes o durante su aparición en las pantallas TV Box de las salas.
              </p>
            </div>

            <div className="space-y-3">
              {moderationQueue.map(item => {
                const targetWake = wakeServices.find(w => w.id === item.wakeId);
                const isApproved = item.status === 'aprobado';
                const isRejected = item.status === 'rechazado';

                return (
                  <div
                    key={item.id}
                    className={`bg-stone-900 border ${
                      isApproved 
                        ? 'border-emerald-600/40' 
                        : isRejected 
                          ? 'border-red-900/40 opacity-60' 
                          : 'border-amber-500/50 bg-amber-950/10'
                    } rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all`}
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-stone-100 text-sm">
                          {item.senderName}
                        </span>
                        <span className="text-xs text-stone-400">
                          de {item.senderCity}
                        </span>
                        <span className="text-xs text-stone-500">•</span>
                        <span className="text-xs text-stone-500 font-mono">
                          {item.timestamp}
                        </span>

                        {targetWake && (
                          <span className="text-[11px] px-2 py-0.5 rounded-lg bg-stone-800 text-stone-300 font-serif">
                            Para: {targetWake.deceasedName}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-stone-300 italic">
                        "{item.message}"
                      </p>
                    </div>

                    {/* Approval Controls */}
                    <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono mr-2 ${
                        isApproved 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                          : isRejected 
                            ? 'bg-red-950 text-red-400 border border-red-900' 
                            : 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                      }`}>
                        {item.status}
                      </span>

                      <button
                        onClick={() => {
                          approveCondolence(item.id);
                          showNotification('Condolencia aprobada para mostrarse en el TV Box.');
                        }}
                        disabled={isApproved}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isApproved 
                            ? 'opacity-40 cursor-not-allowed bg-stone-800 text-stone-500' 
                            : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aprobar TV</span>
                      </button>

                      <button
                        onClick={() => {
                          rejectCondolence(item.id);
                          showNotification('Condolencia descartada.');
                        }}
                        disabled={isRejected}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isRejected 
                            ? 'opacity-40 cursor-not-allowed bg-stone-800 text-stone-500' 
                            : 'bg-stone-800 hover:bg-red-950 hover:text-red-300 text-stone-400'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Ocultar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-800 p-4 text-center text-xs text-stone-500">
        <div className="flex items-center justify-center gap-4">
          <span>Cochería J.V. González • Backoffice de Guardia v2.0</span>
          <span>•</span>
          <button
            onClick={async () => {
              if (confirm('¿Vaciar y reiniciar el sistema a cero? Se eliminarán los velatorios tanto de la memoria del navegador como de la base de datos Supabase.')) {
                await resetToDefaults();
                showNotification('Sistema reiniciado y base de datos limpia.');
              }
            }}
            className="text-stone-500 hover:text-amber-400 underline cursor-pointer"
          >
            Purgar base de datos y reiniciar a limpio
          </button>
        </div>
      </footer>

    </div>
  );
};
