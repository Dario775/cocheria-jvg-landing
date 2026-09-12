import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WakeService, TVDevice } from '../types';
import { INITIAL_WAKE_SERVICES, INITIAL_TV_DEVICES } from '../data/mockWakeServices';
import { supabase } from '../lib/supabase';
import { sanitizeText, sanitizeDigits, sanitizePin, sanitizeUrl, sanitizeAge } from '../utils/security';

export interface ModerationCondolenceItem {
  id: string;
  wakeId: string;
  senderName: string;
  senderCity: string;
  message: string;
  tributeType: 'candle' | 'flower' | 'prayer' | 'heart';
  status: 'aprobado' | 'pendiente' | 'rechazado';
  timestamp: string;
}

const INITIAL_MODERATION_QUEUE: ModerationCondolenceItem[] = [];

interface WakeServicesContextType {
  wakeServices: WakeService[];
  tvDevices: TVDevice[];
  moderationQueue: ModerationCondolenceItem[];
  createWakeService: (data: Omit<WakeService, 'id' | 'createdAt' | 'candlesCount'>) => WakeService;
  updateWakeService: (id: string, updates: Partial<WakeService>) => void;
  deleteWakeService: (id: string) => void;
  setWakeStatus: (id: string, status: 'preparacion' | 'en_vivo' | 'finalizado') => void;
  createTVDevice: (data: { deviceCode: string; roomName: string; branchName: string }) => Promise<void>;
  deleteTVDevice: (deviceCode: string) => Promise<void>;
  toggleTVMode: (deviceCode: string) => void;
  setTVMode: (deviceCode: string, mode: 'transmision' | 'espera') => void;
  assignWakeToTV: (deviceCode: string, wakeId: string | null) => void;
  getWakeById: (id: string) => WakeService | undefined;
  getWakeByPin: (pin: string) => WakeService | undefined;
  getTVDevice: (deviceCode: string) => TVDevice | undefined;
  approveCondolence: (id: string) => void;
  rejectCondolence: (id: string) => void;
  addCondolenceToQueue: (item: Omit<ModerationCondolenceItem, 'id' | 'timestamp' | 'status'>) => void;
  resetToDefaults: () => void;
}

const WakeServicesContext = createContext<WakeServicesContextType | undefined>(undefined);

const STORAGE_KEY_SERVICES = 'cocheria_wake_services_v1';
const STORAGE_KEY_TVS = 'cocheria_tv_devices_v1';
const STORAGE_KEY_MODERATION = 'cocheria_moderation_queue_v1';

