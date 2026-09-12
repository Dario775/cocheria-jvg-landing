import { WakeService, TVDevice } from '../types';

export const INITIAL_WAKE_SERVICES: WakeService[] = [];

export const INITIAL_TV_DEVICES: TVDevice[] = [
  {
    deviceCode: 'TV-JVG-01',
    roomName: 'Sala Magna A',
    branchName: 'Casa Central • Joaquín V. González',
    assignedWakeId: null,
    mode: 'espera',
    isOnline: true,
    lastSeen: 'En línea ahora'
  },
  {
    deviceCode: 'TV-JVG-02',
    roomName: 'Sala B (Capilla Menor)',
    branchName: 'Casa Central • Joaquín V. González',
    assignedWakeId: null,
    mode: 'espera',
    isOnline: true,
    lastSeen: 'En línea ahora'
  },
  {
    deviceCode: 'TV-MET-01',
    roomName: 'Sala Memorial Metán',
    branchName: 'Sucursal San José de Metán',
    assignedWakeId: null,
    mode: 'espera',
    isOnline: true,
    lastSeen: 'En línea ahora'
  },
  {
    deviceCode: 'TV-GUE-01',
    roomName: 'Sala Jardín Güemes',
    branchName: 'Sucursal General Güemes',
    assignedWakeId: null,
    mode: 'espera',
    isOnline: true,
    lastSeen: 'En línea ahora'
  }
];

