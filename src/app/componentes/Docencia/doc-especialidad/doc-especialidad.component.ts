import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DocEspecialidadService } from '../../../services/docencia/doc-especialidad.service';
import { DocEspecialidad } from 'src/app/models/Docencia/doc-especialidad';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

@Component({
  selector: 'app-doc-especialidad',
  templateUrl: './doc-especialidad.component.html',
  styleUrls: ['./doc-especialidad.component.css']
})
export class DocEspecialidadComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo Especialidad';

  // DataTable --
  dataSource: MatTableDataSource<DocEspecialidad>;
  displayedColumns = ['IdEspecialidad', 'Especialidad', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private especialidadService: DocEspecialidadService, private errorService: ErrorHandlerService) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';
    this.CargarDgvElements();
  }

  CargarDgvElements() {
    this.especialidadService.getEspecialidades().subscribe(result => {
      this.dataSource = new MatTableDataSource<DocEspecialidad>(result.data);
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
      this.especialidadService.setEspecialidad().subscribe(result => {

        if (result.status === 1) {
          this.CargarDgvElements();
        } else {
          this.errorService.handleError(result.error);
        }

      }, (error) => {
        this.errorService.handleError(error);
      });
    } else {
      this.especialidadService.updateEspecialidad().subscribe(result => {

        if (result.status === 1) {
          this.CargarDgvElements();
        } else {
          this.errorService.handleError(result.error);
        }

      }, (error) => {
        this.errorService.handleError(error);
      });
    }
    this.Limpiar();
  }

  eliminarClick() {
    this.especialidadService.deleteEspecialidad().subscribe(result => {

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
    const especialidad = this.dataSource.data[this.ROW_NUMBER];
    this.especialidadService.form.patchValue({ IdEspecialidad: especialidad.IdEspecialidad, Especialidad: especialidad.Especialidad });
    this.dialogTittle = 'Modificar Especialidad';
  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.especialidadService.form.reset();
    this.especialidadService.InicializarValoresFormGroup();
    this.dialogTittle = 'Nuevo Especialidad';
  }

}