export const WakeServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wakeServices, setWakeServices] = useState<WakeService[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading wake services from localStorage', e);
    }
    return INITIAL_WAKE_SERVICES;
  });

  const [tvDevices, setTvDevices] = useState<TVDevice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TVS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading TV devices from localStorage', e);
    }
    return INITIAL_TV_DEVICES;
  });

  const [moderationQueue, setModerationQueue] = useState<ModerationCondolenceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MODERATION);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading moderation queue from localStorage', e);
    }
    return INITIAL_MODERATION_QUEUE;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(wakeServices));
    } catch (e) {
      console.error('Error saving wake services to localStorage', e);
    }
  }, [wakeServices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TVS, JSON.stringify(tvDevices));
    } catch (e) {
      console.error('Error saving TV devices to localStorage', e);
    }
  }, [tvDevices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MODERATION, JSON.stringify(moderationQueue));
    } catch (e) {
      console.error('Error saving moderation queue to localStorage', e);
    }
  }, [moderationQueue]);

  // Sincronización bidireccional con Supabase en tiempo real
  const fetchFromSupabase = useCallback(async () => {
    try {
      // 1. Obtener velatorios
      const { data: services, error: errServices } = await supabase
        .from('wake_services')
        .select('*')
        .order('created_at', { ascending: false });

      if (!errServices && services !== null) {
        const mappedServices: WakeService[] = services.map(s => ({
          id: s.id,
          deceasedName: s.deceased_name,
          birthYear: s.birth_year || '',
          passedYear: s.passed_year || '',
          age: s.age || 0,
          photoUrl: s.photo_url || '',
          epitaph: s.epitaph || '',
          chapelRoom: s.chapel_room,
          branchName: s.branch_name,
          cortegeTime: s.cortege_time || '',
          accessPin: s.access_pin,
          isLive: s.is_live ?? true,
          streamUrl: s.stream_url || '',
          status: s.status || 'en_vivo',
          createdAt: s.created_at || new Date().toISOString(),
          candlesCount: s.candles_count || 0
        }));
        setWakeServices(mappedServices);
      }

      // 2. Obtener pantallas TV Box
      const { data: tvs, error: errTvs } = await supabase
        .from('tv_devices')
        .select('*');

      if (!errTvs && tvs && tvs.length > 0) {
        const mappedTVs: TVDevice[] = tvs.map(t => ({
          deviceCode: t.device_code,
          roomName: t.room_name,
          branchName: t.branch_name,
          assignedWakeId: t.assigned_wake_id,
          mode: t.mode || 'espera',
          isOnline: t.is_online ?? true,
          lastSeen: 'En línea ahora'
        }));
        setTvDevices(mappedTVs);
      } else if (!errTvs && (!tvs || tvs.length === 0)) {
        // Inicializar las 4 salas en Supabase si la tabla está vacía
        const seedTvs = INITIAL_TV_DEVICES.map(t => ({
          device_code: t.deviceCode,
          room_name: t.roomName,
          branch_name: t.branchName,
          assigned_wake_id: null,
          mode: 'espera',
          is_online: true
        }));
        supabase.from('tv_devices').upsert(seedTvs).then(() => {}).catch(() => {});
      }

      // 3. Obtener condolencias
      const { data: condolences, error: errCondolences } = await supabase
        .from('wake_condolences')
        .select('*')
        .order('created_at', { ascending: false });

      if (!errCondolences && condolences !== null) {
        const mappedCondolences: ModerationCondolenceItem[] = condolences.map(c => ({
          id: c.id,
          wakeId: c.wake_id,
          senderName: c.sender_name,
          senderCity: c.sender_city || 'Comunidad',
          message: c.message,
          tributeType: c.tribute_type || 'candle',
          status: c.status || 'aprobado',
          timestamp: new Date(c.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
        }));
        setModerationQueue(mappedCondolences);
      }
    } catch (e) {
      console.warn('Conexión local activa. Esperando respuesta de Supabase.', e);
    }
  }, []);

  // Suscripción a WebSockets Realtime de Supabase
  useEffect(() => {
    fetchFromSupabase();

    const channel = supabase
      .channel('portal_wakes_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wake_services' }, () => {
        fetchFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tv_devices' }, () => {
        fetchFromSupabase();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wake_condolences' }, () => {
        fetchFromSupabase();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchFromSupabase]);

  // Create wake service (sanitizado y seguro)
  const createWakeService = (data: Omit<WakeService, 'id' | 'createdAt' | 'candlesCount'>): WakeService => {
    const cleanName = sanitizeText(data.deceasedName, 100) || 'Homenajeado';
    const cleanBirthYear = sanitizeDigits(data.birthYear, 4);
    const cleanPassedYear = sanitizeDigits(data.passedYear, 4) || new Date().getFullYear().toString();
    const cleanAge = sanitizeAge(data.age);
    const cleanPhotoUrl = sanitizeUrl(data.photoUrl, 500);
    const cleanEpitaph = sanitizeText(data.epitaph, 250);
    const cleanCortege = sanitizeText(data.cortegeTime, 150);
    const cleanPin = sanitizePin(data.accessPin, 8) || '1234';
    const cleanStreamUrl = sanitizeUrl(data.streamUrl, 500);

    const newService: WakeService = {
      ...data,
      deceasedName: cleanName,
      birthYear: cleanBirthYear,
      passedYear: cleanPassedYear,
      age: cleanAge,
      photoUrl: cleanPhotoUrl,
      epitaph: cleanEpitaph,
      cortegeTime: cleanCortege,
      accessPin: cleanPin,
      streamUrl: cleanStreamUrl,
      id: `wake-${Date.now()}`,
      createdAt: new Date().toISOString(),
      candlesCount: 0
    };
    setWakeServices(prev => [newService, ...prev]);

    // Sincronizar en Supabase
    supabase.from('wake_services').insert({
      id: newService.id,
      deceased_name: newService.deceasedName,
      birth_year: newService.birthYear,
      passed_year: newService.passedYear,
      age: newService.age,
      photo_url: newService.photoUrl,
      epitaph: newService.epitaph,
      chapel_room: newService.chapelRoom,
      branch_name: newService.branchName,
      cortege_time: newService.cortegeTime,
      access_pin: newService.accessPin,
      is_live: newService.isLive,
      stream_url: newService.streamUrl,
      status: newService.status,
      created_at: newService.createdAt,
      candles_count: 0
    }).then(({ error }) => {
      if (error) console.error('Error al insertar en Supabase (wake_services):', error);
      else console.log('Velatorio insertado con éxito en Supabase:', newService.id);
    }).catch(err => console.error('Error de red al insertar en Supabase:', err));

    // Vincular al TV Box de esa sala
    if (data.chapelRoom) {
      setTvDevices(prev => prev.map(tv => {
        if (tv.roomName.toLowerCase().includes(data.chapelRoom.toLowerCase()) || 
            data.chapelRoom.toLowerCase().includes(tv.roomName.toLowerCase())) {
          
          const newMode = data.isLive ? 'transmision' : 'espera';
          supabase.from('tv_devices').update({
            assigned_wake_id: newService.id,
            mode: newMode
          }).eq('device_code', tv.deviceCode).then(() => {}).catch(() => {});

          return {
            ...tv,
            assignedWakeId: newService.id,
            mode: newMode
          };
        }
        return tv;
      }));
    }

    return newService;
  };

  // Update wake service (sanitizado y seguro)
  const updateWakeService = (id: string, updates: Partial<WakeService>) => {
    const sanitizedUpdates: Partial<WakeService> = { ...updates };
    if (updates.deceasedName !== undefined) sanitizedUpdates.deceasedName = sanitizeText(updates.deceasedName, 100);
    if (updates.birthYear !== undefined) sanitizedUpdates.birthYear = sanitizeDigits(updates.birthYear, 4);
    if (updates.passedYear !== undefined) sanitizedUpdates.passedYear = sanitizeDigits(updates.passedYear, 4);
    if (updates.age !== undefined) sanitizedUpdates.age = sanitizeAge(updates.age);
    if (updates.photoUrl !== undefined) sanitizedUpdates.photoUrl = sanitizeUrl(updates.photoUrl, 500);
    if (updates.epitaph !== undefined) sanitizedUpdates.epitaph = sanitizeText(updates.epitaph, 250);
    if (updates.cortegeTime !== undefined) sanitizedUpdates.cortegeTime = sanitizeText(updates.cortegeTime, 150);
    if (updates.accessPin !== undefined) sanitizedUpdates.accessPin = sanitizePin(updates.accessPin, 8);
    if (updates.streamUrl !== undefined) sanitizedUpdates.streamUrl = sanitizeUrl(updates.streamUrl, 500);

    setWakeServices(prev => prev.map(s => s.id === id ? { ...s, ...sanitizedUpdates } : s));

    const dbPayload: any = {};
    if (sanitizedUpdates.deceasedName !== undefined) dbPayload.deceased_name = sanitizedUpdates.deceasedName;
    if (sanitizedUpdates.birthYear !== undefined) dbPayload.birth_year = sanitizedUpdates.birthYear;
    if (sanitizedUpdates.passedYear !== undefined) dbPayload.passed_year = sanitizedUpdates.passedYear;
    if (sanitizedUpdates.age !== undefined) dbPayload.age = sanitizedUpdates.age;
    if (sanitizedUpdates.photoUrl !== undefined) dbPayload.photo_url = sanitizedUpdates.photoUrl;
    if (sanitizedUpdates.epitaph !== undefined) dbPayload.epitaph = sanitizedUpdates.epitaph;
    if (sanitizedUpdates.chapelRoom !== undefined) dbPayload.chapel_room = sanitizedUpdates.chapelRoom;
    if (sanitizedUpdates.branchName !== undefined) dbPayload.branch_name = sanitizedUpdates.branchName;
    if (sanitizedUpdates.streamUrl !== undefined) dbPayload.stream_url = sanitizedUpdates.streamUrl;
    if (sanitizedUpdates.cortegeTime !== undefined) dbPayload.cortege_time = sanitizedUpdates.cortegeTime;
    if (sanitizedUpdates.accessPin !== undefined) dbPayload.access_pin = sanitizedUpdates.accessPin;
    if (sanitizedUpdates.isLive !== undefined) dbPayload.is_live = sanitizedUpdates.isLive;
    if (sanitizedUpdates.status !== undefined) dbPayload.status = sanitizedUpdates.status;

    if (Object.keys(dbPayload).length > 0) {
      supabase.from('wake_services').update(dbPayload).eq('id', id).then(({ error }) => {
        if (error) console.error('Error al actualizar en Supabase (wake_services):', error);
        else console.log('Velatorio actualizado con éxito en Supabase:', id);
      }).catch(err => console.error('Error de red al actualizar en Supabase:', err));
    }
  };

  // Delete wake service
  const deleteWakeService = (id: string) => {
    setWakeServices(prev => prev.filter(s => s.id !== id));
    setTvDevices(prev => prev.map(tv => tv.assignedWakeId === id ? { ...tv, assignedWakeId: null, mode: 'espera' } : tv));

    supabase.from('wake_services').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Error al eliminar en Supabase (wake_services):', error);
      else console.log('Velatorio eliminado con éxito en Supabase:', id);
    }).catch(err => console.error('Error de red al eliminar en Supabase:', err));
    supabase.from('tv_devices').update({ assigned_wake_id: null, mode: 'espera' }).eq('assigned_wake_id', id).then(() => {}).catch(() => {});
  };

  // Set wake status
  const setWakeStatus = (id: string, status: 'preparacion' | 'en_vivo' | 'finalizado') => {
    const isLive = status === 'en_vivo';
    setWakeServices(prev => prev.map(s => s.id === id ? { ...s, status, isLive } : s));

    supabase.from('wake_services').update({ status, is_live: isLive }).eq('id', id).then(() => {}).catch(() => {});

    // Sincronizar TVs asignados
    setTvDevices(prev => prev.map(tv => {
      if (tv.assignedWakeId === id) {
        const mode = isLive ? 'transmision' : 'espera';
        supabase.from('tv_devices').update({ mode }).eq('device_code', tv.deviceCode).then(() => {}).catch(() => {});
        return {
          ...tv,
          mode
        };
      }
      return tv;
    }));
  };

  // Toggle TV mode
  const toggleTVMode = (deviceCode: string) => {
    setTvDevices(prev => prev.map(tv => {
      if (tv.deviceCode === deviceCode) {
        const nextMode = tv.mode === 'transmision' ? 'espera' : 'transmision';
        supabase.from('tv_devices').update({ mode: nextMode }).eq('device_code', deviceCode).then(() => {}).catch(() => {});
        return {
          ...tv,
          mode: nextMode
        };
      }
      return tv;
    }));
  };

  // Set TV mode directly
  const setTVMode = (deviceCode: string, mode: 'transmision' | 'espera') => {
    setTvDevices(prev => prev.map(tv => tv.deviceCode === deviceCode ? { ...tv, mode } : tv));
    supabase.from('tv_devices').update({ mode }).eq('device_code', deviceCode).then(() => {}).catch(() => {});
  };

  // Assign wake to TV
  const assignWakeToTV = (deviceCode: string, wakeId: string | null) => {
    const mode = wakeId ? 'transmision' : 'espera';
    setTvDevices(prev => prev.map(tv => {
      if (tv.deviceCode === deviceCode) {
        return {
          ...tv,
          assignedWakeId: wakeId,
          mode
        };
      }
      return tv;
    }));

    supabase.from('tv_devices').update({ assigned_wake_id: wakeId, mode }).eq('device_code', deviceCode).then(() => {}).catch(() => {});
  };

  // Create TV device
  const createTVDevice = async (data: { deviceCode: string; roomName: string; branchName: string }) => {
    const cleanCode = data.deviceCode.trim().toUpperCase().replace(/\s+/g, '-');
    const newTV: TVDevice = {
      deviceCode: cleanCode,
      roomName: data.roomName.trim(),
      branchName: data.branchName.trim(),
      assignedWakeId: null,
      mode: 'espera',
      isOnline: true,
      lastSeen: 'En línea ahora'
    };

    setTvDevices(prev => [...prev.filter(t => t.deviceCode !== cleanCode), newTV]);

    try {
      await supabase.from('tv_devices').upsert({
        device_code: newTV.deviceCode,
        room_name: newTV.roomName,
        branch_name: newTV.branchName,
        assigned_wake_id: null,
        mode: 'espera',
        is_online: true
      });
    } catch (e) {
      console.error('Error al guardar nueva sala TV en Supabase:', e);
    }
  };

  // Delete TV device
  const deleteTVDevice = async (deviceCode: string) => {
    const cleanCode = deviceCode.trim().toUpperCase();
    setTvDevices(prev => prev.filter(t => t.deviceCode.toUpperCase() !== cleanCode));
    try {
      await supabase.from('tv_devices').delete().eq('device_code', cleanCode);
    } catch (e) {
      console.error('Error al eliminar sala TV en Supabase:', e);
    }
  };

  // Query helpers
  const getWakeById = (id: string) => wakeServices.find(s => s.id === id);

  const getWakeByPin = (pin: string) => {
    const cleanPin = pin.trim().toLowerCase();
    return wakeServices.find(s => s.accessPin.trim() === cleanPin);
  };

  const getTVDevice = (deviceCode: string) => {
    const clean = deviceCode.trim().toUpperCase();
    return tvDevices.find(tv => tv.deviceCode.toUpperCase() === clean);
  };

  // Moderation
  const approveCondolence = (id: string) => {
    setModerationQueue(prev => prev.map(c => c.id === id ? { ...c, status: 'aprobado' } : c));
    supabase.from('wake_condolences').update({ status: 'aprobado' }).eq('id', id).then(() => {}).catch(() => {});
  };

  const rejectCondolence = (id: string) => {
    setModerationQueue(prev => prev.map(c => c.id === id ? { ...c, status: 'rechazado' } : c));
    supabase.from('wake_condolences').update({ status: 'rechazado' }).eq('id', id).then(() => {}).catch(() => {});
  };

  const addCondolenceToQueue = (item: Omit<ModerationCondolenceItem, 'id' | 'timestamp' | 'status'>) => {
    const cleanAuthor = sanitizeText(item.senderName, 60) || 'Familiar o Allegado';
    const cleanCity = sanitizeText(item.senderCity, 50) || 'Comunidad';
    const cleanMessage = sanitizeText(item.message, 400);
    const validTributes = ['candle', 'flower', 'prayer', 'heart'];
    const cleanTribute = validTributes.includes(item.tributeType) ? item.tributeType : 'candle';

    if (!cleanMessage) return;

    const newItem: ModerationCondolenceItem = {
      id: `mod-${Date.now()}`,
      wakeId: item.wakeId,
      senderName: cleanAuthor,
      senderCity: cleanCity,
      message: cleanMessage,
      tributeType: cleanTribute as any,
      timestamp: 'Recién',
      status: 'aprobado'
    };
    setModerationQueue(prev => [newItem, ...prev]);

    supabase.from('wake_condolences').insert({
      id: newItem.id,
      wake_id: newItem.wakeId,
      sender_name: newItem.senderName,
      sender_city: newItem.senderCity,
      message: newItem.message,
      tribute_type: newItem.tributeType,
      status: 'aprobado',
      candle_lit: true
    }).then(({ error }) => {
      if (error) console.error('Error al insertar condolencia en Supabase:', error);
      else console.log('Condolencia sincronizada con éxito en Supabase:', newItem.id);
    }).catch(err => console.error('Error de red al insertar condolencia en Supabase:', err));
  };

  const resetToDefaults = async () => {
    setWakeServices([]);
    setTvDevices(prev => prev.map(tv => ({ ...tv, assignedWakeId: null, mode: 'espera' })));
    setModerationQueue([]);
    localStorage.removeItem(STORAGE_KEY_SERVICES);
    localStorage.removeItem(STORAGE_KEY_TVS);
    localStorage.removeItem(STORAGE_KEY_MODERATION);

    try {
      await supabase.from('wake_condolences').delete().neq('id', 'keep_none');
      await supabase.from('wake_services').delete().neq('id', 'keep_none');
      await supabase.from('tv_devices').update({ assigned_wake_id: null, mode: 'espera' }).neq('device_code', 'keep_none');
    } catch (e) {
      console.warn('Error purgando Supabase:', e);
    }
  };

  return (
    <WakeServicesContext.Provider
      value={{
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
        setTVMode,
        assignWakeToTV,
        getWakeById,
        getWakeByPin,
        getTVDevice,
        approveCondolence,
        rejectCondolence,
        addCondolenceToQueue,
        resetToDefaults
      }}
    >
      {children}
    </WakeServicesContext.Provider>
  );
};

export const useWakeServices = () => {
  const context = useContext(WakeServicesContext);
  if (!context) {
    throw new Error('useWakeServices must be used within a WakeServicesProvider');
  }
  return context;
};
