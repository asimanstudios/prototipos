export type UserRole = 'Director' | 'Ejecutivo' | 'Senior' | 'Elite' | 'Miembro';

export type ModAPrueba = {
  id: string;
  nombre: string;
  entrenos: number | null;
  entrenosPropios: number | null;
  trys: number | null;
  rolesPJ: number | null;
  rolEspontaneo: number | null;
  misiones: number | null;
  inactividad: 'Justificada' | 'No justificada' | 'Reducción' | null;
  resumen: 'Va mal' | 'Va regular' | 'Nuevo' | 'Va bien' | 'Reducción' | null;
  servidor: 'ESP' | 'ARG';
  esSgtPlus: boolean;
};

export type Suggestion = {
    modId: string;
    modName: string;
    reason: string;
};

export type ModAPruebaGroup = {
  id: string;
  nombre: string;
  revisadoPor: string;
  modsElites: string;
  senior: string;
  directores: string;
  periodo: string;
  hora: string;
  mods: ModAPrueba[];
  promotions: Suggestion[];
  warnings: Suggestion[];
};

export type ModPlus = {
  id: string;
  nombre: string;
  rangoPlus: 'Elite' | 'Senior' | 'Miembro' | null;
  entrenos: number | null;
  entrenosPropios: number | null;
  trys: number | null;
  rolesPJ: number | null;
  rolEspontaneo: number | null;
  misiones: number | null;
  supervisiones: number | null;
  inactividad: 'Justificada' | 'No justificada' | 'Reducción' | null;
  resumen: 'Va mal' | 'Va regular' | 'Nuevo' | 'Va bien' | 'Reducción' | null;
  servidor: 'ESP' | 'ARG';
  esSgtPlus: boolean;
  abandona: boolean;
};

export type ModPlusGroup = {
  id: string;
  nombre: string;
  revisadoPor: string;
  modsElites: string;
  senior: string;
  directores: string;
  periodo: string;
  hora: string;
  mods: ModPlus[];
  promotions: Suggestion[];
  warnings: Suggestion[];
};

export type EventMaster = {
  id: string;
  staff: string;
  region: 'ARG' | 'ESP';
  miniroles: number | null;
  eventosSV1: number | null;
  misionesSV2: number | null;
  ayudasSV1_SV2: number | null;
  inactividad: 'Justificada' | 'Injustificada' | null;
  advSanciones: number | null;
  tipoAdvSancion: string | null;
  requisitos: 'Completo' | 'Incompleto por poco' | 'Incompleto' | null;
  notas: string | null;
  ultimatum: string | null;
};

export type EventMasterGroup = {
  id: string;
  mes: string;
  fechaRealizacion: string;
  elitesACargo: string;
  totalEMs: number;
  oficiales: EventMaster[];
  aPrueba: EventMaster[];
};

export type FactionKey = 'REPUBLICANO' | 'SEPARATISTA' | 'ALIADO' | 'NEUTRAL' | 'CONTRABANDISTAS' | 'MANDALORE' | 'DISPUTA';

export type Planet = {
    x: number;
    y: number;
    faction: FactionKey;
    nativePopulation?: string;
    lore?: string;
    postMissionReports?: string;
};

export type RouteColor = '#9370DB' | '#00FFFF' | '#FF69B4' | '#FFFF00' | '#FF4500' | 'white';

export type Route = {
    from: string;
    to: string;
    color: RouteColor;
    dashed: boolean;
};
