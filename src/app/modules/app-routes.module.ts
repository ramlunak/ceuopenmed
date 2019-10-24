import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Para verificar Acceso
import { AuthVerifyService } from '../services/seguridad/auth-verify.service';

import { HomeComponent } from '../componentes/home/home.component';
import { LoginComponent } from '../componentes/Seguridad/login/login.component';
import { NotFoundComponent } from '../componentes/errorPages/not-found/not-found.component';
import { ServerErrorComponent } from '../componentes/errorPages/server-error/server-error.component';
import { SegRolComponent } from '../componentes/Seguridad/seg-rol/seg-rol.component';
import { DocEspecialidadComponent } from '../componentes/Docencia/doc-especialidad/doc-especialidad.component';
import { DocGrupoComponent } from '../componentes/Docencia/doc-grupo/doc-grupo.component';
import { DocEstudianteComponent } from '../componentes/Docencia/doc-estudiante/doc-estudiante.component';
import { DocProfesorComponent } from '../componentes/Docencia/doc-profesor/doc-profesor.component';
import { DocProfesorGruposComponent } from '../componentes/Docencia/doc-profesor-grupos/doc-profesor-grupos.component';
import { TipoEntidadComponent } from '../componentes/Administracion/tipo-entidad/tipo-entidad.component';
import { IdiomaComponent } from '../componentes/Administracion/idioma/idioma.component';
import { EntidadComponent } from '../componentes/Entity/entidad/entidad.component';
import { FormEntidadComponent } from '../componentes/Entity/form-entidad/form-entidad.component';
import { TipoAsociacionComponent } from '../componentes/Administracion/tipo-asociacion/tipo-asociacion.component';
import { TipoAsociacionMultipleComponent } from '../componentes/Administracion/tipo-asociacion-multiple/tipo-asociacion-multiple.component';
import { AsociacionComponent } from '../componentes/Entity/asociacion/asociacion.component';
// tslint:disable-next-line: max-line-length
import { DocProfesorEspecialidadesComponent } from '../componentes/Docencia/doc-profesor-especialidades/doc-profesor-especialidades.component';
import { DialogChangePasswordComponent } from '../componentes/Seguridad/dialog-change-password/dialog-change-password.component';
import { EntidadRecursoComponent } from '../componentes/Entity/entidad-recurso/entidad-recurso.component';
import { AdditionalInfoComponent } from '../componentes/Entity/additional-info/additional-info.component';
import { EntidadesEvaluadasComponent } from '../componentes/entidades-evaluadas/entidades-evaluadas.component';
// tslint:disable-next-line: max-line-length
import { EntidadRecursoDescripcionComponent } from '../componentes/Entity/entidad-recurso-descripcion/entidad-recurso-descripcion.component';
import { AsociacionesOpcionalesComponent } from '../componentes/Entity/asociaciones-opcionales/asociaciones-opcionales.component';


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthVerifyService] },
  { path: 'login', component: LoginComponent },
  { path: 'segRol', component: SegRolComponent, canActivate: [AuthVerifyService] },
  { path: 'docEspecialidad', component: DocEspecialidadComponent, canActivate: [AuthVerifyService] },
  { path: 'docGrupo', component: DocGrupoComponent, canActivate: [AuthVerifyService] },
  { path: 'docEstudiante', component: DocEstudianteComponent, canActivate: [AuthVerifyService] },
  { path: 'docProfesor', component: DocProfesorComponent, canActivate: [AuthVerifyService] },
  { path: 'docProfesorGrupos/:id', component: DocProfesorGruposComponent, canActivate: [AuthVerifyService] },
  { path: 'docProfesorEspecialidades/:id', component: DocProfesorEspecialidadesComponent, canActivate: [AuthVerifyService] },
  { path: 'tipoEntidad', component: TipoEntidadComponent, canActivate: [AuthVerifyService] },
  { path: 'entidad', component: EntidadComponent, canActivate: [AuthVerifyService] },
  { path: 'EntidadRecurso/:idEntidad/:idTipoEntidad', component: EntidadRecursoComponent, canActivate: [AuthVerifyService] },
  { path: 'EntidadRecursoDescripcion', component: EntidadRecursoDescripcionComponent, canActivate: [AuthVerifyService] },
  { path: 'idioma', component: IdiomaComponent, canActivate: [AuthVerifyService] },
  { path: 'FormEntidad/:idEntidad/:idTipoEntidad', component: FormEntidadComponent, canActivate: [AuthVerifyService] },
  { path: 'TipoAsociacion', component: TipoAsociacionComponent, canActivate: [AuthVerifyService] },
  { path: 'TipoAsociacionMultiple', component: TipoAsociacionMultipleComponent, canActivate: [AuthVerifyService] },
  { path: 'EntidadesEvaluadas', component: EntidadesEvaluadasComponent, canActivate: [AuthVerifyService] },
  { path: 'Asociacion', component: AsociacionComponent, canActivate: [AuthVerifyService] },
  { path: 'AsociacionesOpcionales/:idAsociacion/:Asociacion/:idEntidad1/:idEntidad2', component: AsociacionesOpcionalesComponent, canActivate: [AuthVerifyService] },
  // tslint:disable-next-line: max-line-length
  { path: 'additionalInfo/:idEntidad/:idTipoEntidad/:EvaluacionEntidad', component: AdditionalInfoComponent, canActivate: [AuthVerifyService] },
  { path: 'DialogChangePassword', component: DialogChangePasswordComponent, canActivate: [AuthVerifyService] },
  { path: '404', component: NotFoundComponent },
  { path: '500', component: ServerErrorComponent },
  // declarar los path arriba de esto
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // home page
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes,{useHash:true})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutesModule { }
