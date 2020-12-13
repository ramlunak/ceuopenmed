import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { OrderModule } from 'ngx-order-pipe'; // <- import OrderModule

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
import { TipoEntidadComponent } from './componentes/Administracion/tipo-entidad/tipo-entidad.component';
import { IdiomaComponent } from './componentes/Administracion/idioma/idioma.component';
// tslint:disable-next-line: max-line-length
import { DocProfesorEspecialidadesComponent } from './componentes/Docencia/doc-profesor-especialidades/doc-profesor-especialidades.component';
import { ExchangeStatusPipe } from './utils/pipes/exchange-status.pipe';
import { EntidadComponent } from './componentes/Entity/entidad/entidad.component';
import { FormEntidadComponent } from './componentes/Entity/form-entidad/form-entidad.component';
import { DialogChangePasswordComponent } from './componentes/Seguridad/dialog-change-password/dialog-change-password.component';
import { TipoAsociacionComponent } from './componentes/Administracion/tipo-asociacion/tipo-asociacion.component';
import { TipoAsociacionMultipleComponent } from './componentes/Administracion/tipo-asociacion-multiple/tipo-asociacion-multiple.component';
import { AsociacionComponent } from './componentes/Entity/asociacion/asociacion.component';
import { EntidadRecursoComponent } from './componentes/Entity/entidad-recurso/entidad-recurso.component';
import { ExchangeBooleanPipe } from './utils/pipes/exchange-boolean.pipe';
import { AdditionalInfoComponent } from './componentes/Entity/additional-info/additional-info.component';
import { EntidadesEvaluadasComponent } from './componentes/entidades-evaluadas/entidades-evaluadas.component';
import { EntidadRecursoDescripcionComponent } from './componentes/Entity/entidad-recurso-descripcion/entidad-recurso-descripcion.component';
import { AsociacionesOpcionalesComponent } from './componentes/Entity/asociaciones-opcionales/asociaciones-opcionales.component';
import { ListaAsociacionesComponent } from './componentes/Entity/lista-asociaciones/lista-asociaciones.component';
import { AsociacionListComponent } from './componentes/Entity/asociacion-list/asociacion-list.component';
import { VisorTipoAsociacionComponent } from './componentes/visor/visor-tipo-asociacion/visor-tipo-asociacion.component';
import { PaginaInicioComponent } from './componentes/pagina-inicio/pagina-inicio.component';
import { VisorEntidadComponent } from './componentes/visor/visor-entidad/visor-entidad.component';
import { VisorEntidadDetalleComponent } from './componentes/visor/visor-entidad-detalle/visor-entidad-detalle.component';
import { VisorEntidadDescripcionComponent } from './componentes/visor/visor-entidad-descripcion/visor-entidad-descripcion.component';
import { VisorEntidadRecursosComponent } from './componentes/visor/visor-entidad-recursos/visor-entidad-recursos.component';
import { VisorEntidadAsociacionesComponent } from './componentes/visor/visor-entidad-asociaciones/visor-entidad-asociaciones.component';
import { VisorAsociacionesMultiplesComponent } from './componentes/visor/visor-asociaciones-multiples/visor-asociaciones-multiples.component';
import { RefreshComponent } from './componentes/visor/refresh/refresh.component';
import { AdmTraduccionComponent } from './componentes/Administracion/adm-traduccion/adm-traduccion.component';
import { SobreCOpendMedComponent } from './componentes/sobre-copend-med/sobre-copend-med.component';
import { EstadisticasUsuariosComponent } from './componentes/Estadisticas/usuarios/usuarios.component';
import { EstadisticasEntidadesComponent } from './componentes/Estadisticas/estadisticas-entidades/estadisticas-entidades.component';
import { GrafoComponent } from './componentes/visor/grafo/grafo.component';
import { TiposEntidadComponent } from './componentes/reportes/tipos-entidad/tipos-entidad.component';
import { TiposRelacionesComponent } from './componentes/reportes/tipos-relaciones/tipos-relaciones.component';
import { IdiomasComponent } from './componentes/reportes/idiomas/idiomas.component';
import { RelacionesComponent } from './componentes/reportes/relaciones/relaciones.component';
import { DetalleComponent } from './componentes/reportes/detalle/detalle.component';
import { RecursosComponent } from './componentes/reportes/recursos/recursos.component';
import { RentidadesComponent } from './componentes/reportes/rentidades/rentidades.component';
import { EntidadDescripcionComponent } from './componentes/Entity/entidad-descripcion/entidad-descripcion.component'


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
    FormEntidadComponent,
    DialogChangePasswordComponent,
    TipoAsociacionComponent,
    AsociacionComponent,
    EntidadRecursoComponent,
    ExchangeBooleanPipe,
    AdditionalInfoComponent,
    EntidadesEvaluadasComponent,
    EntidadRecursoDescripcionComponent,
    AsociacionesOpcionalesComponent,
    TipoAsociacionMultipleComponent,
    ListaAsociacionesComponent,
    AsociacionListComponent,
    VisorTipoAsociacionComponent,
    PaginaInicioComponent,
    VisorEntidadComponent,
    VisorEntidadDetalleComponent,
    VisorEntidadDescripcionComponent,
    VisorEntidadRecursosComponent,
    VisorEntidadAsociacionesComponent,
    VisorAsociacionesMultiplesComponent,
    RefreshComponent,
    AdmTraduccionComponent,
    SobreCOpendMedComponent,
    EstadisticasUsuariosComponent,
    EstadisticasEntidadesComponent,
    GrafoComponent,
    TiposEntidadComponent,
    TiposRelacionesComponent,
    IdiomasComponent,
    RelacionesComponent,
    DetalleComponent,
    RecursosComponent,
    RentidadesComponent,
    EntidadDescripcionComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutesModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    OrderModule // <- import OrderModule
  ],
  providers: [
    AppServicesModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
