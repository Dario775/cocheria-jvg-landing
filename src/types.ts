export interface CondolenceMessage {
  id: string;
  author: string;
  relationship: string;
  message: string;
  timestamp: string;
  candleLit?: boolean;
  floralTribute?: string;
}

export interface MemorialTribute {
  id: string;
  type: 'candle' | 'flower' | 'prayer' | 'heart';
  author: string;
  timestamp: string;
}

export interface FuneralSchedule {
  chapelRoom: string;
  wakeDate: string;
  wakeHours: string;
  massDetails: string;
  processionTime: string;
  cemeteryOrCrematory: string;
  locationAddress: string;
}

export interface Obituary {
  id: string;
  fullName: string;
  epitaph?: string;
  birthDate: string;
  passedDate: string;
  age: number;
  photoUrl: string;
  biography: string;
  familyMembers: string[];
  status: 'en_velacion' | 'inhumado' | 'cremado' | 'homenaje_eterno';
  funeralService: FuneralSchedule;
  candlesCount: number;
  condolences: CondolenceMessage[];
  tributes: MemorialTribute[];
}

export interface FuneralServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: 'sepelio' | 'salas' | 'cremacion' | 'traslado' | 'tramites' | 'floreria' | 'prevision';
  icon: string;
  features: string[];
  pricingIndication?: string;
  highlighted?: boolean;
}

export interface PhotoGalleryItem {
  id: string;
  title: string;
  category: 'salas' | 'capilla' | 'flota' | 'jardines' | 'atencion';
  imageUrl: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  familyName: string;
  deceasedMention: string;
  serviceDate: string;
  comment: string;
  rating: number;
  verifiedFamily: boolean;
  location: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'urgencias' | 'documentacion' | 'coberturas' | 'servicios' | 'prevision';
}

export interface QuickBudgetOption {
  serviceType: 'tradicional' | 'premium' | 'cremacion' | 'traslado';
  hallType: 'sala_central' | 'sala_suite' | 'domicilio' | 'sin_sala';
  casketTier: 'estandar' | 'intermedio' | 'presidencial';
  socialCoverage: 'particular' | 'pami' | 'obra_social' | 'seguro_sepelio';
  includeFloralArrangement: boolean;
  includeDigitalMemorial: boolean;
  includeProcessionCars: boolean;
  includeCoffeeService: boolean;
}
