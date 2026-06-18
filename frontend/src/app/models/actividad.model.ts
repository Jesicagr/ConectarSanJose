export enum DiaSemana {
  LUNES = 'LUNES',
  MARTES = 'MARTES',
  MIERCOLES = 'MIERCOLES',
  JUEVES = 'JUEVES',
  VIERNES = 'VIERNES',
  SABADO = 'SABADO',
  DOMINGO = 'DOMINGO'
}

export interface HorarioSede {
  id?: number;
  diaDesde: DiaSemana;
  diaHasta: DiaSemana;
  horaInicio: string; // Viaja como "HH:mm:ss"
  horaFin: string;
}

export interface Sede {
  id?: number;
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  icono: string;
  esWhatsapp: boolean;
  latitud?: number;
  longitud?: number;
  horarios?: HorarioSede[];
}

export interface Area {
  id?: number;
  nombre: string;
  icono: string;
  descripcion?: string;
  telefono?: string;
  esWhatsapp?: boolean;
  telefonoEtiqueta?: string;
  referente?: string;
  direccion?: string;
  email?: string;
  redes?: string;
  sitioWeb?: string;
  horarioAtencion?: string;
  telefonos?: TelefonoContacto[];
}

export interface TelefonoContacto {
  numero: string;
  esWhatsapp?: boolean;
  etiqueta?: string;
}

export interface HorarioActividad {
  id?: number;
  diaSemana: DiaSemana;
  horaInicio: string; // Viaja como "HH:mm:ss"
  horaFin: string;
}

export interface Actividad {
  id?: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string; // Formato "YYYY-MM-DD"
  fechaFin: string;
  repetirTodoAnio: boolean;
  sede: Sede;
  descripcion_corta?: string; // Fiel al @Column de Java
  dia?: string;
  encargado?: string;
  horario?: string;
  telefono?: string;
  areas?: Area[];
  horarios?: HorarioActividad[];
}