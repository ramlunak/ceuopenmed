import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DocProfesorService } from '../../../services/docencia/doc-profesor.service';
import { DocProfesor } from 'src/app/models/Docencia/doc-profesor';
import { AdmPersonaService } from '../../../services/administracion/adm-persona.service';
import { AdmPersona } from 'src/app/models/Administracion/adm-persona';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

@Component({
  selector: 'app-doc-profesor',
  templateUrl: './doc-profesor.component.html',
  styleUrls: ['./doc-profesor.component.css']
})
export class DocProfesorComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo Profesor';

  // DataTable --
  dataSource: MatTableDataSource<DocProfesor>;
  displayedColumns = ['IdProfesor', 'NombreCompleto', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private profesorService: DocProfesorService,
              private personaService: AdmPersonaService,
              private errorService: ErrorHandlerService,
              private router: Router) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';
    this.CargarDgvElements();

  }

  CargarDgvElements() {
    this.profesorService.getProfesores().subscribe(result => {
      this.dataSource = new MatTableDataSource<DocProfesor>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
    });
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
          const formDataEstudiante = this.profesorService.form.value;
          this.profesorService.form.patchValue({
            IdEstudiante: formDataEstudiante.IdEstudiante,
            IdPersona: persona.IdPersona,
            IdGrupo: formDataEstudiante.IdGrupo
          });

          this.profesorService.setProfesor().subscribe(result2 => {

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

    }, (error) => {
      this.errorService.handleError(error);
    });
    this.Limpiar();
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
    this.transaccionIsNew = true;
    this.personaService.form.reset();
    this.personaService.InicializarValoresFormGroup();
    this.profesorService.form.reset();
    this.profesorService.InicializarValoresFormGroup();
    this.dialogTittle = 'Nuevo Profesor';
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

}
