import { Obituary, FuneralServiceItem, PhotoGalleryItem, TestimonialItem, FaqItem } from '../types';

export const OBITUARIES_DATA: Obituary[] = [
  {
    id: 'obit-01',
    fullName: 'Don Roberto Ernesto Figueroa',
    epitaph: 'Tu legado de amor, trabajo y rectitud vivirá por siempre en nuestros corazones.',
    birthDate: '14 de Mayo de 1943',
    passedDate: '23 de Agosto de 2026',
    age: 83,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    biography: 'Vecino distinguido de Joaquín V. González, querido docente jubilado y abuelo ejemplar. Dedicó su vida a la enseñanza y al crecimiento de nuestra comunidad. Su calidez y sabiduría serán siempre recordadas por sus alumnos, amigos y familiares.',
    familyMembers: ['Su esposa Marta', 'Sus hijos Carlos, María Elena y Javier', 'Nietos y bisnietos'],
    status: 'en_velacion',
    funeralService: {
      chapelRoom: 'Sala Capilla "La Merced" (Planta Baja)',
      wakeDate: 'Domingo 24 de Agosto de 2026',
      wakeHours: 'Desde las 08:00 hs hasta las 18:00 hs',
      massDetails: 'Misa de cuerpo presente en Parroquia Santo Domingo de Guzmán a las 16:30 hs',
      processionTime: 'Salida del cortejo fúnebre: 17:30 hs',
      cemeteryOrCrematory: 'Cementerio Municipal Parque de la Paz, J.V. González',
      locationAddress: 'Av. General Güemes 450, J.V. González, Salta'
    },
    candlesCount: 42,
    condolences: [
      {
        id: 'c-1',
        author: 'Familia Morales y Vega',
        relationship: 'Vecinos de toda la vida',
        message: 'Acompañamos con profunda tristeza a Marta e hijos en este doloroso momento. Don Roberto fue un hombre íntegro y un gran amigo de nuestra familia. Descansa en paz.',
        timestamp: 'Hace 3 horas',
        candleLit: true,
        floralTribute: 'Corona de flores blancas'
      },
      {
        id: 'c-2',
        author: 'Promoción Escolar 1985',
        relationship: 'Ex-alumnos',
        message: 'Con inmenso respeto y gratitud por todas las enseñanzas que nos brindó el querido Profesor Figueroa. Siempre en nuestra memoria.',
        timestamp: 'Hace 5 horas',
        candleLit: true
      },
      {
        id: 'c-3',
        author: 'Dr. Alejandro Salim',
        relationship: 'Amigo de la familia',
        message: 'Mis más sentidas condolencias a Carlos y a toda la familia Figueroa. Los acompaño con una oración en este momento de tránsito.',
        timestamp: 'Hace 7 horas',
        candleLit: true
      }
    ],
    tributes: [
      { id: 't-1', type: 'candle', author: 'Beatriz L.', timestamp: 'Hace 1 hora' },
      { id: 't-2', type: 'flower', author: 'Comunidad Educativa', timestamp: 'Hace 2 horas' },
      { id: 't-3', type: 'prayer', author: 'Parroquia Santo Domingo', timestamp: 'Hace 4 horas' }
    ]
  },
  {
    id: 'obit-02',
    fullName: 'Doña Carmen Rosa Mendoza de Carrizo',
    epitaph: 'Madre cariñosa, abuela incondicional. Que la luz perpetua brille para ti.',
    birthDate: '02 de Octubre de 1938',
    passedDate: '22 de Agosto de 2026',
    age: 87,
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    biography: 'Pilar fundamental de la familia Carrizo. Nacida en El Quebrachal y radicada en J.V. González desde su juventud. Deja un recuerdo imborrable de unión familiar, alegría y generosidad hacia los más necesitados.',
    familyMembers: ['Sus hijos Beatriz, Ricardo y Patricia', 'Hijos políticos', 'Nietos y hermanos'],
    status: 'inhumado',
    funeralService: {
      chapelRoom: 'Sala Imperial Suite "San Francisco"',
      wakeDate: 'Sábado 23 de Agosto de 2026',
      wakeHours: 'Servicio concluido',
      massDetails: 'Responso rezado en Capilla Ardiente',
      processionTime: 'Cortejo realizado el 23/08 a las 11:00 hs',
      cemeteryOrCrematory: 'Cementerio Parque Las Lajitas',
      locationAddress: 'Ruta Provincial 5 km 12'
    },
    candlesCount: 68,
    condolences: [
      {
        id: 'c-4',
        author: 'Graciela y Héctor Guzmán',
        relationship: 'Primos',
        message: 'Querida tía Carmen, tu sonrisa y bondad nos acompañarán siempre. Abrazamos fuerte a Beatriz y Ricardo.',
        timestamp: 'Ayer',
        candleLit: true
      },
      {
        id: 'c-5',
        author: 'Familia Albarracín',
        relationship: 'Amigos',
        message: 'Un abrazo fraternal a la familia Carrizo Mendoza. Rogamos por el eterno descanso de su alma.',
        timestamp: 'Ayer',
        candleLit: true
      }
    ],
    tributes: [
      { id: 't-4', type: 'candle', author: 'Patricia C.', timestamp: 'Hace 1 día' },
      { id: 't-5', type: 'flower', author: 'Familia Ortiz', timestamp: 'Hace 1 día' }
    ]
  },
  {
    id: 'obit-03',
    fullName: 'Ing. Lucas Gonzalo Peralta',
    epitaph: 'Tu paso por este mundo dejó una huella luminosa de bondad, pasión y compañerismo.',
    birthDate: '19 de Noviembre de 1979',
    passedDate: '21 de Agosto de 2026',
    age: 46,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    biography: 'Profesional respetado del sector agropecuario del Valle de Anta. Gran deportista, amigo leal y padre devoto de Facundo y Sofía. Su entusiasmo y compromiso social permanecen vivos entre sus colegas y afectos.',
    familyMembers: ['Su compañera Valeria', 'Sus hijos Facundo y Sofía', 'Sus padres Carlos y Silvia', 'Hermanos'],
    status: 'cremado',
    funeralService: {
      chapelRoom: 'Sala Memorial "Los Olivos"',
      wakeDate: 'Viernes 22 de Agosto de 2026',
      wakeHours: 'Ceremonia de despedida familiar y cremación',
      massDetails: 'Oratorio Ecuménico Central',
      processionTime: 'Traslado al Crematorio Privado Salta Capital',
      cemeteryOrCrematory: 'Cinerario y Ceremonia de Cenizas en Bosque Memorial',
      locationAddress: 'Cochería Central J.V. González'
    },
    candlesCount: 95,
    condolences: [
      {
        id: 'c-6',
        author: 'Compañeros del Colegio de Ingenieros',
        relationship: 'Colegas',
        message: 'Lamentamos con gran pesar la temprana partida de Lucas. Un profesional brillante y una persona de enorme corazón. Todo nuestro apoyo a Valeria y a sus niños.',
        timestamp: 'Hace 2 días',
        candleLit: true,
        floralTribute: 'Palmas de condolencia'
      },
      {
        id: 'c-7',
        author: 'Club Atlético Barrio Norte',
        relationship: 'Comisión directiva y socios',
        message: 'Acompañamos a la familia Peralta en este doloroso trance. Lucas siempre apoyó a los jóvenes de nuestra institución.',
        timestamp: 'Hace 2 días',
        candleLit: true
      }
    ],
    tributes: [
      { id: 't-6', type: 'candle', author: 'Mariana S.', timestamp: 'Hace 2 días' },
      { id: 't-7', type: 'heart', author: 'Facu y Sofi', timestamp: 'Hace 2 días' }
    ]
  },
  {
    id: 'obit-04',
    fullName: 'Sra. Irma Teresa Balderrama',
    epitaph: 'En la paz del Señor descansa tu alma noble y generosa.',
    birthDate: '08 de Agosto de 1951',
    passedDate: '19 de Agosto de 2026',
    age: 75,
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80',
    biography: 'Nacida en Joaquín V. González. Dedicó su vida a las labores solidarias en comedores comunitarios y a su querida familia. Deja un testimonio invaluable de fortaleza cristiana y amor al prójimo.',
    familyMembers: ['Sus hijos Juan, Claudia y Estela', 'Hermanos', 'Sobrinos y nietos'],
    status: 'inhumado',
    funeralService: {
      chapelRoom: 'Sala La Merced',
      wakeDate: 'Miércoles 20 de Agosto de 2026',
      wakeHours: 'Servicio concluido',
      massDetails: 'Misa en Capilla San Cayetano',
      processionTime: '16:00 hs',
      cemeteryOrCrematory: 'Cementerio Municipal Central',
      locationAddress: 'J.V. González'
    },
    candlesCount: 54,
    condolences: [
      {
        id: 'c-8',
        author: 'Comedor Los Angelitos',
        relationship: 'Compañeras de voluntariado',
        message: 'Irma querida, nunca olvidaremos tus manos generosas y tu sonrisa reconfortante. Descansa en los brazos de Dios.',
        timestamp: 'Hace 4 días',
        candleLit: true
      }
    ],
    tributes: [
      { id: 't-8', type: 'prayer', author: 'Grupo de Oración', timestamp: 'Hace 4 días' }
    ]
  }
];

