export interface DinardapSearchParams {
  cedula?: string;
  nombres?: string;
  apellidos?: string;
}

export interface DinardapResult {
  id: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento?: string;
  direccion?: string;
  estadoCivil?: string;
  [key: string]: any;
}

export interface DinardapResponse {
  data: DinardapResult[];
  total: number;
  message?: string;
}

// Tipos para Consulta Ciudadano
export interface CitizenInfo {
  cedula: string;
  nombre?: string;
  apellido?: string;
  fechaNacimiento?: string;
  direccion?: string;
  estado?: string;
  [key: string]: any;
}

export interface ConsultaCiudadanoResponse {
  success: boolean;
  message: string;
  data?: CitizenInfo;
}

// Tipos para Validación de Identidad
export interface ValidacionIdentidadData {
  cedula: string;
  valida: boolean;
  motivo?: string;
  nombre?: string;
  estado?: string;
  fechaValidacion?: string;
}

export interface ValidacionIdentidadResponse {
  success: boolean;
  message: string;
  data: ValidacionIdentidadData;
}

// Tipos para Auditoría
export interface AuditLog {
  _id?: string;
  usuario: string;
  cedula: string;
  endpoint: string;
  metodo: string;
  ipOrigen: string;
  exitoso: boolean;
  fechaHora: string;
  metadata?: Record<string, any>;
}

export interface AuditoriaFilters {
  fechaInicio?: string;
  fechaFin?: string;
  cedula?: string;
  usuario?: string;
  page?: number;
  limit?: number;
}

export interface AuditoriaPagination {
  paginaActual: number;
  totalPaginas: number;
  totalRegistros: number;
  registrosPorPagina: number;
}

export interface AuditoriaResponse {
  success: boolean;
  message: string;
  data: {
    registros: AuditLog[];
    paginacion: AuditoriaPagination;
  };
}
