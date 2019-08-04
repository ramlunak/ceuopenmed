import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DocEstudianteService } from '../../../services/docencia/doc-estudiante.service';
import { DocEstudiante } from 'src/app/models/Docencia/doc-estudiante';
import { AdmPersonaService } from '../../../services/administracion/adm-persona.service';
import { AdmPersona } from 'src/app/models/Administracion/adm-persona';
import { DocGrupoService } from '../../../services/docencia/doc-grupo.service';
import { DocGrupo } from 'src/app/models/Docencia/doc-grupo';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

@Component({
  selector: 'app-doc-estudiante',
  templateUrl: './doc-estudiante.component.html',
  styleUrls: ['./doc-estudiante.component.css']
})
export class DocEstudianteComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo Estudiante';

  // DataTable --
  dataSource: MatTableDataSource<DocEstudiante>;
  displayedColumns = ['IdEstudiante', 'NombreCompleto', 'Grupo', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // Selects
  listPersonas: AdmPersona[];
  listGrupos: DocGrupo[];

  constructor(private estudianteService: DocEstudianteService,
              private personaService: AdmPersonaService,
              private grupoService: DocGrupoService,
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
    });

    this.grupoService.getGrupos().subscribe(result => {
      this.listGrupos = result.data;
    });
  }

  applyFilter(filterValue: string) {
    console.log(filterValue.trim().toLowerCase());
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  guardarClick() {

    const formDataPersona = this.personaService.form.value;
    const formDataEstudiante = this.estudianteService.form.value;

    if (this.transaccionIsNew) {
      this.personaService.setPersona(
        formDataPersona.PrimerNombre,
        formDataPersona.SegundoNombre,
        formDataPersona.ApellidoPaterno,
        formDataPersona.ApellidoMaterno
      ).subscribe(result => {

        if (result.status === 1) {

          const persona: AdmPersona = result.data;

          this.estudianteService.setEstudiante(persona.IdPersona, formDataEstudiante.IdGrupo).subscribe(result2 => {

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

          this.estudianteService.updateEstudiante(formDataEstudiante.IdEstudiante, formDataEstudiante.IdPersona, formDataEstudiante.IdGrupo)
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
    const formData = this.estudianteService.form.value;
    this.estudianteService.deleteEstudiante(formData.IdEstudiante).subscribe(result => {

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
    this.transaccionIsNew = true;
    this.personaService.form.reset();
    this.personaService.InicializarValoresFormGroup();
    this.estudianteService.form.reset();
    this.estudianteService.InicializarValoresFormGroup();
    this.dialogTittle = 'Nuevo Estudiante';
  }

}
