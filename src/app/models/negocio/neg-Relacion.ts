export interface NegRelacion {
    Id: number;
        
    IdTipoEntidad:number;
    TipoEntidad: string;
    IdEntidad:number;
    Entidad:string;

    IdTipoEntidadRelacion:number;
    TipoEntidadRelacion: string;
    IdEntidadRelacion:number;
    EntidadRelacion:string;

    IdTipoRelacion:number;
    TipoRelacion:string;

    IdEstudiante:number;
    Estudiante: string;
    IdProfesor:number;
    Profesor: string;
    IdIdioma:number;
    Idioma: string;
   

    Evaluacion: number;
    Estado: boolean;
    Comentario: string;
}
