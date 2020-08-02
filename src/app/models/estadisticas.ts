export interface EstadistiasUsuarios {
  IdEstudiante: number;
  asociaciones: number;
  entidades: number;
  suma: number;
  usuario: string;
}

export interface EntidadesMenosAsociadas {
  IdEntidad: number;
  entidad: string;
  asociaciones: number;
}

