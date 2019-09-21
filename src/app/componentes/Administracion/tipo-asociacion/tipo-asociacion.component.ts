import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { AuthService } from 'src/app/services/seguridad/auth.service';

import { TipoAsociacion } from 'src/app/models/tipo-asociacion';
import { TipoAsociacionService } from 'src/app/services/tipo-asociacion.service';
import { TipoEntidad } from 'src/app/models/tipo-entidad';
import { TipoEntidadService } from 'src/app/services/tipo-entidad.service';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

// Selector jQuery
declare var $: any;


@Component({
  selector: 'app-tipo-asociacion',
  templateUrl: './tipo-asociacion.component.html',
  styleUrls: ['./tipo-asociacion.component.css']
})

export class TipoAsociacionComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo';

  // DataTable --
  dataSource: MatTableDataSource<TipoAsociacion>;
  displayedColumns = ['IdTipoAsociacion', 'TipoAsociacion', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listTipoEntidad: TipoEntidad[];

  constructor(
    private Service: TipoAsociacionService,
    private tipoEntidadService: TipoEntidadService,
    private authService: AuthService,
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

  CargarSelects() {
    this.tipoEntidadService.get().subscribe(result => {
      this.listTipoEntidad = result.data;
    });
  }

  CargarDgvElements() {
    this.Service.get().subscribe(result => {
      this.dataSource = new MatTableDataSource<TipoAsociacion>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
    });

  }



  guardarClick() {

    if (this.transaccionIsNew) {
      this.Service.set().subscribe(result => {

        if (result.status === 1) {
          this.CargarDgvElements();
        } else {
          this.errorService.handleError(result.error);
        }
        this.Limpiar();
      }, (error) => {
        this.errorService.handleError(error);
      });
    } else {
      this.Service.update().subscribe(result => {

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

  }

  eliminarClick() {
    this.Service.delete().subscribe(result => {

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
    const tipoAsociacion = this.dataSource.data[this.ROW_NUMBER];
    this.Service.form.patchValue({
      IdTipoAsociacion: tipoAsociacion.IdTipoAsociacion,
      IdTipoEntidad1: tipoAsociacion.IdTipoEntidad1,
      IdTipoEntidad2: tipoAsociacion.IdTipoEntidad2,
      TipoAsociacion: tipoAsociacion.TipoAsociacion
    });
    this.dialogTittle = 'Modificar';
  }

  Limpiar() {
    this.Service.InicializarValoresFormGroup();
    this.Service.form.reset();
    if (!this.transaccionIsNew) {
      this.transaccionIsNew = true;
      this.dialogTittle = 'Nuevo';
      $('#OperationModalDialog').modal('hide');
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
