import { isNullOrUndefined } from 'util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../services/seguridad/auth.service';

import { EntidadService } from '../../../services/entity/entidad.service';

import { DetalleEntidadService } from '../../../services/entity/detalle-entidad.service';
import { DetalleEntidad, DetalleEntidadReporte } from 'src/app/models/detalle-entidad';

import { IdiomaService } from '../../../services/administracion/idioma.service';
import { Idioma } from 'src/app/models/idioma';

import { TipoEntidadService } from '../../../services/administracion/tipo-entidad.service';
import { Entidad } from 'src/app/models/entidad';
import { TipoEntidad } from 'src/app/models/tipo-entidad';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { ExcelService } from 'src/app/services/excel.service';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {


  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo';
  IdEntidad: number;
  IdTipoEntidad: number;
  EvaluacionEntidad: number;
  TIPO_ENTIDAD: string;
  ENTIDAD: Entidad;

  // DataTable --
  dataSource: MatTableDataSource<DetalleEntidad>;
  dataSourceAux: MatTableDataSource<DetalleEntidad>;
  dataSourcePalabras: MatTableDataSource<DetalleEntidad>;
  displayedColumns = ['Idioma', 'Entidad', 'Nivel'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listDetalleEntidadReporte: DetalleEntidadReporte[] = [];
  listIdiomas: Idioma[];
  listTiposEntidad: TipoEntidad[];
  EntidadIdEStudiante: number;
  ParametroBusqueda: string;
  Search = '';

  constructor(
    private entidadService: EntidadService,
    private authService: AuthService,
    private detalleEntidadService: DetalleEntidadService,
    private idiomaService: IdiomaService,
    private tipoEntidadService: TipoEntidadService,
    private errorService: ErrorHandlerService,
    private router: Router,
    private excelService: ExcelService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';
    this.IdEntidad = this.activeRoute.snapshot.params.idEntidad;
    this.IdTipoEntidad = this.activeRoute.snapshot.params.idTipoEntidad;
    this.EvaluacionEntidad = this.activeRoute.snapshot.params.EvaluacionEntidad;
    this.ParametroBusqueda = this.activeRoute.snapshot.params.parametroBusqueda;
    this.EntidadIdEStudiante = this.activeRoute.snapshot.params.IdEstudiante;
    this.detalleEntidadService.form.patchValue({ IdEntidad: this.IdEntidad });
    this.CargarDgvElements();

  }


  CargarExtraInfo() {
    // Tipo Entidad
    this.tipoEntidadService.view(this.IdTipoEntidad).subscribe(result => {
      this.TIPO_ENTIDAD = result.data.TipoEntidad;
    }, (error) => {
      this.errorService.handleError(error);
    });
    // Entidad
    this.entidadService.view(this.IdEntidad).subscribe(result => {
      this.ENTIDAD = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }


  CargarDgvElements() {
    this.detalleEntidadService.get().subscribe(result => {
      this.dataSource = new MatTableDataSource<DetalleEntidad>(result.data);
      this.dataSourceAux = new MatTableDataSource<DetalleEntidad>(result.data);
      this.dataSourcePalabras = new MatTableDataSource<DetalleEntidad>(result.data);
      this.dataSource.paginator = this.paginator;

    }, (error) => {
      this.errorService.handleError(error);

    });
  }

  Descargar() {
    this.dataSource.data.forEach(item => {

      var detalle = {
        IdRecurso: item.IdRecurso,
        IdIdioma: item.IdIdioma,
        Idioma: item.Idioma,
        IdEntidad: item.IdEntidad,
        Entidad: item.Entidad,
        IdTipoEntidad: item.IdTipoEntidad,
        TipoEntidad: item.TipoEntidad,
        Nivel: item.Nivel
      };
      this.listDetalleEntidadReporte.push(detalle);

    });
    console.log(this.dataSource.data);
    this.excelService.exportAsExcelFile(this.listDetalleEntidadReporte, 'Detalles');
  }

}
