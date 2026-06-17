import type { Trip } from './schema';

/**
 * Sample trip used for local development and tests until the real travel plan
 * is provided. It is intentionally small but exercises every screen. The real
 * trip will live in `trip.ts` (generated via the `import-travel-plan` skill).
 *
 * Content is loosely modelled on the reference video (Japón 2026). Images are
 * omitted on purpose so cards fall back to gradients; real imagery is bundled
 * with the real plan.
 */
export const sampleTrip: Trip = {
  schemaVersion: 1,
  id: 'japon-2026',
  title: 'Japón 2026',
  subtitle: 'Viaje en familia',
  startDate: '2026-06-13',
  endDate: '2026-06-28',
  destinationTimezone: 'Asia/Tokyo',
  phraseLang: 'ja-JP',

  flights: [
    {
      id: 'fl-out',
      direction: 'outbound',
      airline: 'Iberia',
      flightNumber: 'IB0281',
      date: '2026-06-13',
      from: { name: 'Adolfo Suárez Madrid-Barajas', code: 'MAD', city: 'Madrid' },
      to: { name: 'Narita International', code: 'NRT', city: 'Tokio' },
      departLocal: '12:30',
      arriveLocal: '09:30',
      arrivalDayOffset: 1,
      durationLabel: '14:00 h',
      baggage: '1 maleta facturada por persona',
    },
    {
      id: 'fl-ret',
      direction: 'return',
      airline: 'Iberia',
      flightNumber: 'IB0282',
      date: '2026-06-28',
      from: { name: 'Narita International', code: 'NRT', city: 'Tokio' },
      to: { name: 'Adolfo Suárez Madrid-Barajas', code: 'MAD', city: 'Madrid' },
      departLocal: '11:10',
      arriveLocal: '19:45',
      arrivalDayOffset: 0,
      durationLabel: '15:35 h',
      baggage: '1 maleta facturada por persona',
    },
  ],

  accommodations: [
    {
      id: 'tokyo-dome',
      name: 'Tokyo Dome Hotel',
      city: 'Tokio',
      address: '1-3-61 Koraku, Bunkyo, Tokio',
      nights: ['13 de junio', '14 de junio', '15 de junio'],
      mapsQuery: 'Tokyo Dome Hotel, Tokyo',
    },
    {
      id: 'ana-kanazawa',
      name: 'ANA Crowne Plaza Kanazawa',
      city: 'Kanazawa',
      address: 'Showa Machi 16-3, Kanazawa',
      phone: '+81 76 224 6111',
      nights: ['19 de junio', '20 de junio'],
      mapsQuery: 'ANA Crowne Plaza Kanazawa',
    },
  ],

  places: [
    {
      id: 'meiji',
      name: 'Santuario Meiji',
      city: 'Tokio',
      category: 'temple',
      info: 'Santuario sintoísta dedicado al emperador Meiji, rodeado de un bosque tranquilo en pleno Tokio.',
      mapsQuery: 'Meiji Jingu, Tokyo',
    },
    {
      id: 'asakusa',
      name: 'Templo Asakusa (Senso-ji)',
      city: 'Tokio',
      category: 'temple',
      info: 'El templo budista más antiguo de Tokio, con la famosa puerta Kaminarimon.',
      mapsQuery: 'Senso-ji, Asakusa, Tokyo',
    },
    {
      id: 'tokyo-tower',
      name: 'Torre de Tokio',
      city: 'Tokio',
      category: 'monument',
      info: 'Mirador icónico con vistas de 360º sobre la ciudad.',
      mapsQuery: 'Tokyo Tower',
    },
    {
      id: 'fuji-5',
      name: 'Monte Fuji — quinta estación',
      city: 'Monte Fuji',
      category: 'nature',
      info: 'Subida por la Fuji Subaru Line hasta los 2.305 metros.',
      mapsQuery: 'Mount Fuji 5th Station',
    },
  ],

  days: [
    {
      index: 1,
      date: '2026-06-13',
      title: 'Madrid → Tokio',
      city: 'En vuelo',
      tags: [
        { label: 'Vuelo', kind: 'flight' },
        { label: 'Importante', kind: 'important' },
      ],
      summary: 'Salida desde Madrid hacia Tokio en vuelo directo de Iberia.',
      description:
        'Salida desde Madrid hacia Tokio en vuelo directo de Iberia. Llegada prevista al día siguiente por la mañana.',
      activities: [],
      mealsIncluded: [],
    },
    {
      index: 2,
      date: '2026-06-14',
      title: 'Llegada a Tokio — Ginza, Tsukiji y Shibuya',
      city: 'Tokio',
      tags: [
        { label: 'Traslado', kind: 'transfer' },
        { label: 'Día libre', kind: 'freeDay' },
        { label: 'Ruta de la familia', kind: 'family' },
      ],
      summary: 'Llegada a Narita, traslado al hotel y día libre con ruta personalizada.',
      description:
        'Llegada a Narita a las 09:30, traslado al hotel y día libre con ruta personalizada: compras y paseo por Ginza, comida en Tsukiji, Ueno, Omotesando y atardecer en Shibuya.',
      transitNotes:
        'Desde el hotel (Korakuen) a Ginza: línea Marunouchi con cambio en Kasumigaseki. Unos 20 minutos.',
      activities: [
        {
          id: 'a-narita',
          name: 'Llegada al aeropuerto de Narita (09:30)',
          type: 'transport',
        },
        {
          id: 'a-recepcion',
          name: 'Recepción por personal de habla hispana',
          type: 'transport',
        },
        {
          id: 'a-traslado',
          name: 'Traslado al hotel',
          type: 'transport',
          description: 'Tokyo Dome Hotel',
        },
        {
          id: 'a-muji',
          name: 'MUJI Ginza',
          type: 'shop',
          durationLabel: '45–60 min',
          description: 'Empezar aquí cuando abran. Tienda insignia con cafetería y supermercado.',
          mapsQuery: 'MUJI Ginza',
        },
      ],
      mealsIncluded: [],
      accommodationId: 'tokyo-dome',
    },
    {
      index: 3,
      date: '2026-06-15',
      title: 'Tokio — visita organizada',
      city: 'Tokio',
      tags: [{ label: 'Comida incluida', kind: 'mealIncluded' }],
      summary: 'Primera visita organizada por Tokio: Torre de Tokio, Meiji, Palacio y Asakusa.',
      description:
        'Primera visita organizada por Tokio: Torre de Tokio, Santuario Meiji, Palacio Imperial y Asakusa.',
      activities: [
        { id: 'a-meiji', name: 'Santuario Meiji', type: 'temple', placeId: 'meiji' },
        { id: 'a-asakusa', name: 'Templo Asakusa', type: 'temple', placeId: 'asakusa' },
        { id: 'a-tower', name: 'Torre de Tokio', type: 'viewpoint', placeId: 'tokyo-tower' },
      ],
      mealsIncluded: ['Almuerzo'],
      accommodationId: 'tokyo-dome',
    },
  ],

  phrases: [
    {
      id: 'saludos',
      title: 'Saludos',
      phrases: [
        { es: 'Hola', target: 'こんにちは', romaji: 'konnichiwa' },
        { es: 'Buenos días', target: 'おはようございます', romaji: 'ohayou gozaimasu' },
        { es: 'Buenas noches', target: 'こんばんは', romaji: 'konbanwa' },
        { es: 'Gracias', target: 'ありがとうございます', romaji: 'arigatou gozaimasu' },
      ],
    },
    {
      id: 'basicas',
      title: 'Básicas',
      phrases: [
        { es: 'Perdón / disculpe', target: 'すみません', romaji: 'sumimasen' },
        { es: 'No hablo japonés', target: '日本語が話せません', romaji: 'nihongo ga hanasemasen' },
        { es: 'No entiendo', target: 'わかりません', romaji: 'wakarimasen' },
        {
          es: 'Por favor, hable despacio',
          target: 'ゆっくり話してください',
          romaji: 'yukkuri hanashite kudasai',
        },
      ],
    },
    {
      id: 'transporte',
      title: 'Transporte',
      phrases: [{ es: '¿Dónde está la estación?', target: '駅はどこですか？', romaji: 'eki wa doko desu ka' }],
    },
  ],

  insurance: {
    provider: 'Seguro de ejemplo',
    bookingLocator: '9988776655',
    providerLocator: 'N-000000',
    assistance: [
      { label: 'Asistencia 24 h (general)', value: '+34 900 000 002', channel: 'call' },
      { label: 'Central de asistencia 24 h', value: '+34 900 000 003', channel: 'call' },
      { label: 'WhatsApp asistencia', value: '+34 600 000 004', channel: 'whatsapp' },
    ],
    email: 'siniestros@ejemplo-seguros.com',
  },

  help: {
    documents: [
      'Pasaporte en vigor durante toda la estancia. Es obligatorio.',
      'El DNI NO es válido para viajar a Japón.',
      'No se necesita visado para estancias de hasta 90 días.',
      'Llevad siempre el pasaporte encima durante la estancia.',
      'Revisad que los nombres de la reserva coincidan con el pasaporte.',
    ],
    links: [
      {
        label: 'Abrir Visit Japan Web',
        url: 'https://www.vjw.digital.go.jp/',
        description:
          'Registro online oficial para agilizar la entrada en Japón (inmigración y aduana). Conviene rellenarlo antes de volar.',
      },
    ],
    reminders: [
      'Ante cualquier problema: primero llamad a la asistencia en destino. Para temas médicos, llamad también al seguro (24 h).',
    ],
    emergencyContacts: [
      { label: 'Emergencias en Japón (policía)', value: '110', channel: 'call' },
      { label: 'Emergencias en Japón (ambulancia/bomberos)', value: '119', channel: 'call' },
    ],
  },
};
