import { ProjectConfig } from './types';

export interface FontOption {
  name: string;
  category: 'sans' | 'serif' | 'mono' | 'system';
  google: boolean;
}

export const FONT_FAMILIES: FontOption[] = [
  // Sans-serif
  { name: 'Inter',        category: 'sans',   google: false },
  { name: 'Poppins',      category: 'sans',   google: true  },
  { name: 'Montserrat',   category: 'sans',   google: true  },
  { name: 'Raleway',      category: 'sans',   google: true  },
  { name: 'Open Sans',    category: 'sans',   google: true  },
  { name: 'Nunito',       category: 'sans',   google: true  },
  { name: 'Lato',         category: 'sans',   google: true  },
  { name: 'DM Sans',      category: 'sans',   google: true  },
  { name: 'Figtree',      category: 'sans',   google: true  },
  { name: 'Geist',        category: 'sans',   google: true  },
  // Serif
  { name: 'Playfair Display', category: 'serif', google: true  },
  { name: 'Merriweather',     category: 'serif', google: true  },
  { name: 'Lora',             category: 'serif', google: true  },
  { name: 'EB Garamond',      category: 'serif', google: true  },
  { name: 'Georgia',          category: 'serif', google: false },
  // Monospace
  { name: 'JetBrains Mono',  category: 'mono', google: true  },
  { name: 'Fira Code',       category: 'mono', google: true  },
  { name: 'Source Code Pro', category: 'mono', google: true  },
];

export const FONT_SIZES = [
  '10px', '11px', '12px', '13px', '14px', '15px', '16px',
  '18px', '20px', '22px', '24px', '28px', '32px', '36px', '42px',
];

export const FONT_WEIGHTS: { label: string; value: string }[] = [
  { label: 'Thin (300)',      value: '300' },
  { label: 'Regular (400)',   value: '400' },
  { label: 'Medium (500)',    value: '500' },
  { label: 'Semibold (600)',  value: '600' },
  { label: 'Bold (700)',      value: '700' },
  { label: 'Extrabold (800)', value: '800' },
];

export const SYSTEM_FONTS = new Set(['Inter', 'Georgia', 'Arial', 'Helvetica', 'system-ui']);

export const DEFAULT_CONFIG: ProjectConfig = {
  kDriveUrl: 'https://kdrive.infomaniak.com/app/collaborate/2817260/c2b3831c-6495-4118-bad0-ac3a1d762559',
  externalGeovisorUrl: 'https://ovc.catastro.meh.es/',
  externalRutasUrl: 'https://www.google.com/maps',
  externalNotasSimplesUrl: 'https://registradores.org',
  externalAplicacionesUrl: 'https://www.geotasalia.es',
  externalVisorUrbanisticoUrl: 'https://www.miteco.gob.es/es/cartografia-y-sig/visores-sig.html',
  rgpdResponsable: 'Jorge Martínez Martínez - GEOTASALIA',
  rgpdNif: '44321987-X',
  rgpdDireccion: 'Calle Técnica Agrónoma 14, Alcalá de Guadaíra, 41500 Sevilla',
  rgpdEmail: 'jorge.martinez@geotasalia.es',
  rgpdDpd: 'gestion@geotasalia.es',
  customLogoUrl: '',
  logoScale: 120,
  logoHalo: 0,
  theme: 'navy-gold',
  // Hero contact
  contactPhone: '633067650',
  contactEmail: 'jorge.martinez@geotasalia.es',
  contactWhatsappMsg: 'Hola%20Jorge,%20necesito%20consultarte%20un%20servicio%20técnico%20de%20ingeniería/valoración%20agrícola',
  // Hero texts
  heroSubtitle: 'Ingeniería Agrícola & Valoraciones Rústicas',
  heroDescription: 'Especialistas en tasaciones oficiales de fincas, dictámenes periciales rústicos, proyectos de regadío, topografía de precisión y análisis de viabilidad registral. Rigor técnico y confidencialidad en cada proyecto.',
  // Form
  formRecipientEmail: 'jorge.martinez@geotasalia.es',
  formRecipientName: 'Jorge',
  formBccEmail: 'arnydivision@gmail.com',
  // Dynamic tools
  customTools: [
    {
      id: 'geovisor',
      title: 'geovisor',
      description: 'Visualización ágil de parcelación, linderos y cartografía catastral rústica.',
      url: 'https://ovc.catastro.meh.es/',
      icon: 'Map',
      accessLabel: 'Abrir visor',
    },
    {
      id: 'rutas',
      title: 'gestor de rutas',
      description: 'Planificación de salidas al campo, cálculo de distancias y logística técnica.',
      url: 'https://www.google.com/maps',
      icon: 'Route',
      accessLabel: 'Planificar salida',
    },
    {
      id: 'urbanismo',
      title: 'visor urbanístico',
      description: 'Calificaciones de suelo rústico, planeamiento urbanístico municipal y ordenación.',
      url: 'https://www.miteco.gob.es/es/cartografia-y-sig/visores-sig.html',
      icon: 'Compass',
      accessLabel: 'Consultar urbanismo',
    },
    {
      id: 'registro',
      title: 'análisis registral',
      description: 'Buscador y verificación técnica de cargas, titularidades y fincas registrales.',
      url: 'https://registradores.org',
      icon: 'BookOpen',
      accessLabel: 'Verificar finca',
    },
  ],
  // Dynamic services dropdown
  customServices: [
    'Valoración Agrícola',
    'Ingeniería Agrícola',
    'Topografía y Catastro',
    'Informes Periciales',
    'Análisis Registral',
  ],
  // SMTP
  smtp: {
    host: 'mail.infomaniak.com',
    port: '587',
    user: '',
    pass: '',
    to: '',
    bcc: '',
  },
  // Access credentials
  credentials: {
    clientUser: 'cliente',
    clientPass: 'cliente2026',
    adminUser: 'admin',
    adminPass: 'admin2026',
    recoveryEmail: 'jorge.martinez@geotasalia.es',
  },
  // Typography
  typography: {
    heading: { family: 'Inter', size: '20px', color: '#ffffff', weight: '700' },
    body:    { family: 'Inter', size: '14px', color: '#9ca3af', weight: '400' },
    ui:      { family: 'Inter', size: '12px', color: '#e5e7eb', weight: '500' },
    accentColor: '#eab308',
  },
  // Dynamic service cards
  serviceCards: [
    {
      id: 'valoracion',
      title: 'Valoraciones Agrícolas',
      description: 'Tasaciones oficiales de fincas rústicas para herencias, divorcios, expropiaciones forzosas, garantías hipotecarias y valoraciones de cosechas, cultivos leñosos o derechos de agua de riego.',
      callToAction: 'Solicitar presupuesto',
      prefillService: 'Valoración Agrícola',
      prefillMessage: 'Hola Jorge, solicito información y presupuesto detallado para la tasación oficial de una finca rústica o valoración de cultivo.',
    },
    {
      id: 'ingenieria',
      title: 'Ingeniería Agronómica',
      description: 'Proyectos de legalización de pozos, diseño de balsas e infraestructuras de riego, naves agrícolas, planes de ordenación de explotaciones, estudios de impacto ambiental e informes periciales.',
      callToAction: 'Solicitar información',
      prefillService: 'Ingeniería Agrícola',
      prefillMessage: 'Hola Jorge, necesito consultarte sobre un proyecto técnico de ingeniería agrícola (pozos, balsas de riego o naves).',
    },
    {
      id: 'topografia',
      title: 'Topografía y Catastro',
      description: 'Mediciones de fincas rústicas mediante GPS de precisión, deslindes contradictorios, segregaciones, planos GML y tramitación de expedientes catastrales (art. 18.1 LCI) por discrepancias de cabida.',
      callToAction: 'Solicitar topografía',
      prefillService: 'Topografía y Catastro',
      prefillMessage: 'Hola Jorge, necesito realizar un levantamiento topográfico, deslinde o subsanación de discrepancias catastrales.',
    },
  ],
};

