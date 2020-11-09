import { isNullOrUndefined } from 'util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

declare var $: any;
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../services/seguridad/auth.service';

import { EntidadService } from '../../../services/entity/entidad.service';
import { Entidad } from 'src/app/models/entidad';
import { Asociacion } from 'src/app/models/asociacion';

import { IdiomaService } from '../../../services/administracion/idioma.service';
import { Idioma } from 'src/app/models/idioma';

import { DetalleEntidadService } from '../../../services/entity/detalle-entidad.service';
import { DetalleEntidad } from 'src/app/models/detalle-entidad';


import { TipoAsociacionService } from '../../../services/administracion/tipo-asociacion.service';
import { TipoEntidadService } from '../../../services/administracion/tipo-entidad.service';
import { TipoEntidad } from 'src/app/models/tipo-entidad';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { TipoAsociacion } from 'src/app/models/tipo-asociacion';
import { AsociacionService } from 'src/app/services/entity/asociacion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-relaciones',
  templateUrl: './relaciones.component.html',
  styleUrls: ['./relaciones.component.css']
})
export class RelacionesComponent implements OnInit {

  // para cargar evaluacion
  IdEntidadSeleccionada = 0;
  EntidadSeleccionada = '';
  EstadoEntidad = 0;
  EvaluacionEntidad = 0;
  CountEntidad = 0;
  ComentarioEntidad = '';
  ASOCIACION: Asociacion;
  Search: string = '';

  transaccionIsNew = true;
  asociar = false;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo';

  // DataTable --
  dataSource: MatTableDataSource<Asociacion>;
  displayedColumns = ['IdAsociacion', 'IdEntidad1', 'IdEntidad2', 'TipoAsociacion'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listEntidadesAux: Asociacion[];
  listEntidades: Asociacion[];
  listIDS: Array<number> = [];
  listIdiomas: Idioma[];
  dataSourceDetalle: MatTableDataSource<DetalleEntidad>;

  listTipoAsociacion: TipoAsociacionService[];
  listTiposEntidad: TipoEntidad[];
  dataSourceDetallePalabras: MatTableDataSource<DetalleEntidad>;

  constructor(
    private Service: AsociacionService,
    private entidadService: EntidadService,
    private tipoAsociacionService: TipoAsociacionService,
    private detalleEntidadService: DetalleEntidadService,
    private authService: AuthService,
    private idiomaService: IdiomaService,
    private tipoEntidadService: TipoEntidadService,
    private errorService: ErrorHandlerService,
    private excelService: ExcelService,
    private router: Router,
    private snackBar: MatSnackBar,
    private _location: Location
  ) { }

  ngOnInit() {
    this.IdEntidadSeleccionada = this.Service.form.value.IdEntidad1;
    this.EntidadSeleccionada = this.Service.form.value.entidadSelecionada;

    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';
    this.CargarDgvElements();
    this.CargarSelects();
  }

  CargarDetalles() {
    this.detalleEntidadService.get().subscribe(result => {
      this.dataSourceDetalle = new MatTableDataSource<DetalleEntidad>(result.data);
      this.dataSourceDetallePalabras = new MatTableDataSource<DetalleEntidad>(result.data);

    }, (error) => {

    });
  }


  CargarSelects() {

    this.tipoEntidadService.get().subscribe(result => {
      this.listTiposEntidad = result.data;
    });
  }

  CargarDgvElements() {

    // if (this.authService.currentUser.Rol === 'Estudiante') {
    this.Service.get().subscribe(result => {
      this.dataSource = new MatTableDataSource<Asociacion>(result.data);
      this.listEntidades = result.data;
      console.log(result.data);
      this.dataSource.paginator = this.paginator;
      this.CargarDetalles();
    }, (error) => {
      this.errorService.handleError(error);
    });

    /*
  }
  else {
    this.Service.getByIdEntidadEvaluada(this.IdEntidadSeleccionada).subscribe(result => {
      this.dataSource = new MatTableDataSource<Asociacion>(result.data);
      this.listEntidades = result.data;
      this.dataSource.paginator = this.paginator;
      this.CargarDetalles();
    }, (error) => {
      this.errorService.handleError(error);
    });
  }
*/

  }


  Descargar() {
    this.excelService.exportAsExcelFile(this.dataSource.data, 'Relaciones');
  }

}
