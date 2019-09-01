import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// Módulo de importación de Bibliotecas de Angular Material
import { MaterialModule } from './modules/material.module';

// Módulo de Importacion de Componentes para Routing
import { AppRoutesModule } from './modules/app-routes.module';

// Módulo de Importacion de Servicios
import { AppServicesModule } from './modules/app-services.module';

// Componentes de la aplicación
import { AppComponent } from './app.component';
import { HomeComponent } from './componentes/home/home.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { NotFoundComponent } from './componentes/errorPages/not-found/not-found.component';
import { ServerErrorComponent } from './componentes/errorPages/server-error/server-error.component';
import { LoginComponent } from './componentes/Seguridad/login/login.component';
import { SegRolComponent } from './componentes/Seguridad/seg-rol/seg-rol.component';
import { DocEspecialidadComponent } from './componentes/Docencia/doc-especialidad/doc-especialidad.component';
import { DocGrupoComponent } from './componentes/Docencia/doc-grupo/doc-grupo.component';
import { DocEstudianteComponent } from './componentes/Docencia/doc-estudiante/doc-estudiante.component';
import { DocProfesorComponent } from './componentes/Docencia/doc-profesor/doc-profesor.component';
import { DocProfesorGruposComponent } from './componentes/Docencia/doc-profesor-grupos/doc-profesor-grupos.component';
import { TipoEntidadComponent } from './componentes/tipo-entidad/tipo-entidad.component';
import { IdiomaComponent } from './componentes/idioma/idioma.component';
// tslint:disable-next-line: max-line-length
import { DocProfesorEspecialidadesComponent } from './componentes/Docencia/doc-profesor-especialidades/doc-profesor-especialidades.component';
import { ExchangeStatusPipe } from './utils/pipes/exchange-status.pipe';
import { EntidadComponent } from './componentes/entidad/entidad.component';
import { FormEntidadComponent } from './componentes/form-entidad/form-entidad.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    NotFoundComponent,
    ServerErrorComponent,
    LoginComponent,
    HomeComponent,
    SegRolComponent,
    DocEspecialidadComponent,
    DocGrupoComponent,
    DocEstudianteComponent,
    DocProfesorComponent,
    DocProfesorGruposComponent,
    TipoEntidadComponent,
    IdiomaComponent,
    DocProfesorEspecialidadesComponent,
    ExchangeStatusPipe,
    EntidadComponent,
    FormEntidadComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutesModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AppServicesModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