export const CATASTRAL_SAMPLES = [
  {
    ref: '4752801VK4745S0001YD',
    address: 'Calle Mayor 12, Madrid',
    use: 'Residencial',
    surface: 180,
    year: 1998,
    boundary: [
      { x: 30, y: 20 },
      { x: 120, y: 15 },
      { x: 130, y: 95 },
      { x: 40, y: 110 },
      { x: 30, y: 20 }
    ],
    owner: 'D. Juan Martínez'
  },
  {
    ref: '9823104VK4798N0001AZ',
    address: 'Avenida de la Constitución 45, Sevilla',
    use: 'Oficinas',
    surface: 450,
    year: 2005,
    boundary: [
      { x: 40, y: 30 },
      { x: 150, y: 40 },
      { x: 140, y: 120 },
      { x: 20, y: 100 },
      { x: 40, y: 30 }
    ],
    owner: 'Geotasalia Inversiones S.L.'
  },
  {
    ref: '1245902VK4712F0001OP',
    address: 'Polígono Industrial Las Arenas, Parcela 8, Zaragoza',
    use: 'Industrial',
    surface: 1200,
    year: 2012,
    boundary: [
      { x: 15, y: 15 },
      { x: 180, y: 20 },
      { x: 170, y: 140 },
      { x: 10, y: 130 },
      { x: 15, y: 15 }
    ],
    owner: 'Talleres del Ebro S.A.'
  }
];

export const CTE_SOIL_TYPES = [
  { id: 'T1', name: 'Roca o Suelo Muy Rígido (Tipo I)', description: 'Rocas compactas, arenas o gravas muy densas.' },
  { id: 'T2', name: 'Suelo de Rigidez Media (Tipo II)', description: 'Gravas y arenas de densidad media, arcillas firmes.' },
  { id: 'T3', name: 'Suelo Blando o Flojo (Tipo III)', description: 'Suelos cohesivos blandos, arenas sueltas, fangos.' }
];

export const CTE_BUILDING_TYPES = [
  { id: 'C0', name: 'Construcción Sencilla (C-0)', description: 'Hasta 1 planta, luces < 6m, superficie < 100 m².' },
  { id: 'C1', name: 'Construcción Media (C-1)', description: 'De 1 a 3 plantas, luces < 12m, superficie < 1000 m².' },
  { id: 'C2', name: 'Construcción Compleja (C-2)', description: 'De 4 a 10 plantas, luces < 20m, superficie de 1000 a 5000 m².' },
  { id: 'C3', name: 'Construcción Singular (C-3)', description: 'Más de 10 plantas, luces > 20m o sótanos profundos.' }
];

export const AVAILABLE_ICONS = [
  'Map', 'Route', 'Compass', 'BookOpen', 'Globe', 'MapPin',
  'Layers', 'Crop', 'TreePine', 'Mountain', 'Ruler', 'FileText',
  'Search', 'Database', 'Link', 'Settings', 'Tool', 'Briefcase',
];
