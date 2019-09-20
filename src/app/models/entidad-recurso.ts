export interface EntidadRecurso {
    IdRecurso: number;
    IdIdioma: number;
    IdEntidad: number;
    Nivel: number;
    URL: string;
    IsImage: boolean;
    Descripcion?: string;
    // Extra Field
    Idioma: string;
}
