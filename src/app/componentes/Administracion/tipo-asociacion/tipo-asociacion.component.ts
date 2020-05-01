import { IdiomaService } from './../../../services/idioma.service';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { AuthService } from 'src/app/services/seguridad/auth.service';

import { TipoAsociacion } from 'src/app/models/tipo-asociacion';
import { TipoAsociacionService } from 'src/app/services/administracion/tipo-asociacion.service';
import { TipoEntidad } from 'src/app/models/tipo-entidad';
import { TipoEntidadService } from 'src/app/services/administracion/tipo-entidad.service';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { Router } from '@angular/router';
import { Idioma } from 'src/app/models/idioma';

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
  dataSourceAux: MatTableDataSource<TipoAsociacion>;
  dataSourcePalabras: MatTableDataSource<TipoAsociacion>;
  displayedColumns = ['IdTipoAsociacion', 'TipoEntidad1', 'TipoEntidad2', 'Idioma', 'TipoAsociacion', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listTipoEntidad: TipoEntidad[];
  listIdiomas: Idioma[];

  constructor(
    private Service: TipoAsociacionService,
    private tipoEntidadService: TipoEntidadService,
    private authService: AuthService,
    private idiomaService: IdiomaService,
    private router: Router,
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

    this.idiomaService.get().subscribe(result => {
      this.listIdiomas = result.data;
    });
  }

  CargarDgvElements() {
    this.Service.get().subscribe(result => {
      this.dataSource = new MatTableDataSource<TipoAsociacion>(result.data);
      this.dataSourceAux = new MatTableDataSource<TipoAsociacion>(result.data);
      this.dataSourcePalabras = new MatTableDataSource<TipoAsociacion>(result.data);
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

  public goToTraducciones = () => {
    const tipoAsociacion = this.dataSource.filteredData[this.ROW_NUMBER];
    const url = `traduccion/TipoAsociacion/${tipoAsociacion.IdTipoAsociacion}/${tipoAsociacion.TipoAsociacion}`;
    this.router.navigate([url]);
  }

  setOperationsData() {
    this.transaccionIsNew = false;
    const tipoAsociacion = this.dataSource.filteredData[this.ROW_NUMBER];
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

    //dividir el filtro por spacio
    var palabras = filterValue.split(' ');

    this.dataSource.data = this.dataSourceAux.data;

    this.dataSourcePalabras.data = this.dataSource.data;
    this.dataSource.filteredData = this.dataSource.data;

    palabras.forEach(element => {

      if (element != "" && element != " ") {
        if (this.dataSource.filteredData.length > 0)
          this.dataSourcePalabras.data = this.dataSource.filteredData;

        this.dataSourcePalabras.filter = this.normalize(element.trim().toLowerCase());
        this.dataSource.data = this.dataSourcePalabras.filteredData;
      }

    });

  }


  normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
      to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
      mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i)))
          ret.push(mapping[c]);
        else
          ret.push(c);
      }
      return ret.join('');
    }

  })();

}
