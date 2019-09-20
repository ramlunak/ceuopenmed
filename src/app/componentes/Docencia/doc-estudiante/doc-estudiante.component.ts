import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DocEstudianteService } from '../../../services/docencia/doc-estudiante.service';
import { DocEstudiante } from 'src/app/models/Docencia/doc-estudiante';
import { AdmPersonaService } from '../../../services/administracion/adm-persona.service';
import { AdmPersona } from 'src/app/models/Administracion/adm-persona';
import { DocGrupoService } from '../../../services/docencia/doc-grupo.service';
import { DocGrupo } from 'src/app/models/Docencia/doc-grupo';
import { SegUsuarioService } from '../../../services/seguridad/seg-usuario.service';
import { AppConstantsService } from 'src/app/utils/app-constants.service';
import { ValidationsService } from 'src/app/services/validations.service';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

// Selector jQuery
declare var $: any;

@Component({
  selector: 'app-doc-estudiante',
  templateUrl: './doc-estudiante.component.html',
  styleUrls: ['./doc-estudiante.component.css']
})
export class DocEstudianteComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo Estudiante';
  dialogUserName: string;

  // DataTable --
  dataSource: MatTableDataSource<DocEstudiante>;
  displayedColumns = ['IdEstudiante', 'NombreCompleto', 'Grupo', 'username', 'status', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // Selects
  listPersonas: AdmPersona[];
  listGrupos: DocGrupo[];
  listStatus: object;

  constructor(
    private estudianteService: DocEstudianteService,
    private personaService: AdmPersonaService,
    private usuarioService: SegUsuarioService,
    private grupoService: DocGrupoService,
    private errorService: ErrorHandlerService,
    private CONSTANS: AppConstantsService,
    private validationsService: ValidationsService
  ) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';
    this.CargarDgvElements();
    this.CargarSelects();
  }

  CargarDgvElements() {
    this.estudianteService.getEstudiantes().subscribe(result => {
      this.dataSource = new MatTableDataSource<DocEstudiante>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  CargarSelects() {
    this.personaService.getPersonas().subscribe(result => {
      this.listPersonas = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });

    this.grupoService.getGrupos().subscribe(result => {
      this.listGrupos = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });
    this.listStatus = [{ type: 'Activo', value: 10 }, { type: 'Inactivo', value: 0 }];
  }

  applyFilter(filterValue: string) {
    console.log(filterValue.trim().toLowerCase());
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  guardarClick() {

    if (this.transaccionIsNew) {
      this.personaService.setPersona().subscribe(result => {

        if (result.status === 1) {

          const persona: AdmPersona = result.data;
          const roles = this.CONSTANS.getRoles();
          const formDataUsuario = this.usuarioService.form.value;
          this.usuarioService.form.patchValue({
            username: formDataUsuario.username,
            email: formDataUsuario.email,
            password: formDataUsuario.password,
            passwordconf: formDataUsuario.passwordconf,
            IdRol: roles.Estudiante,
            IdPersona: persona.IdPersona
          });

          this.usuarioService.setUsuario().subscribe(result2 => {

            if (result2.status === 1) {
              const formDataEstudiante = this.estudianteService.form.value;
              this.estudianteService.form.patchValue({
                IdEstudiante: formDataEstudiante.IdEstudiante,
                IdPersona: persona.IdPersona,
                IdGrupo: formDataEstudiante.IdGrupo
              });
              this.estudianteService.setEstudiante().subscribe(result3 => {

                if (result3.status === 1) {
                  this.CargarDgvElements();
                } else {
                  this.errorService.handleError(result3.error);
                }

              }, (error) => {
                this.errorService.handleError(error);
              });

            } else {
              this.errorService.handleError(result2.error);
            }
            this.Limpiar();
          }, (error) => {
            this.errorService.handleError(error);
          });

        } else {
          this.errorService.handleError(result.error);
        }

      }, (error) => {
        this.errorService.handleError(error);
      });
    } else {

      this.personaService.updatePersona().subscribe(result => {

        if (result.status === 1) {

          this.estudianteService.updateEstudiante().subscribe(result2 => {

            if (result2.status === 1) {
              this.CargarDgvElements();
            } else {
              this.errorService.handleError(result2.error);
            }

          }, (error) => {
            this.errorService.handleError(error);
          });
        } else {
          this.errorService.handleError(result.error);
        }
        this.Limpiar();
      }, (error) => {
        this.errorService.handleError(error);

      });
    }
  }

  eliminarClick() {
    const formData = this.estudianteService.form.value;
    this.personaService.deletePersona(formData.IdPersona).subscribe(result => {

      if (result.status === 1) {
        this.CargarDgvElements();
      } else {
        this.errorService.handleError(result.error);
      }
      this.Limpiar();
    }, (error) => {
      this.errorService.handleError(error);
    });

  }


  setOperationsData() {
    this.transaccionIsNew = false;
    const estudiante = this.dataSource.data[this.ROW_NUMBER];

    this.personaService.viewPersona(estudiante.IdPersona).subscribe(result => {

      if (result.status === 1) {
        this.personaService.form.patchValue(result.data);
      } else {
        this.errorService.handleError(result.error);
      }

    }, (error) => {
      this.errorService.handleError(error);
    });

    this.estudianteService.form.patchValue({
      IdEstudiante: estudiante.IdEstudiante,
      IdPersona: estudiante.IdPersona,
      IdGrupo: estudiante.IdGrupo
    });
    this.dialogTittle = 'Modificar Estudiante';
  }

  Limpiar() {

    this.personaService.form.reset();
    this.personaService.InicializarValoresFormGroup();
    this.estudianteService.form.reset();
    this.estudianteService.InicializarValoresFormGroup();
    this.usuarioService.form.reset();
    this.usuarioService.InicializarValoresFormGroup();
    if (!this.transaccionIsNew) {
      this.transaccionIsNew = true;
      this.dialogTittle = 'Nuevo Estudiante';
      $('#OperationModalDialog').modal('hide');
    }
  }

  upateUsuarioClick() {
    this.usuarioService.updateUsuario().subscribe(result => {

      if (result.status === 1) {
        this.CargarDgvElements();
      } else {
        this.errorService.handleError(result.error);
      }
      this.LimpiarUsuario();
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  setOperationDataUsuario() {
    const estudiante = this.dataSource.data[this.ROW_NUMBER];

    this.usuarioService.viewUsuario(estudiante.id).subscribe(result => {

      if (result.status === 1) {
        this.usuarioService.formUpdate.patchValue(result.data);
        this.dialogUserName = result.data.username;
      } else {
        this.errorService.handleError(result.error);
      }

    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  LimpiarUsuario() {
    this.usuarioService.formUpdate.reset();
    this.usuarioService.InicializarValoresFormUpdateGroup();
    this.usuarioService.formChangePass.reset();
    this.usuarioService.InicializarValoresFormChangePassGroup();
    $('#UsuarioModalDialog').modal('hide');
  }

}
