import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

// Servicios de Utileria
import { AppConstantsService } from '../utils/app-constants.service';

// Servicios de Componentes
import { AuthService } from '../services/seguridad/auth.service';
import { AuthVerifyService } from '../services/seguridad/auth-verify.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { SegUsuarioService } from '../services/seguridad/seg-usuario.service';
import { SegRolService } from '../services/seguridad/seg-rol.service';
import { AdmPersonaService } from '../services/administracion/adm-persona.service';
import { DocEspecialidadService } from '../services/docencia/doc-especialidad.service';
import { DocGrupoService } from '../services/docencia/doc-grupo.service';
import { DocEstudianteService } from '../services/docencia/doc-estudiante.service';
import { ValidationsService } from '../services/validations.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AppConstantsService,
    MatSnackBar,
    AuthService,
    AuthVerifyService,
    ErrorHandlerService,
    SegUsuarioService,
    SegRolService,
    AdmPersonaService,
    DocEspecialidadService,
    DocGrupoService,
    DocEstudianteService,
    ValidationsService
  ]
})
export class AppServicesModule { }
