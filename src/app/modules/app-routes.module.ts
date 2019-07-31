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
import { AdmPersonaComponent } from '../componentes/Administracion/adm-persona/adm-persona.component';
import { DocEspecialidadComponent } from '../componentes/Docencia/doc-especialidad/doc-especialidad.component';
import { DocGrupoComponent } from '../componentes/Docencia/doc-grupo/doc-grupo.component';
import { DocEstudianteComponent } from '../componentes/Docencia/doc-estudiante/doc-estudiante.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthVerifyService] },
  { path: 'login', component: LoginComponent },
  { path: 'segRol', component: SegRolComponent, canActivate: [AuthVerifyService] },
  { path: 'admPersona', component: AdmPersonaComponent, canActivate: [AuthVerifyService] },
  { path: 'docEspecialidad', component: DocEspecialidadComponent, canActivate: [AuthVerifyService] },
  { path: 'docGrupo', component: DocGrupoComponent, canActivate: [AuthVerifyService] },
  { path: 'docEstudiante', component: DocEstudianteComponent, canActivate: [AuthVerifyService] },
  { path: '404', component: NotFoundComponent},
  { path: '500', component: ServerErrorComponent },

  // declarar los path arriba de esto
  { path: '', redirectTo: '/', pathMatch: 'full' }, // home page
  { path: '**', redirectTo: '/404', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutesModule { }
