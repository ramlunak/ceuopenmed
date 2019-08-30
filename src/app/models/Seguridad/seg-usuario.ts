export interface SegUsuario {
    id: number;
    username: string;
    email?: string;
    status: number;
    created_at: number;
    updated_at: number;
    IdRol: number;
    IdPersona: number;
    // Extra Info
    Rol: string;
    NombreCompleto: string;
    IdEstudiante: number;
    IdProfesor: number;
}