export const FUNERAL_SERVICES: FuneralServiceItem[] = [
  {
    id: 'serv-sepelio-integral',
    title: 'Servicios de Sepelio Integral',
    shortDesc: 'Atención personalizada, ataúdes de alta calidad, capilla ardiente acondicionada y coordinación completa del cortejo.',
    fullDesc: 'Nos encargamos de cada aspecto ceremonial y logístico con la mayor dignidad. Proveemos ataúdes artesanales lustrados, mortajas especiales, acondicionamiento tanatoestético respetuoso, símbolos religiosos y servicio ceremonial con maestría de ceremonias.',
    category: 'sepelio',
    icon: 'Shield',
    features: [
      'Ataúd de maderas seleccionadas con herrajes de bronce o plata',
      'Acondicionamiento y vestimenta ceremonial',
      'Capilla ardiente completa con cirios, crucifijo o símbolos laicos',
      'Carroza fúnebre ceremonial de última generación y coche de duelo',
      'Personal de cortejo uniformado y protocolo de honras'
    ],
    pricingIndication: 'Planes a medida con cobertura PAMI y Obras Sociales',
    highlighted: true
  },
  {
    id: 'serv-salas-velatorias',
    title: 'Salas Velatorias Climatizadas & Suites',
    shortDesc: 'Instalaciones diseñadas para brindar máxima serenidad, privacidad y confort a las familias durante las honras.',
    fullDesc: 'Nuestras 3 salas velatorias cuentan con climatización central frío/calor, iluminación tenue regulable, servicio de cafetería e infusiones continuas, suites privadas de descanso con baño exclusivo y conexión Wi-Fi de alta velocidad para transmisión remota.',
    category: 'salas',
    icon: 'Home',
    features: [
      'Salas independientes con aislamiento acústico',
      'Suite privada para descanso de familiares directos',
      'Servicio continuo de café, té y bebidas frías',
      'Transmisión online privada (Streaming) para familiares a distancia',
      'Oratorio ecuménico para responsos y oraciones'
    ],
    pricingIndication: 'Incluido en servicios contratados'
  },
  {
    id: 'serv-cremaciones',
    title: 'Servicio de Cremación & Cenizas',
    shortDesc: 'Proceso formal, seguro y transparente con entrega certificada de cenizas y amplia variedad de urnas cinerarias.',
    fullDesc: 'Gestionamos el proceso de cremación integral cumpliendo con todos los marcos legales y sanitarios. Incluye ataúd ecológico para cremación, traslado especializado, custodia digna y entrega de cenizas en urnas de madera fina, cerámica, biodegradables o relicarios conmemorativos.',
    category: 'cremacion',
    icon: 'Flame',
    features: [
      'Gestión legal de permisos y certificados de cremación',
      'Ataúd ecológico biodegradable para el proceso',
      'Urna cineraria a elección con placa grabada',
      'Ceremonia de despedida previa en capilla ardiente',
      'Opciones de esparcimiento en Jardín de Cenizas Memorial'
    ],
    pricingIndication: 'Consulte planes directos y previsionales'
  },
  {
    id: 'serv-traslados',
    title: 'Traslados Nacionales & Repatriaciones',
    shortDesc: 'Unidades móviles furgón y carrozas habilitadas para traslados a cualquier punto del país y zonas rurales de Anta.',
    fullDesc: 'Disponemos de flota moderna homologada por el Ministerio de Salud para traslados terrestres desde y hacia Salta Capital, Tucumán, Jujuy, Buenos Aires y toda la República Argentina, así como gestiones aduaneras y consulares para repatriaciones internacionales.',
    category: 'traslado',
    icon: 'Truck',
    features: [
      'Flota propia de vehículos sanitarios de larga distancia',
      'Acondicionamiento para viajes de media y larga distancia',
      'Permisos de tránsito interprovincial y guías de sepultura',
      'Cobertura en parajes rurales de Joaquín V. González y el Departamento Anta',
      'Coordinación con aeropuertos y empresas de aviación'
    ],
    pricingIndication: 'Presupuestos por kilómetro transparentes'
  },
  {
    id: 'serv-gestoria',
    title: 'Gestoría de Trámites & Documentación',
    shortDesc: 'Nos ocupamos del 100% de la tramitación legal ante Registro Civil, Cementerios, ANSES y Obras Sociales.',
    fullDesc: 'En momentos de profundo dolor, nuestro equipo administrativo especializado se ocupa de obtener el certificado médico de defunción, acta en el Registro Civil, autorización de inhumación/cremación, subsidios de contención familiar y gestiones con PAMI y obras sociales.',
    category: 'tramites',
    icon: 'FileText',
    features: [
      'Inscripción de defunción en Registro Civil de las Personas',
      'Tramitación directa de subsidios de sepelio ante ANSES',
      'Convenios activos con PAMI, IPS Salta, OSDE, Swiss Medical y mutuales',
      'Entrega de copias legalizadas del Acta de Defunción a la familia',
      'Asesoramiento sucesorio inicial sin cargo'
    ],
    pricingIndication: 'Gestión sin costo adicional en el servicio'
  },
  {
    id: 'serv-floreria',
    title: 'Florería Ceremonial & Avisos Fúnebres',
    shortDesc: 'Arreglos florales naturales de alta jerarquía, coronas, palmas y publicación de homenajes en medios y redes.',
    fullDesc: 'Elaboración propia de coronas florales con flores naturales frescas seleccionadas, cintas dedicatorias impresas personalizadas, ramos de condolencia y publicación inmediata de avisos necrológicos en nuestro obituario digital, diarios regionales y redes sociales.',
    category: 'floreria',
    icon: 'Flower2',
    features: [
      'Coronas clásicas, presidenciales y palmas de condolencia',
      'Cintas recordatorias personalizadas con estampado dorado',
      'Entrega puntual y colocación cuidada en sala velatoria',
      'Obituario digital permanente con libro de firmas y velas',
      'Avisos necrológicos en prensa escrita y radial de Salta'
    ],
    pricingIndication: 'Catálogo de arreglos disponible 24hs'
  },
  {
    id: 'serv-prevision',
    title: 'Planes de Previsión Familiar',
    shortDesc: 'Proteja el bienestar y la tranquilidad de su familia con cuotas accesibles y congelamiento total de costos a futuro.',
    fullDesc: 'La previsión funeraria es un acto de amor y responsabilidad. Nuestros planes familiares permiten cubrir a todos los integrantes del grupo conviviente con pequeñas cuotas mensuales fijas, garantizando un servicio de excelencia sin gastos imprevistos.',
    category: 'prevision',
    icon: 'HeartHandshake',
    features: [
      'Cobertura para todo el grupo familiar primario y adherentes',
      'Sin límite de edad para la adhesión inicial',
      'Congelamiento de costos y sin copagos ocultos',
      'Incluye sepelio integral, sala velatoria y traslado regional',
      'Bonificaciones especiales por pago anual o débito automático'
    ],
    pricingIndication: 'Planes desde $3.500 / mes por persona'
  }
];

