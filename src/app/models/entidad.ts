export interface Entidad {
  IdEntidad: number;
  IdTipoEntidad: number;
  TipoEntidad: string;
  IdIdioma: number;
  Idioma: string;
  IdEstudiante: number;
  IdProfesor: string;
  Evaluacion: string;
  Estado: string;
  Comentario: string;
  Entidad: string;
}

export interface EntidadReporte {
  IdEntidad: number;
  Entidad: string;
  IdTipoEntidad: number;
  TipoEntidad: string;
  Idioma: string;
  Comentario: string;
}
