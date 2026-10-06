export interface ToolCard {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string; // lucide icon name
  accessLabel?: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  callToAction: string;
  prefillService: string;
  prefillMessage: string;
}

export interface TypographyLayer {
  family?: string;   // font-family name
  size?: string;     // e.g. '14px'
  color?: string;    // hex e.g. '#ffffff'
  weight?: string;   // '400'|'500'|'600'|'700'|'800'
}

export interface TypographyConfig {
  heading?: TypographyLayer;   // h2, h3, section titles
  body?: TypographyLayer;      // paragraphs, descriptions
  ui?: TypographyLayer;        // buttons, labels, nav, inputs
  accentColor?: string;        // replaces yellow-500 accent globally
}

export interface ProjectConfig {
  // URLs
  kDriveUrl: string;
  externalGeovisorUrl: string;
  externalRutasUrl: string;
  externalNotasSimplesUrl: string;
  externalAplicacionesUrl: string;
  externalVisorUrbanisticoUrl: string;
  // RGPD
  rgpdResponsable?: string;
  rgpdNif?: string;
  rgpdDireccion?: string;
  rgpdEmail?: string;
  rgpdDpd?: string;
  // Visual
  customLogoUrl?: string;
  theme?: 'navy-gold' | 'emerald-warm' | 'cyan-steel' | 'minimal-light' | 'minimalista' | 'flat' | 'material' | 'esqueumorfica' | 'retro' | 'brutalista' | 'neumorfismo' | 'glassmorphism' | 'dark-mode' | 'cyberpunk' | 'organica' | 'editorial' | 'abstracta' | 'geometrica' | '3d';
  // Hero contact
  contactPhone?: string;
  contactEmail?: string;
  contactWhatsappMsg?: string;
  // Hero texts
  heroSubtitle?: string;
  heroDescription?: string;
  // Form
  formRecipientEmail?: string;
  formRecipientName?: string;
  formBccEmail?: string;
  // Dynamic tools (replaces the 4 hardcoded buttons)
  customTools?: ToolCard[];
  // Dynamic services dropdown
  customServices?: string[];
  // Dynamic service cards
  serviceCards?: ServiceCard[];
  // Typography
  typography?: TypographyConfig;
  // SMTP configuration
  smtp?: {
    host: string;
    port: string;
    user: string;
    pass: string;
    to: string;
    bcc: string;
  };
  // Access credentials
  credentials?: {
    clientUser: string;
    clientPass: string;
    adminUser: string;
    adminPass: string;
    recoveryEmail: string; // email to which recovery notifications are sent
  };
}

export type ServiceType =
  | 'tasacion'
  | 'geotecnia'
  | 'topografia'
  | 'nota_simple'
  | 'certificado_energetico';

export interface CalculationResult {
  baseFee: number;
  travelExpenses: number;
  tax: number;
  total: number;
  details: string[];
}

export interface RouteCalculation {
  distanceKm: number;
  fuelRate: number;
  dietRate: number;
  totalDays: number;
  totalCost: number;
}