export const PHOTO_GALLERY: PhotoGalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Sala Velatoria Central "La Merced"',
    category: 'salas',
    imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80',
    description: 'Espacio cálido, sobrio y respetuoso equipado con sillones confortables, climatización central y luz natural tamizada.'
  },
  {
    id: 'gal-2',
    title: 'Oratorio Ecuménico de Responso',
    category: 'capilla',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
    description: 'Área consagrada para ceremonias religiosas, responsos, oraciones ecuménicas o meditaciones íntimas.'
  },
  {
    id: 'gal-3',
    title: 'Suite Privada de Descanso Familiar',
    category: 'salas',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Ambiente privado exclusivo para la familia directa, con baño en suite, sofá cama y refrigerio permanente.'
  },
  {
    id: 'gal-4',
    title: 'Flota Ceremonial y de Acompañamiento',
    category: 'flota',
    imageUrl: '/images/flota-ceremonial.jpg',
    description: 'Carrozas fúnebres de última generación y unidades de traslado sanitario con riguroso mantenimiento protocolar.'
  },
  {
    id: 'gal-5',
    title: 'Jardín de la Serenidad y Descanso',
    category: 'jardines',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    description: 'Espacio verde exterior arbolado con fuentes de agua y bancos para tomar aire en momentos de recogimiento.'
  },
  {
    id: 'gal-6',
    title: 'Área de Recepción & Atención Personalizada',
    category: 'atencion',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'Oficinas de asesoramiento donde nuestro personal especializado brinda contención y guía personalizada 24hs.'
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    familyName: 'Familia Morales Albornoz',
    deceasedMention: 'En memoria de Don Horacio Morales',
    serviceDate: 'Julio 2026',
    comment: 'En un momento tan inesperado y doloroso, la calidez humana y la eficiencia de Cochería J.V. González fueron una verdadera bendición. Resolvieron todos los papeles con el PAMI y nos brindaron una contención inigualable en la sala. Gracias por tanto respeto.',
    rating: 5,
    verifiedFamily: true,
    location: 'Joaquín V. González'
  },
  {
    id: 'test-2',
    familyName: 'Dra. Silvina Romero y Hermanos',
    deceasedMention: 'En memoria de Doña Teresa Romero',
    serviceDate: 'Junio 2026',
    comment: 'Tuvimos que organizar el traslado desde Salta Capital hasta J.V. González. La coordinación fue impecable, puntual y muy delicada. Las instalaciones son hermosas y permitieron que toda la familia se despidiera con la paz que mamá merecía.',
    rating: 5,
    verifiedFamily: true,
    location: 'El Quebrachal / Salta'
  },
  {
    id: 'test-3',
    familyName: 'Familia Farfán - Benítez',
    deceasedMention: 'En memoria de Marcelo Farfán',
    serviceDate: 'Mayo 2026',
    comment: 'El obituario digital permitió que familiares que viven en el sur y en España pudieran enviar sus condolencias y encender una vela. Agradecemos la profesionalidad de todo el personal en cada detalle.',
    rating: 5,
    verifiedFamily: true,
    location: 'Las Lajitas'
  },
  {
    id: 'test-4',
    familyName: 'Familia Chávez',
    deceasedMention: 'En memoria de Abuelo Celestino Chávez',
    serviceDate: 'Agosto 2026',
    comment: 'Teníamos el plan de previsión familiar contratado hace 8 años. Cuando lo necesitamos, no tuvimos que preocuparnos por ningún pago sorpresa ni trámite engorroso. Cumplieron con creces todo lo prometido.',
    rating: 5,
    verifiedFamily: true,
    location: 'Joaquín V. González'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: '¿Qué debo hacer en el primer instante ante el fallecimiento de un familiar?',
    answer: 'Lo primero y más importante es comunicarse con nuestra línea de guardia 24hs (03877 - 421500 o WhatsApp directo). Si el deceso ocurrió en un sanatorio u hospital, el médico de guardia emitirá el Certificado Médico de Defunción. Si ocurrió en el domicilio, nuestro equipo le indicará cómo proceder para la visita del médico policial o facultativo particular y enviaremos una unidad de asistencia de inmediato.',
    category: 'urgencias'
  },
  {
    id: 'faq-2',
    question: '¿Qué documentación se necesita para iniciar el servicio fúnebre?',
    answer: 'Se requiere: 1) DNI original y copia del fallecido. 2) Certificado Médico de Defunción (Formulario oficial firmado y sellado por médico matriculado). 3) DNI del familiar directo o persona responsable que contrata el servicio. 4) Carnet de afiliación a PAMI u Obra Social si corresponde.',
    category: 'documentacion'
  },
  {
    id: 'faq-3',
    question: '¿Cochería J.V. González atiende afiliados de PAMI y Obras Sociales?',
    answer: 'Sí. Tenemos convenios directos y gestionamos la cobertura y reintegros con PAMI, IPS (Instituto Provincial de Salud de Salta), IOMA, OSECAC, Unión Personal, OSDE, Swiss Medical, Sancor Salud y la mayoría de las mutuales gremiales y seguros de vida.',
    category: 'coberturas'
  },
  {
    id: 'faq-4',
    question: '¿Cuáles son los requisitos legales para una cremación?',
    answer: 'Para una cremación se precisa la autorización firmada por los deudos directos con orden de prelación legal (cónyuge, hijos mayores o padres), el Certificado Médico de Defunción donde conste expresamente causa de muerte natural (o autorización judicial en caso de intervención policial), y DNI de los firmantes.',
    category: 'servicios'
  },
  {
    id: 'faq-5',
    question: '¿Cómo funciona el servicio de traslado a otras provincias o zonas rurales?',
    answer: 'Contamos con móviles fúnebres de larga distancia acondicionados sanitariamente según normas de la Secretaría de Salud y CNRT. Tramitamos las guías de tránsito interdepartamental e interprovincial de manera ágil para traslados terrestres a cualquier punto del país o parajes del Departamento Anta.',
    category: 'servicios'
  },
  {
    id: 'faq-6',
    question: '¿En qué consiste el Plan de Previsión Familiar y qué ventajas tiene?',
    answer: 'Es un sistema de ahorro previsional solidario que cubre a todo su grupo familiar mediante una cuota mensual muy reducida. Permite asegurar de antemano la totalidad de los servicios fúnebres, sala velatoria, ataúd y trámites, protegiendo a su familia de desembolsos imprevistos y angustia económica en momentos críticos.',
    category: 'prevision'
  }
];

