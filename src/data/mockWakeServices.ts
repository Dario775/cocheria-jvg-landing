import { WakeService, TVDevice } from '../types';

export const INITIAL_WAKE_SERVICES: WakeService[] = [
  {
    id: 'wake-figueroa-01',
    deceasedName: 'Don Roberto Ernesto Figueroa',
    birthYear: '1943',
    passedYear: '2026',
    age: 83,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    epitaph: 'Su recuerdo, sabiduría y generosidad permanecerán por siempre en el corazón de nuestra comunidad.',
    chapelRoom: 'Sala Magna A',
    branchName: 'Casa Central • Joaquín V. González',
    cortegeTime: 'Mañana a las 10:00 hs hacia Cementerio Parque El Recuerdo',
    accessPin: '8492',
    isLive: true,
    streamUrl: 'https://youtube.com/live/8CEwaLFlR-E?feature=share',
    status: 'en_vivo',
    createdAt: new Date().toISOString(),
    candlesCount: 24
  },
  {
    id: 'wake-benitez-02',
    deceasedName: 'Doña Rosa Elvira Benítez',
    birthYear: '1938',
    passedYear: '2026',
    age: 87,
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    epitaph: 'Madre ejemplar, abuela cariñosa. Descansa en paz en el reino de Dios.',
    chapelRoom: 'Sala Memorial Metán',
    branchName: 'Sucursal San José de Metán',
    cortegeTime: 'Hoy a las 17:30 hs hacia Cementerio Municipal',
    accessPin: '4190',
    isLive: false,
    streamUrl: '',
    status: 'preparacion',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    candlesCount: 12
  }
];

export const INITIAL_TV_DEVICES: TVDevice[] = [
  {
    deviceCode: 'TV-JVG-01',
    roomName: 'Sala Magna A',
    branchName: 'Casa Central • Joaquín V. González',
    assignedWakeId: 'wake-figueroa-01',
    mode: 'transmision',
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
    assignedWakeId: 'wake-benitez-02',
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
    isOnline: false,
    lastSeen: 'Hace 15 min'
  }
];
