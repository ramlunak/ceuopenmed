export interface Asociacion {
  IdAsociacion: number,
  IdEntidad1: number,
  IdEntidad2: number,
  IdTipoAsociacion: number,
  TipoAsociacion: string,
  IdEstudiante: number,
  IdProfesor: number,
  IdEntidad: number,
  Entidad: string,
  IdTipoEntidad: number,
  TipoEntidad: string,
  Evaluacion: string,
  Estado: string,
  Comentario: string,
  Descripcion: string,
  Nivel: number,
}

export interface AsociacionReport {
  IdAsociacion: number,
  IdEntidad1: number,
  IdEntidad2: number,
  IdTipoAsociacion: number,
  TipoAsociacion: string,
  Descripcion: string,
  Nivel: number,
}
