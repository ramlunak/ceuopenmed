import { element } from 'protractor';
import { isNullOrUndefined } from 'util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../services/seguridad/auth.service';

import { EntidadService } from '../../../services/entity/entidad.service';
import { Entidad } from 'src/app/models/entidad';

import { IdiomaService } from '../../../services/administracion/idioma.service';
import { Idioma } from 'src/app/models/idioma';

import { DetalleEntidadService } from '../../../services/entity/detalle-entidad.service';
import { DetalleEntidad } from 'src/app/models/detalle-entidad';

import { TipoEntidadService } from '../../../services/administracion/tipo-entidad.service';
import { TipoEntidad } from 'src/app/models/tipo-entidad';

import { AsociacionService } from 'src/app/services/entity/asociacion.service';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

// Selector jQuery
declare var $: any;


@Component({
  selector: 'app-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.css']
})

export class EntidadComponent implements OnInit {

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
  displayedColumns = ['IdEntidad', 'TipoEntidad', 'Idioma', 'Entidad', 'Estudiante', 'info', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

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

    //  if (isNullOrUndefined(this.VisorEntidad)) {
    //  this.CargarDgvElements();
    //  } else {
    this.CargarDgvElementsAllEstudent();
    //  }

    this.CargarSelects();
  }

  CargarDetalles() {
    this.detalleEntidadService.get().subscribe(result => {
      this.dataSourceDetalle = new MatTableDataSource<DetalleEntidad>(result.data);
      this.dataSourceDetallePalabras = new MatTableDataSource<DetalleEntidad>(result.data);
      this.applyPredicate();
      if (!isNullOrUndefined(this.VisorEntidad)) {
        this.Search = this.VisorEntidad;
        this.applyFilterDetalle(this.Search);
      }
    }, (error) => {

    });

  }

  CargarSelects() {
    // Idioma
    this.idiomaService.get().subscribe(result => {
      this.listIdiomas = result.data;
    });
    // Tipo Entidad
    this.tipoEntidadService.get().subscribe(result => {
      this.listTiposEntidad = result.data;
    });
  }

  CargarDgvElements() {

    if (this.authService.currentUser.Rol === 'Estudiante') {
      this.Service.getByEtudiante().subscribe(result => {
        this.dataSource = new MatTableDataSource<Entidad>(result.data);
        this.listEntidades = result.data;
        this.dataSource.paginator = this.paginator;
        this.CargarDetalles();
      }, (error) => {
        this.errorService.handleError(error);
      });
    } else {
      this.Service.getByProfesorEstado().subscribe(result => {
        this.dataSource = new MatTableDataSource<Entidad>(result.data);
        this.listEntidades = result.data;
        this.dataSource.paginator = this.paginator;
        this.CargarDetalles();
      }, (error) => {
        this.errorService.handleError(error);
      });
    }


  }

  CargarDgvElementsAllEstudent() {
    if (this.authService.currentUser.Rol === 'Estudiante') {
      this.Service.get().subscribe(result => {
        this.dataSource = new MatTableDataSource<Entidad>(result.data);
        this.listEntidades = result.data;
        this.dataSource.paginator = this.paginator;
        this.CargarDetalles();
      }, (error) => {
        this.errorService.handleError(error);
      });
    }
  }

  public redirectToDetalleEntidad = (entidad: any) => {
    const url = `additionalInfo/${entidad.IdEntidad}/${entidad.IdTipoEntidad}/${entidad.Evaluacion}/${this.authService.currentUser.IdEstudiante}`;
    this.router.navigate([url]);
  }