export const EMERGENCY_INFO = {
  name: 'Cochería J.V. González',
  subtitle: 'Empresa de Sepelios & Servicios Fúnebres de Excelencia',
  address: 'Av. General Güemes 450 (Frente a Plaza Central), Joaquín V. González, Salta, Argentina',
  phoneGuard24: '+54 3877 42-1500',
  phoneEmergencyMobile: '+54 9 3877 49-8822',
  whatsappNumber: '5493877498822',
  whatsappUrl: 'https://wa.me/5493877498822?text=Hola,%20necesito%20asistencia%20urgente%20de%20Cocher%C3%ADa%20J.V.%20Gonz%C3%A1lez',
  emailAdmin: 'contacto@cocheriajvgonzalez.com.ar',
  emailGuard: 'guardia24@cocheriajvgonzalez.com.ar',
  hoursAdministration: 'Lunes a Sábado de 08:00 a 20:00 hs',
  hoursGuard: 'Guardia y Salas de Velatorio: Atención Ininterrumpida las 24 horas, los 365 días del año',
  social: {
    facebook: 'https://facebook.com/cocheriajvgonzalez',
    instagram: 'https://instagram.com/cocheriajvgonzalez',
    whatsapp: 'https://wa.me/5493877498822',
    youtube: 'https://youtube.com'
  }
};

