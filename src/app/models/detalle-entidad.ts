export interface DetalleEntidad {
  IdRecurso: number;
  IdIdioma: number;
  IdEntidad: number;
  Entidad: string;
  TipoEntidad: string;
  IdTipoEntidad: number;
  Nivel: number;
  // Extra Field
  Idioma: string;
  Referencia: string;
  IsImage: number;
  EntidadFilter: string;
}

export interface DetalleEntidadReporte {
  IdRecurso: number;
  IdIdioma: number;
  Idioma: string;
  IdEntidad: number;
  Entidad: string;
  IdTipoEntidad: number;
  TipoEntidad: string;
  Nivel: number;
}

