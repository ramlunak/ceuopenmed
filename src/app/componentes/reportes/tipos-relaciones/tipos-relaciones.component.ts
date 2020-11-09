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
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-tipos-relaciones',
  templateUrl: './tipos-relaciones.component.html',
  styleUrls: ['./tipos-relaciones.component.css']
})
export class TiposRelacionesComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo';

  // DataTable --
  dataSource: MatTableDataSource<TipoAsociacion>;
  dataSourceAux: MatTableDataSource<TipoAsociacion>;
  dataSourcePalabras: MatTableDataSource<TipoAsociacion>;
  displayedColumns = ['IdTipoAsociacion', 'TipoEntidad1', 'TipoEntidad2', 'Idioma', 'TipoAsociacion'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listTipoEntidad: TipoEntidad[];
  listIdiomas: Idioma[];

  constructor(
    private Service: TipoAsociacionService,
    private tipoEntidadService: TipoEntidadService,
    private authService: AuthService,
    private idiomaService: IdiomaService,
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

  Descargar() {
    this.excelService.exportAsExcelFile(this.dataSource.data, 'Tipos_de_Relaciones');
  }

}
