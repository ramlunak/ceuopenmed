import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { TipoEntidadService } from '../../../services/tipo-entidad.service';
import { TipoEntidad } from 'src/app/models/tipo-entidad';

import { IdiomaService } from '../../../services/idioma.service';
import { Idioma } from 'src/app/models/idioma';
import { AuthService } from 'src/app/services/seguridad/auth.service';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

// Selector jQuery
declare var $: any;


@Component({
  selector: 'app-tipo-entidad',
  templateUrl: './tipo-entidad.component.html',
  styleUrls: ['./tipo-entidad.component.css']
})

export class TipoEntidadComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo Tipo de Entidad';

  // DataTable --
  dataSource: MatTableDataSource<TipoEntidad>;
  displayedColumns = ['IdTipoEntidad', 'Idioma', 'TipoEntidad', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listIdiomas: Idioma[];

  constructor(
    private Service: TipoEntidadService,
    private idiomaService: IdiomaService,
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
    this.idiomaService.get().subscribe(result => {
      this.listIdiomas = result.data;
    });
  }

  CargarDgvElements() {
    this.Service.get().subscribe(result => {
      this.dataSource = new MatTableDataSource<TipoEntidad>(result.data);
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
    const tipoEntidad = this.dataSource.data[this.ROW_NUMBER];
    this.Service.form.patchValue({
      IdTipoEntidad: tipoEntidad.IdTipoEntidad,
      IdIdioma: tipoEntidad.IdIdioma,
      TipoEntidad: tipoEntidad.TipoEntidad
    });
    this.dialogTittle = 'Modificar Tipo de Entidad';
  }

  Limpiar() {
    this.Service.InicializarValoresFormGroup();
    this.Service.form.reset();
    if (!this.transaccionIsNew) {
      this.transaccionIsNew = true;
      this.dialogTittle = 'Nuevo Tipo de Entidad';
      $('#OperationModalDialog').modal('hide');
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



}
