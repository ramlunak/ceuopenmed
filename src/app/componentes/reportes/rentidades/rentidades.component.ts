import { element } from 'protractor';
import { isNullOrUndefined } from 'util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../services/seguridad/auth.service';

import { EntidadService } from '../../../services/entity/entidad.service';
import { Entidad, EntidadReporte } from 'src/app/models/entidad';

import { IdiomaService } from '../../../services/administracion/idioma.service';
import { Idioma } from 'src/app/models/idioma';

import { DetalleEntidadService } from '../../../services/entity/detalle-entidad.service';
import { DetalleEntidad } from 'src/app/models/detalle-entidad';

import { TipoEntidadService } from '../../../services/administracion/tipo-entidad.service';
import { TipoEntidad } from 'src/app/models/tipo-entidad';

import { AsociacionService } from 'src/app/services/entity/asociacion.service';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { ExcelService } from 'src/app/services/excel.service';

// Selector jQuery
declare var $: any;

@Component({
  selector: 'app-rentidades',
  templateUrl: './rentidades.component.html',
  styleUrls: ['./rentidades.component.css']
})
export class RentidadesComponent implements OnInit {


  // para cargar evaluacion
  EstadoEntidad = 0;
  EvaluacionEntidad = 0;
  CountEntidad = 0;
  ComentarioEntidad = null;
  ENTIDAD: Entidad;
  enablaEvaluation = 0;

  transaccionIsNew = true;
  asociar = false;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo';

  countError = 0;
  countEspera = 0;
  countCorrect = 0;
  countAsociaciones = 0;

  // DataTable --
  dataSource: MatTableDataSource<Entidad>;
  displayedColumns = ['IdEntidad', 'TipoEntidad', 'Idioma', 'Entidad', 'Estudiante'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ListEntidadReporte: EntidadReporte[] = [];
  listEntidadesAux: Entidad[];
  listEntidades: Entidad[];
  listIDS: Array<number> = [];
  listIdiomas: Idioma[];
  listTiposEntidad: TipoEntidad[];
  dataSourceDetalle: MatTableDataSource<DetalleEntidad>;
  dataSourceDetallePalabras: MatTableDataSource<DetalleEntidad>;
  VisorEntidad: string;
  Search: string;

  constructor(
    public Service: EntidadService,
    private asociacionService: AsociacionService,
    private detalleEntidadService: DetalleEntidadService,
    private authService: AuthService,
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
    this.Service.form.patchValue({ IdEstudiante: this.authService.currentUser.IdEstudiante, Estado: 0 });
    this.VisorEntidad = this.activeRoute.snapshot.params.entidad;
    this.Search = '';
    this.CargarDgvElements();
  }

  CargarDgvElements() {

    this.Service.get().subscribe(result => {
      this.dataSource = new MatTableDataSource<Entidad>(result.data);
      this.listEntidades = result.data;
      this.dataSource.paginator = this.paginator;

    }, (error) => {
      this.errorService.handleError(error);
    });

  }

  Descargar() {
    this.dataSource.data.forEach(item => {
      if (item.Estado === '1') {
        var entidad = {
          IdEntidad: item.IdEntidad,
          Entidad: item.Entidad,
          IdTipoEntidad: item.IdTipoEntidad,
          TipoEntidad: item.TipoEntidad,
          Idioma: item.Idioma,
          Comentario: item.Comentario
        };
        this.ListEntidadReporte.push(entidad);
      }
    });
    this.excelService.exportAsExcelFile(this.ListEntidadReporte, 'Entidades');
  }

}