  guardarClick() {

    if (this.transaccionIsNew) {
      this.Service.set().subscribe(result => {

        if (result.status === 1) {

          $('#OperationModalDialog').modal('hide');
          this.redirectToDetalleEntidad(result.data);

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
    const entidad = this.dataSource.filteredData[this.ROW_NUMBER];

    this.Service.form.patchValue(
      {
        IdEntidad: entidad.IdEntidad,
        IdTipoEntidad: entidad.IdTipoEntidad,
        TipoEntidad: entidad.TipoEntidad,
        IdEstudiante: entidad.IdEstudiante,
        IdProfesor: entidad.IdProfesor,
        Evaluacion: entidad.Evaluacion,
        Comentario: entidad.Comentario,
        Estado: 0
      });
    this.dialogTittle = 'Modificar';
  }

  setEvalucacion(estado: string, evaluacion: string) {
    this.EstadoEntidad = parseInt(estado, 32);
    this.EvaluacionEntidad = parseInt(evaluacion, 32);
  }

  cargarEvaluacion() {

    this.transaccionIsNew = false;
    const entidad = this.dataSource.filteredData[this.ROW_NUMBER];
    this.ENTIDAD = this.dataSource.filteredData[this.ROW_NUMBER];
    this.EstadoEntidad = parseInt(entidad.Estado, 32);
    this.EvaluacionEntidad = parseInt(entidad.Evaluacion, 32);

    if (!isNullOrUndefined(entidad.Comentario)) {
      this.ComentarioEntidad = entidad.Comentario;
    } else {
      this.ComentarioEntidad = null;
    }

    this.Service.form.patchValue({ IdEntidad: entidad.IdEntidad });
    this.dialogTittle = 'Modificar';
    this.verificarAsocioacionesEvaluadas();
  }

  ActualizarEvaluacion() {

    this.transaccionIsNew = false;
    this.ENTIDAD.Estado = this.EstadoEntidad.toString();
    this.ENTIDAD.Evaluacion = this.EvaluacionEntidad.toString();
    this.ENTIDAD.Comentario = this.Service.form.value.Comentario;

    this.Service.form.patchValue({
      IdEntidad: this.ENTIDAD.IdEntidad,
      IdTipoEntidad: this.ENTIDAD.IdTipoEntidad,
      TipoEntidad: this.ENTIDAD.TipoEntidad,
      IdEstudiante: this.ENTIDAD.IdEstudiante,
      IdProfesor: this.authService.currentUser.IdProfesor,
      Evaluacion: this.ENTIDAD.Evaluacion,
      Estado: this.ENTIDAD.Estado,
      Comentario: this.ENTIDAD.Comentario
    });

    this.Service.update().subscribe(result => {

      if (result.status === 1) {
        this.CargarDgvElements();
        this.ComentarioEntidad = null;
      } else {
        this.errorService.handleError(result.error);
      }

    }, (error) => {
      this.errorService.handleError(error);
    });

  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.Service.InicializarValoresFormGroup();
    this.Service.form.reset();
    this.Service.form.patchValue({ IdEstudiante: this.authService.currentUser.IdEstudiante, Estado: 0 });
    this.dialogTittle = 'Nuevo';
  }

  goToAsociciones() {

    const entidad = this.dataSource.filteredData[this.ROW_NUMBER];

    this.asociacionService.form.patchValue({
      IdEntidad1: entidad.IdEntidad,
      entidadSelecionada: entidad.Entidad
    });
    this.redirectToAsociacion();
  }

  public redirectToAsociacion = () => {
    this.router.navigate(['Asociacion']);
  }

  checkboxChange() {
    this.CountEntidad++;
    if (this.CountEntidad === 2) {
      this.redirectToAsociacion();
    }
  }

  verificarAsocioacionesEvaluadas() {

    this.asociacionService.getByIdEntidad(this.Service.form.value.IdEntidad).subscribe(result => {

      result.data.forEach(element => {
        if (element.Estado! + null) {
          this.countAsociaciones++;
          if (element.Estado === 0 && element.Evaluacion === 0) {
            this.countEspera++;
          }

          if (element.Estado === 1 && element.Evaluacion === 0) {
            this.countError++;
          }

          if (element.Estado === 1 && element.Evaluacion === 1) {
            this.countCorrect++;
          }

        }
      });
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.paginator = this.paginator;
  }


  applyFilterDetalle(filterValue: string) {

    if (filterValue.length !== 0)
      if (filterValue.length < 3) {
        return;
      }

    //dividir el filtro por spacio
    var palabras = filterValue.split(' ');

    this.dataSourceDetallePalabras.data = this.dataSourceDetalle.data;
    this.dataSourceDetalle.filteredData = this.dataSourceDetalle.data;
    palabras.forEach(element => {

      if (element != "" && element != " ") {
        if (this.dataSourceDetalle.filteredData.length > 0)
          this.dataSourceDetallePalabras.data = this.dataSourceDetalle.filteredData;

        this.dataSourceDetallePalabras.filter = element.trim().toLowerCase();
        this.dataSourceDetalle.filteredData = this.dataSourceDetallePalabras.filteredData;
      }

    });

    this.cargarEntidadesPorFiltroDetalles();

  }

  public cargarEntidadesPorFiltroDetalles() {

    this.listEntidadesAux = [];
    this.listIDS = [];

    this.dataSourceDetalle.filteredData.forEach(element => {
      this.listIDS.push(element.IdEntidad);
    });

    var novaArr = this.listIDS.filter((este, i) => this.listIDS.indexOf(este) === i);

    novaArr.forEach(element => {
      if (!isNullOrUndefined(this.listEntidades.find((x: Entidad) => x.IdEntidad == element)))
        this.listEntidadesAux.push(this.listEntidades.find((x: Entidad) => x.IdEntidad == element));
    });

    this.dataSource = new MatTableDataSource<Entidad>(this.listEntidadesAux);
    this.dataSource.paginator = this.paginator;
  }

  public redirectToAdditionalInfo = () => {
    const entidad = this.dataSource.filteredData[this.ROW_NUMBER];
    const url = `additionalInfo/${entidad.IdEntidad}/${entidad.IdTipoEntidad}/${entidad.Evaluacion}//${entidad.IdEstudiante}`;
    this.router.navigate([url]);
  }

  onValChange(value) {
    if (value == "todas") {
      this.CargarDgvElementsAllEstudent();
    }
    else {
      this.CargarDgvElements();
    }
  }


  applyPredicate() {
    this.dataSourceDetallePalabras.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return (currentTerm + (data as { [key: string]: any })[key] + '◬');
      }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      return dataStr.indexOf(transformedFilter) != -1;
    }


  }

}

