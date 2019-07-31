
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
import { AdmPersonaComponent } from './componentes/Administracion/adm-persona/adm-persona.component';
import { DocEspecialidadComponent } from './componentes/Docencia/doc-especialidad/doc-especialidad.component';
import { DocGrupoComponent } from './componentes/Docencia/doc-grupo/doc-grupo.component';
import { DocEstudianteComponent } from './componentes/Docencia/doc-estudiante/doc-estudiante.component';

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
    AdmPersonaComponent,
    DocEspecialidadComponent,
    DocGrupoComponent,
    DocEstudianteComponent
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
