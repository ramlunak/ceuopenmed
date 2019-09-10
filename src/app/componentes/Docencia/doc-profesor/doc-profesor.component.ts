import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DocProfesorService } from '../../../services/docencia/doc-profesor.service';
import { DocProfesor } from 'src/app/models/Docencia/doc-profesor';
import { AdmPersonaService } from '../../../services/administracion/adm-persona.service';
import { AdmPersona } from 'src/app/models/Administracion/adm-persona';
import { SegUsuarioService } from 'src/app/services/seguridad/seg-usuario.service';
import { AppConstantsService } from 'src/app/utils/app-constants.service';
import { ValidationsService } from 'src/app/services/validations.service';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

// Selector jQuery
declare var $: any;

@Component({
  selector: 'app-doc-profesor',
  templateUrl: './doc-profesor.component.html',
  styleUrls: ['./doc-profesor.component.css']
})
export class DocProfesorComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo Profesor';
  dialogUserName: string;

  // DataTable --
  dataSource: MatTableDataSource<DocProfesor>;
  displayedColumns = ['IdProfesor', 'NombreCompleto', 'username', 'status', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // Selects
  listStatus: object;

  constructor(
    private profesorService: DocProfesorService,
    private personaService: AdmPersonaService,
    private usuarioService: SegUsuarioService,
    private errorService: ErrorHandlerService,
    private router: Router,
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
    this.profesorService.getProfesores().subscribe(result => {
      this.dataSource = new MatTableDataSource<DocProfesor>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  CargarSelects() {
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
            IdRol: roles.Profesor,
            IdPersona: persona.IdPersona
          });


          this.usuarioService.setUsuario().subscribe(result2 => {

            if (result2.status === 1) {

              const formDataEstudiante = this.profesorService.form.value;
              this.profesorService.form.patchValue({
                IdProfesor: formDataEstudiante.IdProfesor,
                IdPersona: persona.IdPersona
              });
              this.profesorService.setProfesor().subscribe(result3 => {

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

          this.profesorService.updateProfesor()
            .subscribe(result2 => {

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
    const formData = this.profesorService.form.value;
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
    const profesor = this.dataSource.data[this.ROW_NUMBER];

    this.personaService.viewPersona(profesor.IdPersona).subscribe(result => {

      if (result.status === 1) {
        this.personaService.form.patchValue(result.data);
      } else {
        this.errorService.handleError(result.error);
      }

    }, (error) => {
      this.errorService.handleError(error);
    });

    this.profesorService.form.patchValue({
      IdProfesor: profesor.IdProfesor,
      IdPersona: profesor.IdPersona
    });
    this.dialogTittle = 'Modificar Profesor';
  }

  Limpiar() {
    this.personaService.form.reset();
    this.personaService.InicializarValoresFormGroup();
    this.profesorService.form.reset();
    this.profesorService.InicializarValoresFormGroup();
    this.usuarioService.form.reset();
    this.usuarioService.InicializarValoresFormGroup();
    if (!this.transaccionIsNew) {
      this.transaccionIsNew = true;
      this.dialogTittle = 'Nuevo Profesor';
      $('#OperationModalDialog').modal('hide');
    }
  }

  public redirectToEspecialidades = () => {
    const profesor = this.dataSource.data[this.ROW_NUMBER];
    const url = `docProfesorEspecialidades/${profesor.IdProfesor}`;
    this.router.navigate([url]);
  }

  public redirectToGroups = () => {
    const profesor = this.dataSource.data[this.ROW_NUMBER];
    const url = `docProfesorGrupos/${profesor.IdProfesor}`;
    this.router.navigate([url]);
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
