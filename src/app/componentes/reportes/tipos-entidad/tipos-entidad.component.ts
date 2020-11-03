


import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { TipoEntidadService } from '../../../services/administracion/tipo-entidad.service';
import { TipoEntidad } from 'src/app/models/tipo-entidad';

import { IdiomaService } from '../../../services/administracion/idioma.service';
import { Idioma } from 'src/app/models/idioma';
import { AuthService } from 'src/app/services/seguridad/auth.service';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/services/excel.service';

// Selector jQuery
declare var $: any;

@Component({
  selector: 'app-tipos-entidad',
  templateUrl: './tipos-entidad.component.html',
  styleUrls: ['./tipos-entidad.component.css']
})
export class TiposEntidadComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo Tipo de Entidad';

  // DataTable --
  dataSource: MatTableDataSource<TipoEntidad>;
  dataSourceAux: MatTableDataSource<TipoEntidad>;
  dataSourcePalabras: MatTableDataSource<TipoEntidad>;
  displayedColumns = ['IdTipoEntidad', 'Idioma', 'TipoEntidad', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listIdiomas: Idioma[];

  constructor(
    private Service: TipoEntidadService,
    private idiomaService: IdiomaService,
    private authService: AuthService,
    private router: Router,
    private excelService: ExcelService,
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
      this.dataSourcePalabras = new MatTableDataSource<TipoEntidad>(result.data);
      this.dataSourceAux = new MatTableDataSource<TipoEntidad>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
    });

  }

  Descargar() {
    this.excelService.exportAsExcelFile(this.dataSource.data, 'Tipos_de_Entidad');
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
    const entity = this.dataSource.filteredData[this.ROW_NUMBER];
    const url = `traduccion/TipoEntidad/${entity.IdTipoEntidad}/${entity.TipoEntidad}`;
    this.router.navigate([url]);
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

