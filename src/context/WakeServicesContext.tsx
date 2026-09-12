import React, { createContext, useContext, useState, useEffect } from 'react';
import { WakeService, TVDevice } from '../types';
import { INITIAL_WAKE_SERVICES, INITIAL_TV_DEVICES } from '../data/mockWakeServices';

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

const INITIAL_MODERATION_QUEUE: ModerationCondolenceItem[] = [
  {
    id: 'mod-1',
    wakeId: 'wake-figueroa-01',
    senderName: 'Familia Morales Gómez',
    senderCity: 'Salta Capital',
    message: 'Acompañamos con amor y respeto a la familia Figueroa en este momento de recogimiento.',
    tributeType: 'candle',
    status: 'aprobado',
    timestamp: 'Hace 5 min'
  },
  {
    id: 'mod-2',
    wakeId: 'wake-figueroa-01',
    senderName: 'Dra. Silvina Navarro',
    senderCity: 'Córdoba',
    message: 'Elevamos una plegaria por el eterno descanso de Don Roberto.',
    tributeType: 'prayer',
    status: 'aprobado',
    timestamp: 'Hace 12 min'
  },
  {
    id: 'mod-3',
    wakeId: 'wake-figueroa-01',
    senderName: 'Esteban y Gabriela',
    senderCity: 'Buenos Aires',
    message: 'Un abrazo fraternal con todo nuestro cariño y apoyo.',
    tributeType: 'heart',
    status: 'pendiente',
    timestamp: 'Hace 2 min'
  },
  {
    id: 'mod-4',
    wakeId: 'wake-figueroa-01',
    senderName: 'Comunidad Educativa',
    senderCity: 'Joaquín V. González',
    message: 'En memoria de nuestro querido maestro y vecino ejemplar.',
    tributeType: 'flower',
    status: 'pendiente',
    timestamp: 'Hace 1 min'
  }
];

interface WakeServicesContextType {
  wakeServices: WakeService[];
  tvDevices: TVDevice[];
  moderationQueue: ModerationCondolenceItem[];
  createWakeService: (data: Omit<WakeService, 'id' | 'createdAt' | 'candlesCount'>) => WakeService;
  updateWakeService: (id: string, updates: Partial<WakeService>) => void;
  deleteWakeService: (id: string) => void;
  setWakeStatus: (id: string, status: 'preparacion' | 'en_vivo' | 'finalizado') => void;
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

  // Create wake service
  const createWakeService = (data: Omit<WakeService, 'id' | 'createdAt' | 'candlesCount'>): WakeService => {
    const newService: WakeService = {
      ...data,
      id: `wake-${Date.now()}`,
      createdAt: new Date().toISOString(),
      candlesCount: 0
    };
    setWakeServices(prev => [newService, ...prev]);

    // If assigned to a chapel, link to matching TV Box automatically
    if (data.chapelRoom) {
      setTvDevices(prev => prev.map(tv => {
        if (tv.roomName.toLowerCase().includes(data.chapelRoom.toLowerCase()) || 
            data.chapelRoom.toLowerCase().includes(tv.roomName.toLowerCase())) {
          return {
            ...tv,
            assignedWakeId: newService.id,
            mode: data.isLive ? 'transmision' : 'espera'
          };
        }
        return tv;
      }));
    }

    return newService;
  };

  // Update wake service
  const updateWakeService = (id: string, updates: Partial<WakeService>) => {
    setWakeServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // Delete wake service
  const deleteWakeService = (id: string) => {
    setWakeServices(prev => prev.filter(s => s.id !== id));
    // Unlink from TVs
    setTvDevices(prev => prev.map(tv => tv.assignedWakeId === id ? { ...tv, assignedWakeId: null, mode: 'espera' } : tv));
  };

  // Set wake status
  const setWakeStatus = (id: string, status: 'preparacion' | 'en_vivo' | 'finalizado') => {
    const isLive = status === 'en_vivo';
    setWakeServices(prev => prev.map(s => s.id === id ? { ...s, status, isLive } : s));

    // Update matching TV mode
    setTvDevices(prev => prev.map(tv => {
      if (tv.assignedWakeId === id) {
        return {
          ...tv,
          mode: isLive ? 'transmision' : 'espera'
        };
      }
      return tv;
    }));
  };

  // Toggle TV mode
  const toggleTVMode = (deviceCode: string) => {
    setTvDevices(prev => prev.map(tv => {
      if (tv.deviceCode === deviceCode) {
        return {
          ...tv,
          mode: tv.mode === 'transmision' ? 'espera' : 'transmision'
        };
      }
      return tv;
    }));
  };

  // Set TV mode directly
  const setTVMode = (deviceCode: string, mode: 'transmision' | 'espera') => {
    setTvDevices(prev => prev.map(tv => tv.deviceCode === deviceCode ? { ...tv, mode } : tv));
  };

  // Assign wake to TV
  const assignWakeToTV = (deviceCode: string, wakeId: string | null) => {
    setTvDevices(prev => prev.map(tv => {
      if (tv.deviceCode === deviceCode) {
        return {
          ...tv,
          assignedWakeId: wakeId,
          mode: wakeId ? 'transmision' : 'espera'
        };
      }
      return tv;
    }));
  };

  // Query helpers
  const getWakeById = (id: string) => wakeServices.find(s => s.id === id);

  const getWakeByPin = (pin: string) => {
    const cleanPin = pin.trim().toLowerCase();
    if (cleanPin === 'demo') return wakeServices[0];
    return wakeServices.find(s => s.accessPin.trim() === cleanPin);
  };

  const getTVDevice = (deviceCode: string) => {
    const clean = deviceCode.trim().toUpperCase();
    return tvDevices.find(tv => tv.deviceCode.toUpperCase() === clean);
  };

  // Moderation
  const approveCondolence = (id: string) => {
    setModerationQueue(prev => prev.map(c => c.id === id ? { ...c, status: 'aprobado' } : c));
  };

  const rejectCondolence = (id: string) => {
    setModerationQueue(prev => prev.map(c => c.id === id ? { ...c, status: 'rechazado' } : c));
  };

  const addCondolenceToQueue = (item: Omit<ModerationCondolenceItem, 'id' | 'timestamp' | 'status'>) => {
    const newItem: ModerationCondolenceItem = {
      ...item,
      id: `mod-${Date.now()}`,
      timestamp: 'Recién',
      status: 'pendiente'
    };
    setModerationQueue(prev => [newItem, ...prev]);
  };

  const resetToDefaults = () => {
    setWakeServices(INITIAL_WAKE_SERVICES);
    setTvDevices(INITIAL_TV_DEVICES);
    setModerationQueue(INITIAL_MODERATION_QUEUE);
    localStorage.removeItem(STORAGE_KEY_SERVICES);
    localStorage.removeItem(STORAGE_KEY_TVS);
    localStorage.removeItem(STORAGE_KEY_MODERATION);
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
