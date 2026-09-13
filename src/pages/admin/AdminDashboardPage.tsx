import React, { useState, useMemo } from 'react';
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
  ArrowRight,
  HelpCircle,
  Search,
  Building2,
  RotateCcw,
  Sun,
  Moon
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useWakeServices } from '../../context/WakeServicesContext';
import { useTheme } from '../../context/ThemeContext';
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
  const { isDark, toggleTheme } = useTheme();
  const { 
    wakeServices, 
    tvDevices, 
    moderationQueue, 
    createWakeService, 
    updateWakeService, 
    deleteWakeService, 
    setWakeStatus, 
    createTVDevice,
    deleteTVDevice,
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
  const [showNewTVModal, setShowNewTVModal] = useState(false);
  const [showTVGuideModal, setShowTVGuideModal] = useState(false);

  // Sub-filtros para la pestaña de velatorios
  const [wakeFilterTab, setWakeFilterTab] = useState<'activos' | 'finalizados' | 'todos'>('activos');
  const [wakeSearchQuery, setWakeSearchQuery] = useState('');
  const [wakeBranchFilter, setWakeBranchFilter] = useState('all');

  // Contadores y sucursales disponibles
  const activeWakesCount = useMemo(() => 
    wakeServices.filter(w => w.status === 'en_vivo' || w.status === 'preparacion').length,
    [wakeServices]
  );

  const finishedWakesCount = useMemo(() => 
    wakeServices.filter(w => w.status === 'finalizado').length,
    [wakeServices]
  );

  const availableBranches = useMemo(() => {
    const branches = new Set<string>();
    wakeServices.forEach(w => {
      if (w.branchName) branches.add(w.branchName);
    });
    branches.add('Casa Central • Joaquín V. González');
    branches.add('Sucursal San José de Metán');
    branches.add('Sucursal El Quebrachal');
    branches.add('Sucursal Rosario de la Frontera');
    return Array.from(branches);
  }, [wakeServices]);

  // Lista filtrada reactiva de velatorios
  const displayedWakes = useMemo(() => {
    return wakeServices.filter(w => {
      // Filtro de pestaña de estado
      if (wakeFilterTab === 'activos' && w.status === 'finalizado') return false;
      if (wakeFilterTab === 'finalizados' && w.status !== 'finalizado') return false;

      // Filtro de sucursal
      if (wakeBranchFilter !== 'all' && w.branchName !== wakeBranchFilter) return false;

      // Filtro de búsqueda por texto o PIN
      if (wakeSearchQuery.trim()) {
        const query = wakeSearchQuery.toLowerCase().trim();
        const matchName = w.deceasedName.toLowerCase().includes(query);
        const matchPin = (w.accessPin || '').includes(query);
        const matchRoom = (w.chapelRoom || '').toLowerCase().includes(query);
        const matchBranch = (w.branchName || '').toLowerCase().includes(query);
        if (!matchName && !matchPin && !matchRoom && !matchBranch) return false;
      }

      return true;
    });
  }, [wakeServices, wakeFilterTab, wakeBranchFilter, wakeSearchQuery]);

  const [newTVData, setNewTVData] = useState({
    deviceCode: '',
    roomName: '',
    branchName: 'Casa Central • Joaquín V. González'
  });

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

  const handleCreateTV = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTVData.deviceCode.trim() || !newTVData.roomName.trim()) {
      showNotification('Complete el código y el nombre de la sala.');
      return;
    }
    await createTVDevice(newTVData);
    showNotification(`Sala "${newTVData.roomName}" (${newTVData.deviceCode.toUpperCase()}) vinculada.`);
    setNewTVData({
      deviceCode: '',
      roomName: '',
      branchName: 'Casa Central • Joaquín V. González'
    });
    setShowNewTVModal(false);
  };

  const handleDeleteTV = async (tvCode: string, roomName: string) => {
    if (window.confirm(`¿Está seguro de desvincular la pantalla "${roomName}" (${tvCode})?`)) {
      await deleteTVDevice(tvCode);
      showNotification(`Pantalla ${tvCode} eliminada.`);
    }
  };

  const pendingModerationsCount = moderationQueue.filter(m => m.status === 'pendiente').length;
  const liveWakesCount = wakeServices.filter(w => w.status === 'en_vivo').length;
  const activeTVsCount = tvDevices.filter(tv => tv.isOnline).length;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-stone-950 text-stone-100' : 'bg-[#FAF9F7] text-stone-900'} flex flex-col font-sans select-none transition-colors duration-200`}>
      
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400/40 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-100" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Top Bar Institutional Header */}
      <header className={`${isDark ? 'bg-stone-900/90 border-stone-800' : 'bg-white/95 border-stone-200 shadow-xs'} border-b px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 z-20 sticky top-0 backdrop-blur-md transition-colors`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs ${
            isDark ? 'bg-amber-600/20 border-amber-500/30' : 'bg-amber-50 border-amber-200'
          }`}>
            <EmblemIcon primaryColor="#D97706" className="w-6 h-6 drop-shadow-xs" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`font-serif font-bold text-base sm:text-lg tracking-wide ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                Cochería J.V. González
              </h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider font-mono ${
                isDark ? 'bg-amber-600/20 border-amber-500/40 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900'
              }`}>
                Panel de Guardia
              </span>
            </div>
            <div className={`flex items-center gap-2 text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              <span>Operador:</span>
              <span className={`font-semibold font-mono ${isDark ? 'text-stone-200' : 'text-stone-700'}`}>{user?.email || 'Personal Autorizado'}</span>
              <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md font-medium border ${
                isDark ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40' : 'text-emerald-800 bg-emerald-50 border-emerald-200'
              }`}>
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Sesión Segura</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Selector Toggle (☀️ / 🌙) */}
          <button
            onClick={toggleTheme}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isDark 
                ? 'bg-stone-800 hover:bg-stone-750 border-stone-700 text-amber-300' 
                : 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
            }`}
            title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-stone-600" />}
            <span className="hidden md:inline">{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isDark 
                ? 'bg-stone-800 hover:bg-stone-750 border-stone-700 text-stone-300 hover:text-white' 
                : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700 hover:text-stone-900'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
            <span>Ver Web Pública</span>
          </button>

          <button
            onClick={onLogout}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark 
                ? 'bg-red-950/60 hover:bg-red-900/80 border-red-900/60 text-red-300 hover:text-red-100' 
                : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8">

        {/* ── INTERACTIVE MODERN KPI HERO GRID ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
          {/* Card 1: Transmisiones en Vivo */}
          <div 
            onClick={() => {
              setActiveTab('velatorios');
              setWakeFilterTab('activos');
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
              isDark 
                ? 'bg-stone-900/80 hover:bg-stone-900 border-stone-800 hover:border-red-500/40' 
                : 'bg-white hover:bg-red-50/20 border-stone-200/90 hover:border-red-300 shadow-xs hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                En Directo
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? 'bg-red-950/60 text-red-400 border border-red-800/40' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-serif ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                {liveWakesCount}
              </span>
              <span className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>salas activas</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1 truncate">
              {liveWakesCount > 0 ? 'Transmitiendo en capillas' : 'Sin transmisiones'}
            </p>
          </div>

          {/* Card 2: Pantallas TV Box */}
          <div 
            onClick={() => setActiveTab('tv_kiosk')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
              isDark 
                ? 'bg-stone-900/80 hover:bg-stone-900 border-stone-800 hover:border-emerald-500/40' 
                : 'bg-white hover:bg-emerald-50/20 border-stone-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                Pantallas TV Box
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                <Tv className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-serif ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                {activeTVsCount} <span className="text-sm font-normal text-stone-500">/ {tvDevices.length}</span>
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1 truncate">
              {activeTVsCount === tvDevices.length ? 'Todas sincronizadas 24hs' : `${activeTVsCount} conectadas`}
            </p>
          </div>

          {/* Card 3: Condolencias por Moderar */}
          <div 
            onClick={() => setActiveTab('moderacion')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
              isDark 
                ? 'bg-stone-900/80 hover:bg-stone-900 border-stone-800 hover:border-amber-500/40' 
                : 'bg-white hover:bg-amber-50/20 border-stone-200/90 hover:border-amber-300 shadow-xs hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                Condolencias
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-serif ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                {pendingModerationsCount}
              </span>
              <span className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>pendientes</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1 truncate">
              {pendingModerationsCount > 0 ? 'Mensajes por revisar' : 'Bandeja al día ✓'}
            </p>
          </div>

          {/* Card 4: Archivo Memorial */}
          <div 
            onClick={() => {
              setActiveTab('velatorios');
              setWakeFilterTab('todos');
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
              isDark 
                ? 'bg-stone-900/80 hover:bg-stone-900 border-stone-800 hover:border-amber-500/40' 
                : 'bg-white hover:bg-stone-100/50 border-stone-200/90 hover:border-stone-300 shadow-xs hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                Homenajes Totales
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? 'bg-stone-800 text-stone-300 border border-stone-700' : 'bg-stone-100 text-stone-700 border border-stone-200'}`}>
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-serif ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                {wakeServices.length}
              </span>
              <span className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>registrados</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1 truncate">
              {finishedWakesCount} concluidos en archivo
            </p>
          </div>
        </div>

        {/* ── SEGMENTED TAB NAVIGATION ── */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className={`flex items-center p-1.5 rounded-2xl border ${
            isDark ? 'bg-stone-900/90 border-stone-800' : 'bg-stone-200/70 border-stone-300/70'
          } text-xs shadow-inner flex-wrap gap-1`}>
            <button
              onClick={() => setActiveTab('velatorios')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'velatorios'
                  ? isDark ? 'bg-amber-600 text-stone-950 shadow-md font-bold' : 'bg-white text-stone-950 shadow-sm font-bold'
                  : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-amber-500" />
              <span>Velatorios & Capillas ({wakeServices.length})</span>
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
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'nuevo'
                  ? isDark ? 'bg-amber-600 text-stone-950 shadow-md font-bold' : 'bg-white text-stone-950 shadow-sm font-bold'
                  : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              {editingWakeId ? <Edit3 className="w-3.5 h-3.5 text-amber-500" /> : <PlusCircle className="w-3.5 h-3.5 text-amber-500" />}
              <span>{editingWakeId ? '✏️ Modificar' : '+ Nuevo Servicio'}</span>
            </button>

            <button
              onClick={() => setActiveTab('tv_kiosk')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'tv_kiosk'
                  ? isDark ? 'bg-amber-600 text-stone-950 shadow-md font-bold' : 'bg-white text-stone-950 shadow-sm font-bold'
                  : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <Tv className="w-3.5 h-3.5 text-amber-500" />
              <span>Control TV Box ({tvDevices.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('moderacion')}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 cursor-pointer relative ${
                activeTab === 'moderacion'
                  ? isDark ? 'bg-amber-600 text-stone-950 shadow-md font-bold' : 'bg-white text-stone-950 shadow-sm font-bold'
                  : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
              <span>Condolencias</span>
              {pendingModerationsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {pendingModerationsCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
              isDark ? 'bg-stone-900 border-stone-800 text-stone-400' : 'bg-white border-stone-200 text-stone-600 shadow-xs'
            }`}>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Guardia Activa • 24hs</span>
            </span>
          </div>
        </div>

        {/* ── TAB 1: VELATORIOS Y ARCHIVO HISTÓRICO ── */}
        {activeTab === 'velatorios' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className={`text-xl sm:text-2xl font-serif font-bold ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                  Gestión de Velatorios & Capillas
                </h2>
                <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  Administre las capillas activas de hoy, transmisión en vivo, PINs de familiares y el archivo histórico conmemorativo.
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
                className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nuevo Velatorio</span>
              </button>
            </div>

            {/* ── Widget de Ocupación de Salas Físicas (TV Box) ── */}
            {tvDevices.length > 0 && (
              <div className={`${isDark ? 'bg-stone-900/80 border-stone-800' : 'bg-white border-stone-200 shadow-xs'} rounded-2xl p-4 transition-colors`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Tv className="w-4 h-4 text-amber-500" />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                      Disponibilidad de Capillas Físicas & Pantallas
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {tvDevices.filter(t => {
                      const w = wakeServices.find(wake => wake.id === t.assignedWakeId);
                      return !!w && w.status !== 'finalizado';
                    }).length} de {tvDevices.length} salas ocupadas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {tvDevices.map(tv => {
                    const assignedWake = wakeServices.find(w => w.id === tv.assignedWakeId);
                    const isOccupied = !!assignedWake && assignedWake.status !== 'finalizado';

                    return (
                      <div 
                        key={tv.deviceCode}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                          isOccupied
                            ? isDark ? 'bg-amber-950/25 border-amber-500/40 text-stone-200' : 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-xs'
                            : isDark ? 'bg-stone-900/40 border-stone-800/70 text-stone-400' : 'bg-stone-50 border-stone-200/80 text-stone-600'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              isOccupied ? 'bg-red-500 animate-pulse' : 'bg-stone-400'
                            }`} />
                            <p className={`font-semibold truncate ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>{tv.roomName}</p>
                          </div>
                          <p className={`text-[11px] truncate mt-0.5 font-medium ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                            {isOccupied ? assignedWake.deceasedName : 'Libre • Pantalla en espera 24hs'}
                          </p>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0 ${
                          isOccupied 
                            ? isDark ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/30' : 'bg-red-100 text-red-800 font-bold border border-red-200'
                            : isDark ? 'bg-stone-800 text-stone-500' : 'bg-stone-200/70 text-stone-600'
                        }`}>
                          {isOccupied ? 'EN CURSO' : 'LIBRE'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Sub-pestañas de Navegación por Estado ── */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 ${
              isDark ? 'border-stone-800/80' : 'border-stone-200/90'
            }`}>
              <div className={`flex items-center gap-1.5 p-1 rounded-2xl border w-fit flex-wrap shadow-inner ${
                isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-200/60 border-stone-300/70'
              }`}>
                <button
                  onClick={() => setWakeFilterTab('activos')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    wakeFilterTab === 'activos'
                      ? isDark ? 'bg-amber-600 text-stone-950 shadow-md font-bold' : 'bg-white text-stone-950 shadow-xs font-bold'
                      : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${activeWakesCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                  <span>En Curso / Activos</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                    wakeFilterTab === 'activos' 
                      ? isDark ? 'bg-stone-950/30 text-stone-950' : 'bg-amber-100 text-amber-900'
                      : isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-300/80 text-stone-700'
                  }`}>
                    {activeWakesCount}
                  </span>
                </button>

                <button
                  onClick={() => setWakeFilterTab('finalizados')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    wakeFilterTab === 'finalizados'
                      ? isDark ? 'bg-stone-200 text-stone-950 shadow-md font-bold' : 'bg-white text-stone-950 shadow-xs font-bold'
                      : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>🕊️ Historial Concluidos</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                    wakeFilterTab === 'finalizados' 
                      ? isDark ? 'bg-stone-400/40 text-stone-950' : 'bg-stone-200 text-stone-800'
                      : isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-300/80 text-stone-700'
                  }`}>
                    {finishedWakesCount}
                  </span>
                </button>

                <button
                  onClick={() => setWakeFilterTab('todos')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    wakeFilterTab === 'todos'
                      ? isDark ? 'bg-stone-800 text-amber-300 border border-amber-600/40 font-bold shadow-md' : 'bg-white text-stone-950 shadow-xs font-bold'
                      : isDark ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>Todos</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                    isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-300/80 text-stone-700'
                  }`}>
                    {wakeServices.length}
                  </span>
                </button>
              </div>

              {/* Indicador de vista actual */}
              <div className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                <span>Mostrando:</span>
                <strong className={`font-mono font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{displayedWakes.length}</strong>
                <span>servicios</span>
              </div>
            </div>

            {/* ── Buscador y Filtro por Sucursal ── */}
            <div className={`flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl border ${
              isDark ? 'bg-stone-900/50 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
            }`}>
              <div className="relative flex-1">
                <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`} />
                <input
                  type="text"
                  placeholder="Buscar por fallecido, sala o PIN de 4 dígitos..."
                  value={wakeSearchQuery}
                  onChange={(e) => setWakeSearchQuery(e.target.value)}
                  className={`w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl border focus:border-amber-500 focus:outline-none transition-colors ${
                    isDark ? 'bg-stone-950 border-stone-800 text-stone-200 placeholder:text-stone-500' : 'bg-stone-50 border-stone-200 text-stone-900 placeholder:text-stone-400 focus:bg-white'
                  }`}
                />
                {wakeSearchQuery && (
                  <button
                    onClick={() => setWakeSearchQuery('')}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs px-1 cursor-pointer ${
                      isDark ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs border ${
                  isDark ? 'bg-stone-950 border-stone-800 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}>
                  <Building2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <select
                    value={wakeBranchFilter}
                    onChange={(e) => setWakeBranchFilter(e.target.value)}
                    className={`bg-transparent text-xs focus:outline-none cursor-pointer pr-1 ${
                      isDark ? 'text-stone-200' : 'text-stone-800'
                    }`}
                  >
                    <option value="all" className={isDark ? 'bg-stone-900 text-stone-200' : 'bg-white text-stone-900'}>Todas las sucursales</option>
                    {availableBranches.map(b => (
                      <option key={b} value={b} className={isDark ? 'bg-stone-900 text-stone-200' : 'bg-white text-stone-900'}>{b}</option>
                    ))}
                  </select>
                </div>

                {(wakeSearchQuery || wakeBranchFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setWakeSearchQuery('');
                      setWakeBranchFilter('all');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer border ${
                      isDark ? 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-300' : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
                    }`}
                    title="Restablecer filtros"
                  >
                    Restablecer
                  </button>
                )}
              </div>
            </div>

            {/* ── Contenido de Velatorios ── */}
            {wakeServices.length === 0 ? (
              <div className={`${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-sm'} border rounded-3xl p-12 text-center text-stone-400`}>
                <Users className="w-12 h-12 mx-auto text-stone-400 mb-3" />
                <p className={`font-serif text-lg ${isDark ? 'text-stone-300' : 'text-stone-800'}`}>No hay velatorios registrados en este momento.</p>
                <button
                  onClick={() => {
                    setEditingWakeId(null);
                    setFormData({
                      ...initialFormData,
                      accessPin: Math.floor(1000 + Math.random() * 9000).toString()
                    });
                    setActiveTab('nuevo');
                  }}
                  className="mt-4 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md"
                >
                  Registrar Primer Velatorio
                </button>
              </div>
            ) : displayedWakes.length === 0 ? (
              <div className={`${isDark ? 'bg-stone-900/60 border-stone-800' : 'bg-white border-stone-200 shadow-sm'} border rounded-3xl p-10 text-center space-y-3`}>
                <Users className="w-10 h-10 mx-auto text-stone-400 opacity-60" />
                {wakeFilterTab === 'activos' ? (
                  <>
                    <h3 className={`font-serif text-lg ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>No hay velatorios activos en este momento</h3>
                    <p className={`text-xs max-w-md mx-auto ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      Todas las capillas están en modo de espera. Podés consultar los servicios pasados en el historial o dar de alta uno nuevo.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setWakeFilterTab('finalizados')}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                          isDark ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700' : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200'
                        }`}
                      >
                        Ver Historial Concluidos ({finishedWakesCount})
                      </button>
                      <button
                        onClick={() => {
                          setEditingWakeId(null);
                          setFormData({
                            ...initialFormData,
                            accessPin: Math.floor(1000 + Math.random() * 9000).toString()
                          });
                          setActiveTab('nuevo');
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-colors cursor-pointer shadow-md"
                      >
                        + Nuevo Velatorio
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className={`font-serif text-lg ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>No se encontraron resultados</h3>
                    <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      No hay registros que coincidan con los filtros de búsqueda aplicados.
                    </p>
                    <button
                      onClick={() => {
                        setWakeSearchQuery('');
                        setWakeBranchFilter('all');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border ${
                        isDark ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700' : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200'
                      }`}
                    >
                      Limpiar Búsqueda
                    </button>
                  </>
                )}
              </div>
            ) : wakeFilterTab === 'finalizados' ? (
              /* ── VISTA COMPACTA PARA EL HISTORIAL ── */
              <div className="space-y-3">
                <div className={`text-xs flex items-center justify-between px-2 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  <span>Archivo de Servicios Concluidos ({displayedWakes.length})</span>
                  <span className="text-[11px]">Ordenados del más reciente al más antiguo</span>
                </div>

                <div className={`${
                  isDark ? 'bg-stone-900/90 border-stone-800 divide-stone-800/70' : 'bg-white border-stone-200 shadow-sm divide-stone-100'
                } border rounded-3xl overflow-hidden divide-y`}>
                  {displayedWakes.map(wake => (
                    <div
                      key={wake.id}
                      className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                        isDark ? 'hover:bg-stone-850/50' : 'hover:bg-stone-50/80'
                      }`}
                    >
                      {/* Avatar + Main Details */}
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border flex-shrink-0 flex items-center justify-center ${
                          isDark ? 'border-stone-700 bg-stone-950' : 'border-stone-200 bg-stone-100'
                        }`}>
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
                            <span className="text-amber-500 font-serif font-bold text-sm">
                              {wake.deceasedName.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase() || '🕊️'}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <h4 className={`font-serif font-bold text-base sm:text-lg truncate ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                              {wake.deceasedName}
                            </h4>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex-shrink-0 ${
                              isDark ? 'bg-stone-800 text-stone-400 border-stone-700' : 'bg-stone-100 text-stone-600 border-stone-200'
                            }`}>
                              🕊️ Concluido
                            </span>
                            <span className={`text-xs font-mono ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                              PIN: <strong className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{wake.accessPin}</strong>
                            </span>
                          </div>

                          <div className={`flex items-center gap-3 text-xs flex-wrap ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                            <span>
                              {wake.birthYear && wake.passedYear ? `${wake.birthYear} — ${wake.passedYear}` : ''}
                              {wake.age ? ` (${wake.age} años)` : ''}
                            </span>
                            <span>•</span>
                            <span className={`flex items-center gap-1 ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                              <MapPin className="w-3 h-3 text-amber-500" />
                              <span className="truncate">{wake.chapelRoom} • {wake.branchName}</span>
                            </span>
                            {wake.candlesCount > 0 && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-amber-600 font-medium">
                                  <Flame className="w-3 h-3 text-amber-500" />
                                  <span>{wake.candlesCount} velas encendidas</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Historical Actions Toolbar */}
                      <div className="flex items-center gap-2 flex-wrap self-end md:self-center flex-shrink-0">
                        {/* WhatsApp family link */}
                        <button
                          onClick={() => handleCopyWhatsAppText(wake)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                            copiedWakeId === wake.id 
                              ? 'bg-emerald-600 text-white border-emerald-500' 
                              : isDark 
                                ? 'bg-emerald-950/50 hover:bg-emerald-900/80 border-emerald-700/40 text-emerald-300'
                                : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800'
                          }`}
                          title="Copiar mensaje con link y PIN para WhatsApp de la familia"
                        >
                          {copiedWakeId === wake.id ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                          <span className="hidden sm:inline">{copiedWakeId === wake.id ? 'Copiado' : 'WhatsApp'}</span>
                        </button>

                        {/* View in virtual memorial */}
                        <a
                          href={`/velatorio/${wake.accessPin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            isDark ? 'bg-stone-800 hover:bg-stone-750 border-stone-700 text-stone-200' : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800'
                          }`}
                          title="Ver capilla conmemorativa"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                          <span>Ver</span>
                        </a>

                        {/* Reactivar velatorio en vivo */}
                        <button
                          onClick={() => {
                            if (confirm(`¿Reactivar el velatorio de ${wake.deceasedName} en vivo? Volverá a emitirse por pantalla y aparecer en los activos.`)) {
                              setWakeStatus(wake.id, 'en_vivo');
                              showNotification(`Servicio de ${wake.deceasedName} reactivado en vivo.`);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isDark 
                              ? 'bg-amber-600/20 hover:bg-amber-600/30 border-amber-500/40 text-amber-300' 
                              : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
                          }`}
                          title="Reactivar velatorio en vivo"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reactivar</span>
                        </button>

                        {/* Edit Wake */}
                        <button
                          onClick={() => handleStartEdit(wake)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isDark ? 'bg-stone-800 hover:bg-stone-750 border-stone-700 text-amber-400' : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
                          }`}
                          title="Editar datos del velatorio"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        {/* Delete permanently */}
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar definitivamente el registro de ${wake.deceasedName}? Esta acción borrará sus datos de la base de datos.`)) {
                              deleteWakeService(wake.id);
                              showNotification(`Velatorio de ${wake.deceasedName} eliminado.`);
                            }
                          }}
                          className={`p-2 rounded-xl transition-colors cursor-pointer ${
                            isDark ? 'text-stone-500 hover:text-red-400 hover:bg-red-950/40' : 'text-stone-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title="Eliminar definitivamente del sistema"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* ── VISTA DE TARJETAS OPERATIVAS (ACTIVOS / TODOS) ── */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {displayedWakes.map(wake => {
                  const isLive = wake.status === 'en_vivo';
                  const isFinalizado = wake.status === 'finalizado';
                  return (
                    <div
                      key={wake.id}
                      className={`border rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-5 transition-all ${
                        isDark 
                          ? isLive 
                            ? 'bg-stone-900/90 border-amber-500/50 shadow-amber-950/20' 
                            : isFinalizado 
                              ? 'bg-stone-900/90 border-stone-800/80 opacity-90' 
                              : 'bg-stone-900/90 border-stone-800'
                          : isLive
                            ? 'bg-white border-amber-300 shadow-[0_4px_24px_-4px_rgba(217,119,6,0.12)] hover:shadow-md'
                            : isFinalizado
                              ? 'bg-white border-stone-200/80 opacity-90'
                              : 'bg-white border-stone-200 shadow-xs hover:shadow-md'
                      }`}
                    >
                      {/* Top Header Card */}
                      <div className="flex items-start gap-4">
                        <div className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 shadow-xs flex-shrink-0 flex items-center justify-center ${
                          isDark ? 'border-amber-600/50 bg-stone-950' : 'border-amber-400/60 bg-stone-100'
                        }`}>
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
                            <div className={`w-full h-full flex flex-col items-center justify-center select-none ${
                              isDark ? 'bg-gradient-to-br from-stone-900 to-stone-950 text-amber-400' : 'bg-gradient-to-br from-amber-50 to-stone-100 text-amber-700'
                            }`}>
                              <span className="font-serif font-bold text-lg">{wake.deceasedName.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase() || '🕊️'}</span>
                              <span className="text-[8px] font-sans font-normal text-stone-500 tracking-wider uppercase">Homenaje</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider border ${
                              isLive 
                                ? isDark ? 'bg-red-600/20 text-red-400 border-red-500/40 animate-pulse' : 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                                : isFinalizado
                                  ? isDark ? 'bg-stone-800 text-stone-300 border-stone-700' : 'bg-stone-100 text-stone-600 border-stone-200'
                                  : isDark ? 'bg-amber-950/40 text-amber-300 border-amber-700/40' : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              {isLive ? '🔴 EN VIVO (En Pantalla y Web)' : isFinalizado ? '🕊️ FINALIZADO (Archivado)' : '⚪ EN PREPARACIÓN'}
                            </span>
                            <span className={`text-xs font-mono ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                              PIN: <strong className={`font-bold tracking-widest ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>{wake.accessPin}</strong>
                            </span>
                          </div>

                          <h3 className={`font-serif font-bold text-lg sm:text-xl truncate ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                            {wake.deceasedName}
                          </h3>

                          <p className={`text-xs font-mono ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                            {wake.birthYear && wake.passedYear ? `${wake.birthYear} — ${wake.passedYear} ` : ''}
                            {wake.age ? `(${wake.age} años)` : ''}
                          </p>

                          <div className={`flex items-center gap-1.5 text-xs mt-2 ${isDark ? 'text-stone-300' : 'text-stone-700 font-medium'}`}>
                            <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            <span className="truncate">{wake.chapelRoom} • {wake.branchName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stream & Cortege details */}
                      <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                        isDark ? 'bg-stone-950/80 border-stone-800' : 'bg-stone-50/80 border-stone-200 text-stone-700'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`flex items-center gap-1.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            <span>Cortejo:</span>
                          </span>
                          <span className={`font-medium truncate max-w-[240px] ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>{wake.cortegeTime || 'A confirmar'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`flex items-center gap-1.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                            <Radio className="w-3.5 h-3.5 text-red-500" />
                            <span>Transmisión:</span>
                          </span>
                          <span className={`font-mono text-[11px] truncate max-w-[240px] ${isDark ? 'text-amber-300' : 'text-amber-700 font-medium'}`}>
                            {wake.streamUrl || 'Sin streaming configurado'}
                          </span>
                        </div>
                      </div>

                      {/* Actions toolbar */}
                      <div className={`flex items-center justify-between gap-2 pt-2 border-t flex-wrap ${
                        isDark ? 'border-stone-800/80' : 'border-stone-100'
                      }`}>
                        {/* WhatsApp family message */}
                        <button
                          onClick={() => handleCopyWhatsAppText(wake)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                            copiedWakeId === wake.id 
                              ? 'bg-emerald-600 text-white border-emerald-500' 
                              : isDark 
                                ? 'bg-emerald-950/70 hover:bg-emerald-900 border-emerald-700/50 text-emerald-300'
                                : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800'
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
                          className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            isDark 
                              ? 'bg-stone-800 hover:bg-stone-750 border-stone-700 text-stone-200' 
                              : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800'
                          }`}
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                          <span>Ver Capilla</span>
                        </a>

                        {/* Edit Wake */}
                        <button
                          onClick={() => handleStartEdit(wake)}
                          className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isDark 
                              ? 'bg-stone-800 hover:bg-stone-750 border-stone-700 text-amber-400 hover:text-amber-300' 
                              : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
                          }`}
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
                              ? isDark 
                                ? 'bg-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-600/30' 
                                : 'bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100'
                              : 'bg-red-600 hover:bg-red-500 text-white shadow-xs'
                          }`}
                        >
                          {isLive ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                          <span>{isLive ? 'Pausar' : 'Directo'}</span>
                        </button>

                        {/* Concluir Servicio y pasar a obituario histórico */}
                        {!isFinalizado ? (
                          <button
                            onClick={() => {
                              if (confirm(`¿Concluir el servicio de ${wake.deceasedName}? Pasará automáticamente a "Descanso Eterno" en el obituario público y liberará las pantallas de la sala.`)) {
                                setWakeStatus(wake.id, 'finalizado');
                                showNotification(`Servicio concluido. ${wake.deceasedName} pasó a Descanso Eterno en el obituario.`);
                              }
                            }}
                            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              isDark 
                                ? 'bg-stone-850 hover:bg-stone-750 border-stone-700 text-stone-300 hover:text-emerald-300' 
                                : 'bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border-stone-200 text-stone-700'
                            }`}
                            title="Finalizar servicio y archivar en obituario (Descanso Eterno)"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Concluir</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setWakeStatus(wake.id, 'en_vivo');
                              showNotification(`Servicio de ${wake.deceasedName} reactivado en vivo.`);
                            }}
                            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              isDark 
                                ? 'bg-amber-600/20 border-amber-500/40 text-amber-300 hover:bg-amber-600/30' 
                                : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800'
                            }`}
                            title="Reactivar velatorio en vivo"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reactivar</span>
                          </button>
                        )}

                        {/* Delete permanently */}
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar definitivamente el registro de ${wake.deceasedName}? Esta acción borrará sus datos de la base de datos.`)) {
                              deleteWakeService(wake.id);
                              showNotification(`Velatorio de ${wake.deceasedName} eliminado.`);
                            }
                          }}
                          className={`p-2 rounded-xl transition-colors cursor-pointer ${
                            isDark ? 'text-stone-500 hover:text-red-400 hover:bg-red-950/40' : 'text-stone-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title="Eliminar definitivamente del sistema"
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
                <h2 className={`text-xl sm:text-2xl font-serif font-bold ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                  {editingWakeId ? 'Modificar Servicio Velatorio' : 'Alta de Servicio Velatorio'}
                </h2>
                <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  {editingWakeId 
                    ? `Actualizando los datos del velatorio. Los cambios se guardarán y sincronizarán en tiempo real.`
                    : 'Complete los datos para habilitar la Capilla Virtual, el enlace para familiares y sincronizar el Smart TV de la sala.'}
                </p>
              </div>

              {editingWakeId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                    isDark ? 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                  }`}
                >
                  Cancelar Edición
                </button>
              )}
            </div>

            <form onSubmit={handleSaveWake} className={`border rounded-3xl p-6 sm:p-8 space-y-5 transition-all ${
              isDark ? 'bg-stone-900 border-stone-800 shadow-xl' : 'bg-white border-stone-200 shadow-lg'
            }`}>
              
              {/* Deceased Name */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                  Nombre y Apellido del Homenajeado *
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.deceasedName}
                  onChange={e => setFormData({ ...formData, deceasedName: e.target.value })}
                  placeholder="Ej: Don Roberto Ernesto Figueroa"
                  className={`w-full px-4 py-3 border rounded-2xl text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all ${
                    isDark ? 'bg-stone-950 border-stone-700 text-stone-100 placeholder-stone-600' : 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:bg-white'
                  }`}
                />
              </div>

              {/* Years & Age */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    Año Nacimiento
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Ej: 1943"
                    value={formData.birthYear}
                    onChange={e => handleBirthYearChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-2xl text-sm font-mono focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all ${
                      isDark ? 'bg-stone-950 border-stone-700 text-stone-100 placeholder-stone-600' : 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:bg-white'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    Año Fallecimiento
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Ej: 2026"
                    value={formData.passedYear}
                    onChange={e => handlePassedYearChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-2xl text-sm font-mono focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all ${
                      isDark ? 'bg-stone-950 border-stone-700 text-stone-100 placeholder-stone-600' : 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:bg-white'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    Edad (Auto)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={130}
                    placeholder="Años"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value === '' ? '' : sanitizeAge(e.target.value) })}
                    className={`w-full px-4 py-3 border rounded-2xl text-sm font-mono focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all ${
                      isDark ? 'bg-stone-950 border-stone-700 text-stone-100 placeholder-stone-600' : 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                  URL de Foto Conmemorativa (Opcional)
                </label>
                <input
                  type="url"
                  maxLength={500}
                  value={formData.photoUrl}
                  onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://... (dejar vacío si no hay foto para mostrar monograma solemne)"
                  className={`w-full px-4 py-3 border rounded-2xl text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all ${
                    isDark ? 'bg-stone-950 border-stone-700 text-stone-100 placeholder-stone-600' : 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:bg-white'
                  }`}
                />
              </div>

              {/* Epitaph */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                  Epitafio / Frase Recordatoria (Opcional)
                </label>
                <input
                  type="text"
                  maxLength={250}
                  value={formData.epitaph}
                  onChange={e => setFormData({ ...formData, epitaph: e.target.value })}
                  placeholder="Ej: Su recuerdo vivirá por siempre en nuestros corazones."
                  className={`w-full px-4 py-3 border rounded-2xl text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all ${
                    isDark ? 'bg-stone-950 border-stone-700 text-stone-100 placeholder-stone-600' : 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:bg-white'
                  }`}
                />
              </div>

              {/* Branch & Chapel Room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    Sucursal
                  </label>
                  <select
                    value={formData.branchName}
                    onChange={e => setFormData({ ...formData, branchName: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-2xl text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all ${
                      isDark ? 'bg-stone-950 border-stone-700 text-stone-100' : 'bg-stone-50 border-stone-300 text-stone-900 focus:bg-white'
                    }`}
                  >
                    <option value="Casa Central • Joaquín V. González">Casa Central • Joaquín V. González</option>
                    <option value="Sucursal San José de Metán">Sucursal San José de Metán</option>
                    <option value="Sucursal General Güemes">Sucursal General Güemes</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    Sala Asignada
                  </label>
                  <select
                    value={formData.chapelRoom}
                    onChange={e => setFormData({ ...formData, chapelRoom: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-2xl text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all ${
                      isDark ? 'bg-stone-950 border-stone-700 text-stone-100' : 'bg-stone-50 border-stone-300 text-stone-900 focus:bg-white'
                    }`}
                  >
                    {tvDevices.map(tv => (
                      <option key={tv.deviceCode} value={tv.roomName}>
                        {tv.roomName} ({tv.deviceCode}) — {tv.branchName.split('•')[0].trim()}
                      </option>
                    ))}
                    <option value="Servicio en Domicilio Particular">Servicio en Domicilio Particular</option>
                    <option value="Capilla de la Paz">Capilla de la Paz</option>
                  </select>
                </div>
              </div>

              {/* Cortege Time */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                  Horario y Destino del Cortejo (Opcional)
                </label>
                <input
                  type="text"
                  maxLength={150}
                  value={formData.cortegeTime}
                  onChange={e => setFormData({ ...formData, cortegeTime: e.target.value })}
                  placeholder="Ej: Mañana a las 10:00 hs hacia Cementerio Parque El Recuerdo"
                  className={`w-full px-4 py-3 border rounded-2xl text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all ${
                    isDark ? 'bg-stone-950 border-stone-700 text-stone-100 placeholder-stone-600' : 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:bg-white'
                  }`}
                />
              </div>

              {/* Stream URL & PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    Enlace de Transmisión (YouTube Live / Cámara)
                  </label>
                  <input
                    type="text"
                    maxLength={500}
                    value={formData.streamUrl}
                    onChange={e => setFormData({ ...formData, streamUrl: e.target.value })}
                    placeholder="https://youtube.com/live/... o dejar vacío"
                    className={`w-full px-4 py-3 border rounded-2xl text-sm font-mono focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all ${
                      isDark ? 'bg-stone-950 border-stone-700 text-stone-100 placeholder-stone-600' : 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    PIN de Acceso Privado para la Familia
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={8}
                      value={formData.accessPin}
                      onChange={e => setFormData({ ...formData, accessPin: sanitizePin(e.target.value, 8) })}
                      className={`w-full px-4 py-3 border rounded-2xl text-sm font-mono tracking-widest text-center focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-all ${
                        isDark ? 'bg-stone-950 border-stone-700 text-stone-100' : 'bg-stone-50 border-stone-300 text-stone-900 focus:bg-white'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, accessPin: Math.floor(1000 + Math.random() * 9000).toString() })}
                      className={`px-3.5 rounded-2xl text-xs font-semibold transition-colors cursor-pointer border ${
                        isDark ? 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                      }`}
                      title="Generar nuevo PIN"
                    >
                      Aleatorio
                    </button>
                  </div>
                </div>
              </div>

              {/* Immediate Live Checkbox */}
              <div className="pt-2">
                <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                  isDark ? 'bg-stone-950 border-stone-800 hover:bg-stone-900' : 'bg-stone-50/80 border-stone-200 hover:bg-stone-100/80'
                }`}>
                  <input
                    type="checkbox"
                    checked={formData.isLiveImmediately}
                    onChange={e => setFormData({ ...formData, isLiveImmediately: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded bg-stone-900 border-stone-700 focus:ring-amber-500"
                  />
                  <div>
                    <strong className={`block text-xs font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>
                      {editingWakeId ? 'Mantener o poner transmisión en directo activa' : 'Activar transmisión en directo de inmediato'}
                    </strong>
                    <span className={`text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      Sincroniza automáticamente la pantalla TV Box de la sala seleccionada.
                    </span>
                  </div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                <button
                  type="button"
                  onClick={editingWakeId ? handleCancelEdit : () => setActiveTab('velatorios')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    isDark ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-lg hover:shadow-amber-600/20 active:scale-[0.99] cursor-pointer flex items-center gap-2"
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className={`text-xl sm:text-2xl font-serif font-bold ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                    Control Remoto de Pantallas TV Box en Salas
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowTVGuideModal(true)}
                    className={`p-1 rounded-full transition-colors cursor-pointer ${
                      isDark ? 'text-amber-400 hover:text-amber-300 hover:bg-stone-800' : 'text-amber-600 hover:text-amber-700 hover:bg-stone-200'
                    }`}
                    title="Guía: ¿Cómo se agregan y configuran las pantallas TV?"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </div>
                <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  Conmute de manera instantánea entre el Modo Transmisión (homenaje al difunto y condolencias) y el Modo Espera (guardia institucional 24hs) para cada Smart TV.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <button
                  type="button"
                  onClick={() => setShowTVGuideModal(true)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                    isDark 
                      ? 'bg-stone-900 hover:bg-stone-850 border-stone-700 text-stone-300 hover:text-amber-300' 
                      : 'bg-white hover:bg-stone-50 border-stone-300 text-stone-700 hover:text-amber-700'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  <span>¿Cómo funciona? (Guía)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowNewTVModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg hover:shadow-amber-600/20 active:scale-[0.99] cursor-pointer flex-shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Vincular Nueva Pantalla / Sala</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {tvDevices.map(tv => {
                const isTransmitting = tv.mode === 'transmision';
                const assignedWake = tv.assignedWakeId ? wakeServices.find(w => w.id === tv.assignedWakeId) : undefined;

                return (
                  <div
                    key={tv.deviceCode}
                    className={`border rounded-3xl p-5 sm:p-6 shadow-md flex flex-col justify-between gap-5 transition-all ${
                      isDark 
                        ? isTransmitting 
                          ? 'bg-stone-900/90 border-amber-500/50 shadow-amber-950/20' 
                          : 'bg-stone-900/90 border-stone-800'
                        : isTransmitting
                          ? 'bg-white border-amber-400 shadow-[0_4px_24px_-4px_rgba(217,119,6,0.12)]'
                          : 'bg-white border-stone-200 shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Device Header */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${tv.isOnline ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                          <span className={`font-mono text-xs font-bold ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                            {tv.deviceCode}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase font-mono border ${
                            isTransmitting 
                              ? isDark ? 'bg-red-600/20 text-red-400 border-red-500/40' : 'bg-red-50 text-red-700 border-red-200'
                              : isDark ? 'bg-stone-800 text-stone-400 border-stone-700' : 'bg-stone-100 text-stone-600 border-stone-200'
                          }`}>
                            {isTransmitting ? '🔴 Modo Transmisión' : '⚪ Modo Espera'}
                          </span>

                          <button
                            onClick={() => handleDeleteTV(tv.deviceCode, tv.roomName)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isDark ? 'text-stone-500 hover:text-red-400 hover:bg-stone-800/80' : 'text-stone-400 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title="Eliminar pantalla"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className={`font-serif font-bold text-lg sm:text-xl ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                        {tv.roomName}
                      </h3>
                      <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                        {tv.branchName}
                      </p>

                      {/* Current Display Status */}
                      <div className={`mt-4 p-3.5 rounded-2xl border text-xs ${
                        isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-200'
                      }`}>
                        <div className={`text-[11px] uppercase tracking-wider font-semibold mb-1 ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>
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
                              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-xs font-serif font-bold flex-shrink-0 ${
                                isDark ? 'bg-stone-900 border-stone-750 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'
                              }`}>
                                {assignedWake.deceasedName.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <strong className={`block text-xs sm:text-sm font-semibold ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>
                                {assignedWake.deceasedName}
                              </strong>
                              <span className={`text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                                {assignedWake.birthYear} — {assignedWake.passedYear}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className={`italic py-1 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                            Sin velatorio asignado (Mostrando pantalla institucional de guardia 24hs).
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Controls & Actions */}
                    <div className={`space-y-3 pt-3 border-t ${isDark ? 'border-stone-800/80' : 'border-stone-100'}`}>
                      
                      {/* 1-Click Remote Toggle */}
                      <button
                        onClick={() => {
                          toggleTVMode(tv.deviceCode);
                          showNotification(`Pantalla ${tv.deviceCode} conmutada a ${!isTransmitting ? 'Modo Transmisión' : 'Modo Espera'}.`);
                        }}
                        className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                          isTransmitting
                            ? isDark 
                              ? 'bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700' 
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300'
                            : 'bg-red-600 hover:bg-red-500 text-white shadow-xs'
                        }`}
                      >
                        <Radio className="w-4 h-4" />
                        <span>{isTransmitting ? 'Conmutar a Modo Espera' : 'Conmutar a Modo Transmisión'}</span>
                      </button>

                      {/* Assign Wake Selector */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`flex-shrink-0 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Asignar difunto:</span>
                        <select
                          value={tv.assignedWakeId || ''}
                          onChange={e => assignWakeToTV(tv.deviceCode, e.target.value || null)}
                          className={`w-full border rounded-xl px-2.5 py-1.5 text-xs outline-hidden transition-colors ${
                            isDark ? 'bg-stone-950 border-stone-700 text-stone-200 focus:border-amber-500' : 'bg-stone-50 border-stone-300 text-stone-900 focus:bg-white focus:border-amber-500'
                          }`}
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
                          className={`text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isDark ? 'text-stone-400 hover:text-amber-300' : 'text-stone-600 hover:text-amber-700 font-medium'
                          }`}
                        >
                          {copiedTVCode === tv.deviceCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedTVCode === tv.deviceCode ? 'Enlace copiado' : 'Copiar URL para el TV'}</span>
                        </button>

                        <a
                          href={`/tv/${tv.deviceCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs flex items-center gap-1.5 transition-colors font-medium ${
                            isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-700 hover:text-amber-800 font-semibold'
                          }`}
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

            {/* Modal para vincular nueva pantalla TV Box */}
            {showNewTVModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className={`border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-150 ${
                  isDark ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
                }`}>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-500">
                        <Tv className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`font-serif font-bold text-lg ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                          Vincular Nueva Pantalla o Sala
                        </h3>
                        <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                          Configure una nueva Smart TV para salas velatorias.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNewTVModal(false)}
                      className={`p-1 cursor-pointer transition-colors ${isDark ? 'text-stone-500 hover:text-stone-300' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateTV} className="space-y-4 text-left">
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                        Código Identificador del TV Box
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: TV-JVG-03 o TV-MET-02"
                        value={newTVData.deviceCode}
                        onChange={e => setNewTVData({ ...newTVData, deviceCode: e.target.value.toUpperCase() })}
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm font-mono uppercase focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-colors ${
                          isDark ? 'bg-stone-950 border-stone-700 text-stone-100' : 'bg-stone-50 border-stone-300 text-stone-900 focus:bg-white'
                        }`}
                      />
                      <span className={`text-[11px] block mt-1 ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>
                        Se usará para la URL del navegador: <code className="text-amber-600 dark:text-amber-400 font-mono">/tv/{newTVData.deviceCode || 'CODIGO'}</code>
                      </span>
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                        Nombre de la Sala
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Sala Suite C, Sala Memorial B..."
                        value={newTVData.roomName}
                        onChange={e => setNewTVData({ ...newTVData, roomName: e.target.value })}
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-colors ${
                          isDark ? 'bg-stone-950 border-stone-700 text-stone-100' : 'bg-stone-50 border-stone-300 text-stone-900 focus:bg-white'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                        Sucursal / Ubicación
                      </label>
                      <select
                        value={newTVData.branchName}
                        onChange={e => setNewTVData({ ...newTVData, branchName: e.target.value })}
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition-colors ${
                          isDark ? 'bg-stone-950 border-stone-700 text-stone-100' : 'bg-stone-50 border-stone-300 text-stone-900 focus:bg-white'
                        }`}
                      >
                        <option value="Casa Central • Joaquín V. González">Casa Central • Joaquín V. González</option>
                        <option value="Sucursal San José de Metán">Sucursal San José de Metán</option>
                        <option value="Sucursal General Güemes">Sucursal General Güemes</option>
                        <option value="Sucursal El Quebrachal">Sucursal El Quebrachal</option>
                        <option value="Sucursal Las Lajitas">Sucursal Las Lajitas</option>
                      </select>
                    </div>

                    <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                      <button
                        type="button"
                        onClick={() => setShowNewTVModal(false)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                          isDark ? 'border-stone-700 text-stone-300 hover:bg-stone-800' : 'border-stone-300 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs tracking-wide transition-all shadow-md cursor-pointer"
                      >
                        Guardar y Registrar Pantalla
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal Guía Interactiva de Instalación y Conexión de Pantallas TV Box */}
            {showTVGuideModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                <div className={`border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-150 my-8 ${
                  isDark ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
                }`}>
                  
                  {/* Header */}
                  <div className={`flex items-start justify-between gap-4 pb-4 border-b ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-500 flex-shrink-0">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`font-serif font-bold text-lg sm:text-xl ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                          Guía: Cómo Vincular y Conectar Pantallas TV Box
                        </h3>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                          Sistema 100% desatendido (Cero Clics) para salas velatorias y capillas conmemorativas.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowTVGuideModal(false)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isDark ? 'text-stone-500 hover:text-stone-300 hover:bg-stone-800' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Steps */}
                  <div className="space-y-4 py-5 text-xs sm:text-sm">
                    
                    {/* Step 1 */}
                    <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                      isDark ? 'bg-stone-950 border-stone-800/80 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}>
                      <div className={`w-7 h-7 rounded-xl font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                        isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        1
                      </div>
                      <div className="space-y-1">
                        <strong className={`block font-semibold ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                          Registrar la Sala en este Panel
                        </strong>
                        <p className={`leading-relaxed text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                          Presione el botón dorado <strong className={isDark ? 'text-amber-300' : 'text-amber-700'}>+ Vincular Nueva Pantalla / Sala</strong> e ingrese un código identificador (ej: <code className="text-amber-600 dark:text-amber-400 font-mono">TV-JVG-03</code>), el nombre de la sala y su sucursal.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                      isDark ? 'bg-stone-950 border-stone-800/80 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}>
                      <div className={`w-7 h-7 rounded-xl font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                        isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        2
                      </div>
                      <div className="space-y-1">
                        <strong className={`block font-semibold ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                          Conectar el Televisor o TV Box en la Sala Física
                        </strong>
                        <p className={`leading-relaxed text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                          En el televisor o Smart TV Box con Android (Xiaomi Mi Box, Fire Stick, etc.) conectado al Wi-Fi de la sucursal, abra el navegador web e introduzca la dirección única generada:
                        </p>
                        <div className={`p-2.5 rounded-xl border font-mono text-xs select-all my-1.5 flex items-center justify-between ${
                          isDark ? 'bg-stone-900 border-stone-800 text-amber-300' : 'bg-white border-stone-300 text-amber-700'
                        }`}>
                          <span>https://cocheria-jvg-landing.vercel.app/tv/CODIGO_DEL_TV</span>
                        </div>
                        <span className={`text-[11px] block ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>
                          Tip: Puede presionar "Copiar URL para el TV" en la tarjeta de la sala y enviársela por WhatsApp al técnico o encargado.
                        </span>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                      isDark ? 'bg-stone-950 border-stone-800/80 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}>
                      <div className={`w-7 h-7 rounded-xl font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                        isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        3
                      </div>
                      <div className="space-y-1">
                        <strong className={`block font-semibold ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                          Operación Autónoma 24hs (Sin Tocar el Control Remoto)
                        </strong>
                        <p className={`leading-relaxed text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                          Una vez abierta la URL en la pantalla, el sistema funciona de manera 100% automática:
                        </p>
                        <ul className={`list-disc pl-4 space-y-1 text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                          <li><strong className={isDark ? 'text-stone-300' : 'text-stone-800'}>Sin servicio velatorio:</strong> El TV permanece en <strong className={isDark ? 'text-stone-300' : 'text-stone-800'}>Modo Espera</strong>, exhibiendo el logo institucional, hora oficial y teléfonos de guardia permanente.</li>
                          <li><strong className={isDark ? 'text-stone-300' : 'text-stone-800'}>Con servicio activo:</strong> Al asignar el difunto desde este panel, la pantalla física <strong className={isDark ? 'text-amber-300' : 'text-amber-700'}>conmuta sola al homenaje en vivo</strong>, mostrando foto conmemorativa, epitafio, velas y el código QR para que los asistentes envíen condolencias desde el celular.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Hardware Recommendation Card */}
                    <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                      isDark ? 'bg-amber-950/20 border-amber-800/30 text-stone-300' : 'bg-amber-50/80 border-amber-200 text-amber-900'
                    }`}>
                      <div className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Recomendación para Pantallas de Salas / Kiosco</span>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                        Instale la aplicación gratuita <strong className={isDark ? 'text-stone-200' : 'text-stone-900'}>Fully Kiosk Browser</strong> en el TV Box. Active las opciones <span className="font-mono text-amber-600 dark:text-amber-300">Run on Boot (arranque automático al enchufar)</span> y <span className="font-mono text-amber-600 dark:text-amber-300">Keep Screen On (pantalla siempre encendida)</span>. Si se corta la luz, al regresar encenderá solo en la sala correspondiente sin pedir clics ni contraseñas.
                      </p>
                    </div>

                  </div>

                  {/* Modal Footer */}
                  <div className={`flex items-center justify-end pt-3 border-t ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                    <button
                      type="button"
                      onClick={() => setShowTVGuideModal(false)}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs tracking-wide transition-all shadow-md cursor-pointer"
                    >
                      Entendido, Cerrar Guía
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: MODERADOR DE CONDOLENCIAS ── */}
        {activeTab === 'moderacion' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-xl sm:text-2xl font-serif font-bold ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                Moderación de Homenajes y Condolencias
              </h2>
              <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
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
                    className={`border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                      isDark
                        ? isApproved 
                          ? 'bg-stone-900/90 border-emerald-600/40' 
                          : isRejected 
                            ? 'bg-stone-900/60 border-red-900/40 opacity-60' 
                            : 'bg-stone-900 border-amber-500/50 bg-amber-950/10'
                        : isApproved
                          ? 'bg-white border-emerald-300 shadow-xs'
                          : isRejected
                            ? 'bg-stone-100/70 border-stone-300 opacity-60'
                            : 'bg-white border-amber-300 shadow-xs'
                    }`}
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-bold text-sm ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>
                          {item.senderName}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                          de {item.senderCity}
                        </span>
                        <span className="text-xs text-stone-400">•</span>
                        <span className={`text-xs font-mono ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                          {item.timestamp}
                        </span>

                        {targetWake && (
                          <span className={`text-[11px] px-2 py-0.5 rounded-lg font-serif border ${
                            isDark ? 'bg-stone-800 text-stone-300 border-stone-700' : 'bg-stone-100 text-stone-700 border-stone-200'
                          }`}>
                            Para: {targetWake.deceasedName}
                          </span>
                        )}
                      </div>

                      <p className={`text-xs sm:text-sm italic ${isDark ? 'text-stone-300' : 'text-stone-800'}`}>
                        "{item.message}"
                      </p>
                    </div>

                    {/* Approval Controls */}
                    <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono mr-2 border ${
                        isApproved 
                          ? isDark ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isRejected 
                            ? isDark ? 'bg-red-950 text-red-400 border-red-900' : 'bg-red-100 text-red-800 border-red-300'
                            : isDark ? 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse' : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
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
                            ? isDark ? 'opacity-40 cursor-not-allowed bg-stone-800 text-stone-500' : 'opacity-40 cursor-not-allowed bg-stone-200 text-stone-400'
                            : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-xs'
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
                            ? isDark ? 'opacity-40 cursor-not-allowed bg-stone-800 text-stone-500' : 'opacity-40 cursor-not-allowed bg-stone-200 text-stone-400'
                            : isDark ? 'bg-stone-800 hover:bg-red-950 hover:text-red-300 text-stone-400 border border-stone-700' : 'bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-600 border border-stone-300'
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
      <footer className={`border-t p-4 text-center text-xs transition-colors ${
        isDark ? 'bg-stone-900 border-stone-800 text-stone-500' : 'bg-white border-stone-200 text-stone-500 shadow-xs'
      }`}>
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
            className={`underline cursor-pointer transition-colors ${isDark ? 'text-stone-500 hover:text-amber-400' : 'text-stone-400 hover:text-amber-600'}`}
          >
            Purgar base de datos y reiniciar a limpio
          </button>
        </div>
      </footer>

    </div>
  );
};
