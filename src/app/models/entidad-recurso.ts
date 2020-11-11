export interface EntidadRecurso {
  IdRecurso: number;
  IdEntidad: number;
  Nivel: number;
  URL: string;
  IsImage: boolean;
  // Extra Field
  Idioma: string;
  IdIdioma: number;
  Descripcion: string;
  Buscar: string;
}

export interface EntidadRecursoReporte {
  IdRecurso: number;
  Nivel: number;
  IdEntidad: number;
  URL: string;
}
