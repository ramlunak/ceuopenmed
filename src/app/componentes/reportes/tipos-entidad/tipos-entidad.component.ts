
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
  displayedColumns = ['IdTipoEntidad', 'Idioma', 'TipoEntidad'];
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

}

