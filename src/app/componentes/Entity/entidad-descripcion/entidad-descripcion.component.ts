
import { isNullOrUndefined } from 'util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../services/seguridad/auth.service';

import { EntidadService } from '../../../services/entity/entidad.service';

import { DetalleEntidadService } from '../../../services/entity/detalle-entidad.service';
import { DetalleEntidad } from 'src/app/models/detalle-entidad';

import { IdiomaService } from '../../../services/administracion/idioma.service';
import { Idioma } from 'src/app/models/idioma';

import { TipoEntidadService } from '../../../services/administracion/tipo-entidad.service';
import { Entidad } from 'src/app/models/entidad';
import { TipoEntidad } from 'src/app/models/tipo-entidad';

import { EntidadDescripcionService } from './../../../services/entidad-descripcion.service';
import { EntidadDescripcion } from './../../../models/entidad-descripcion';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';


@Component({
  selector: 'app-entidad-descripcion',
  templateUrl: './entidad-descripcion.component.html',
  styleUrls: ['./entidad-descripcion.component.css']
})
export class EntidadDescripcionComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo';
  IdEntidad: number;
  IdTipoEntidad: number;
  EvaluacionEntidad: number;
  TIPO_ENTIDAD: string;
  ENTIDAD: Entidad;

  // DataTable --
  dataSource: MatTableDataSource<EntidadDescripcion>;
  dataSourceAux: MatTableDataSource<EntidadDescripcion>;
  dataSourcePalabras: MatTableDataSource<EntidadDescripcion>;
  displayedColumns = ['Idioma', 'Descripcion', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listIdiomas: Idioma[];
  listTiposEntidad: TipoEntidad[];
  EntidadIdEStudiante: number;
  ParametroBusqueda: string;
  Search = '';

  constructor(
    private entidadService: EntidadService,
    private authService: AuthService,
    private entidadDescripcion: EntidadDescripcionService,
    private detalleEntidadService: DetalleEntidadService,
    private idiomaService: IdiomaService,
    private tipoEntidadService: TipoEntidadService,
    private errorService: ErrorHandlerService,
    private router: Router,
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
    this.CargarExtraInfo();
    this.CargarSelects();


  }

  CargarDgvElements() {
    this.entidadDescripcion.getByEntidad(this.IdEntidad).subscribe(result => {
      this.dataSource = new MatTableDataSource<EntidadDescripcion>(result.data);
      this.dataSourceAux = new MatTableDataSource<EntidadDescripcion>(result.data);
      this.dataSourcePalabras = new MatTableDataSource<EntidadDescripcion>(result.data);
      this.dataSource.paginator = this.paginator;
      this.applyPredicate();
      if (!isNullOrUndefined(this.ParametroBusqueda)) {
        this.Search = this.ParametroBusqueda;
        this.applyFilter(this.Search);
      }
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  CargarSelects() {
    // Idioma
    this.idiomaService.get().subscribe(result => {
      this.listIdiomas = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });

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

  /*
    CargarDgvElements() {
      this.entidadService.viewDetalle(this.IdEntidad).subscribe(result => {
        this.dataSource = new MatTableDataSource<DetalleEntidad>(result.data);
        this.dataSourceAux = new MatTableDataSource<DetalleEntidad>(result.data);
        this.dataSourcePalabras = new MatTableDataSource<DetalleEntidad>(result.data);
        this.dataSource.paginator = this.paginator;
        this.applyPredicate();
        if (!isNullOrUndefined(this.ParametroBusqueda)) {
          this.Search = this.ParametroBusqueda;
          this.applyFilter(this.Search);
        }
      }, (error) => {
        this.errorService.handleError(error);
        this.router.navigateByUrl('entidad');
      });
    }
  */
  ActualizarEstadoEntidad() {
    this.ENTIDAD.Estado = '0';
    this.ENTIDAD.Evaluacion = '0';
    this.ENTIDAD.Comentario = '';
    this.entidadService.form.patchValue(this.ENTIDAD);
    this.entidadService.update().subscribe(result => {
      if (result.status === 1) {
        // this.CargarDgvElements();
      } else {
        this.errorService.handleError(result.error);
      }

    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  guardarClick() {

    if (this.transaccionIsNew) {
      this.detalleEntidadService.set().subscribe(result => {

        if (result.status === 1) {
          this.ActualizarEstadoEntidad();
          this.CargarDgvElements();
        } else {
          this.errorService.handleError(result.error);

        }
        this.Limpiar();
      }, (error) => {
        this.errorService.handleError(error);
      });
    } else {
      this.detalleEntidadService.update().subscribe(result => {

        if (result.status === 1) {
          this.ActualizarEstadoEntidad();
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
    this.detalleEntidadService.delete().subscribe(result => {

      if (result.status === 1) {
        this.ActualizarEstadoEntidad();
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
    /*
    this.transaccionIsNew = false;
    const detalle = this.dataSource.filteredData[this.ROW_NUMBER];
    this.detalleEntidadService.form.patchValue(
      {
        IdRecurso: detalle.IdRecurso,
        IdIdioma: detalle.IdIdioma,
        IdEntidad: this.IdEntidad,
        Entidad: detalle.Entidad,
        Nivel: detalle.Nivel
      });
      */
  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.detalleEntidadService.InicializarValoresFormGroup();
    this.detalleEntidadService.form.reset();
    this.detalleEntidadService.form.patchValue({ IdEntidad: this.IdEntidad });
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

        this.dataSourcePalabras.filter = element.trim();
        this.dataSource.data = this.dataSourcePalabras.filteredData;
      }

    });

  }

  applyPredicate() {
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return (currentTerm + (data as { [key: string]: any })[key] + '◬');
      }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      return dataStr.indexOf(transformedFilter) != -1;
    }


  }


}
