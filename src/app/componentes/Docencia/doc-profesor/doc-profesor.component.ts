import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DocProfesorService } from '../../../services/docencia/doc-profesor.service';
import { DocProfesor } from 'src/app/models/Docencia/doc-profesor';
import { AdmPersonaService } from '../../../services/administracion/adm-persona.service';
import { AdmPersona } from 'src/app/models/Administracion/adm-persona';
import { DocEspecialidadService } from '../../../services/docencia/doc-especialidad.service';
import { DocEspecialidad } from 'src/app/models/Docencia/doc-especialidad';

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
  displayedColumns = ['IdProfesor', 'NombreCompleto', 'Especialidad', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // Selects
  listPersonas: AdmPersona[];
  listEspecialidades: DocEspecialidad[];

  constructor(private profesorService: DocProfesorService,
              private personaService: AdmPersonaService,
              private especialidadService: DocEspecialidadService,
              private errorService: ErrorHandlerService) { }

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
    this.personaService.getPersonas().subscribe(result => {
      this.listPersonas = result.data;
    });

    this.especialidadService.getEspecialidades().subscribe(result => {
      this.listEspecialidades = result.data;
    });
  }

  applyFilter(filterValue: string) {
    console.log(filterValue.trim().toLowerCase());
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  guardarClick() {

    const formDataPersona = this.personaService.form.value;
    const formDataProfesor = this.profesorService.form.value;

    if (this.transaccionIsNew) {
      this.personaService.setPersona(
        formDataPersona.PrimerNombre,
        formDataPersona.SegundoNombre,
        formDataPersona.ApellidoPaterno,
        formDataPersona.ApellidoMaterno
      ).subscribe(result => {

        if (result.status === 1) {

          const persona: AdmPersona = result.data;

          this.profesorService.setProfesor(persona.IdPersona, formDataProfesor.IdEspecialidad).subscribe(result2 => {

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

      this.personaService.updatePersona(
        formDataPersona.IdPersona,
        formDataPersona.PrimerNombre,
        formDataPersona.SegundoNombre,
        formDataPersona.ApellidoPaterno,
        formDataPersona.ApellidoMaterno
      ).subscribe(result => {

        if (result.status === 1) {

          this.profesorService.updateProfesor(formDataProfesor.IdProfesor, formDataProfesor.IdPersona, formDataProfesor.IdEspecialidad)
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
    this.profesorService.deleteProfesor(formData.IdProfesor).subscribe(result => {

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
      IdPersona: profesor.IdPersona,
      IdEspecialidad: profesor.IdEspecialidad
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

}