export interface RegionalBranch {
  id: 'jv_gonzalez' | 'guemes' | 'metan';
  brandName: string;
  categoryTag: string;
  city: string;
  department: string;
  address: string;
  phoneGuard: string;
  phoneMobile: string;
  whatsappUrl: string;
  brandColor: string;
  badgeBg: string;
  description: string;
  coverage: string[];
  features: string[];
  isMainHq?: boolean;
}

export const GROUP_BRANCHES: RegionalBranch[] = [
  {
    id: 'jv_gonzalez',
    brandName: 'Cochería J.V. González',
    categoryTag: 'Casa Central & Guardia Permanente',
    city: 'Joaquín V. González',
    department: 'Departamento Anta, Salta',
    address: 'Av. General Güemes 450 (Frente a Plaza Central)',
    phoneGuard: '+54 3877 42-1500',
    phoneMobile: '+54 9 3877 49-8822',
    whatsappUrl: 'https://wa.me/5493877498822?text=Hola,%20me%20comunico%20con%20Cochería%20J.V.%20González',
    brandColor: '#1B4D75',
    badgeBg: 'bg-sky-900/20 text-sky-700 dark:text-sky-300 border-sky-400/40',
    description: 'Nuestra sede central e histórica en el este salteño. Brinda servicio integral de sepelios, salas velatorias de alta categoría, cremaciones y traslados fúnebres de larga distancia a todo el país.',
    coverage: [
      'Joaquín V. González (Centro)',
      'Las Lajitas & Río del Valle',
      'El Quebrachal & Gaona',
      'Tolloche & Ntra. Sra. de Talavera',
      'Parajes y Zonas Rurales de Anta'
    ],
    features: [
      'Salas Velatorias Climatizadas',
      'Oratorio Multicredo & Capilla Ardiente',
      'Flota Ceremonial y de Larga Distancia',
      'Convenios PAMI, IPS y Obras Sociales'
    ],
    isMainHq: true
  },
  {
    id: 'guemes',
    brandName: 'Servicios Sociales Güemes',
    categoryTag: 'Sede Valle de Siancas',
    city: 'General Güemes',
    department: 'Departamento General Güemes, Salta',
    address: 'Alberdi 320, Gral. Güemes, Salta',
    phoneGuard: '+54 387 491-1200',
    phoneMobile: '+54 9 387 512-3344',
    whatsappUrl: 'https://wa.me/5493875123344?text=Hola,%20me%20comunico%20con%20Servicios%20Sociales%20Güemes',
    brandColor: '#111111',
    badgeBg: 'bg-stone-900/20 text-stone-800 dark:text-stone-200 border-stone-400/40',
    description: 'Atención personalizada para las familias de todo el Valle de Siancas con el respaldo de nuestra red de servicios sociales, planes previsionales y asesoría legal para deudos.',
    coverage: [
      'General Güemes (Ciudad)',
      'Campo Santo & El Bordo',
      'Cobos & Torzalito',
      'Corredor Ruta Nacional 34'
    ],
    features: [
      'Planes de Previsión Familiar Social',
      'Sala de Sepelios Cómoda & Privada',
      'Gestión Directa ante Registro Civil',
      'Asistencia Ininterrumpida 24hs'
    ]
  },
  {
    id: 'metan',
    brandName: 'Cochería Metán',
    categoryTag: 'Sede Sur Salteño & Ruta 9/34',
    city: 'San José de Metán',
    department: 'Departamento Metán, Salta',
    address: '25 de Mayo 180, San José de Metán, Salta',
    phoneGuard: '+54 3876 42-2100',
    phoneMobile: '+54 9 3876 55-6677',
    whatsappUrl: 'https://wa.me/5493876556677?text=Hola,%20me%20comunico%20con%20Cochería%20Metán',
    brandColor: '#8C382F',
    badgeBg: 'bg-rose-950/20 text-rose-800 dark:text-rose-300 border-rose-400/40',
    description: 'Servicio fúnebre con calidez, tradición y solvencia en el sur de la provincia de Salta, con vinculación directa y traslados ágiles hacia Salta Capital, Tucumán y provincias vecinas.',
    coverage: [
      'San José de Metán',
      'Río Piedras & El Galpón',
      'Rosario de la Frontera',
      'Lumreras & Metán Viejo'
    ],
    features: [
      'Guardia Fúnebre Inmediata 24 Horas',
      'Unidades de Traslado de Alta Complejidad',
      'Salas Velatorias Modernizadas',
      'Asesoramiento Previsional y Trámites'
    ]
  }
];

