import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { IdiomaService } from '../../services/idioma';
import { Idioma } from 'src/app/models/idioma';
import { AuthService } from 'src/app/services/seguridad/auth.service';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../services/error-handler.service';
import { TipoAsociacion } from 'src/app/models/tipo-asociacion';
import { TipoAsociacionService } from 'src/app/services/tipo-asociacion';
import { TipoEntidad } from 'src/app/models/tipo-entidad';
import { TipoEntidadService } from 'src/app/services/tipo-entidad';


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
    private IdiomaService: IdiomaService,
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

      }, (error) => {
        this.errorService.handleError(error);
      });
    }
    this.Limpiar();
  }

  eliminarClick() {
    this.Service.delete().subscribe(result => {

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
    const TipoAsociacion = this.dataSource.data[this.ROW_NUMBER];
    this.Service.form.patchValue({ IdTipoAsociacion: TipoAsociacion.IdTipoAsociacion, TipoAsociacion: TipoAsociacion.TipoAsociacion });
    this.dialogTittle = 'Modificar';
  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.Service.form.reset();
    this.Service.InicializarValoresFormGroup();
    this.dialogTittle = 'Nuevo';
  }

  applyFilter(filterValue: string) {
    console.log(filterValue.trim().toLowerCase());
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



}
