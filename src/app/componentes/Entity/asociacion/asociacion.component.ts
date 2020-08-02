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


@Component({
  selector: 'app-asociacion',
  templateUrl: './asociacion.component.html',
  styleUrls: ['./asociacion.component.css']
})

export class AsociacionComponent implements OnInit {

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
  displayedColumns = ['IdAsociacion', 'IdEntidad', 'TipoEntidad', 'Idioma', 'Entidad', 'commands'];
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
      this.applyPredicate();
      if (!isNullOrUndefined(this.Service.form.value.Buscar)) {
        this.applyFilter(this.Service.form.value.Buscar);
        this.Service.form.patchValue({
          Buscar: ''
        });
      }

    }, (error) => {

    });
  }


  CargarSelects() {

    this.tipoEntidadService.get().subscribe(result => {
      this.listTiposEntidad = result.data;
    });
  }

  CargarDgvElements() {

    if (this.authService.currentUser.Rol === 'Estudiante') {
      this.Service.getByIdEntidad(this.IdEntidadSeleccionada).subscribe(result => {
        this.dataSource = new MatTableDataSource<Asociacion>(result.data);
        this.listEntidades = result.data;
        this.dataSource.paginator = this.paginator;
        this.CargarDetalles();
      }, (error) => {
        this.errorService.handleError(error);
      });
    } else {
      this.Service.getByIdEntidadEvaluada(this.IdEntidadSeleccionada).subscribe(result => {
        this.dataSource = new MatTableDataSource<Asociacion>(result.data);
        this.listEntidades = result.data;
        this.dataSource.paginator = this.paginator;
        this.CargarDetalles();
      }, (error) => {
        this.errorService.handleError(error);
      });
    }

  }

  public redirectToDetalleEntidad = () => {
    const url = 'FormEntidad';
    this.router.navigate([url]);

  }

  public redirectAsociacionesOpcionales = () => {
    const asociacion = this.dataSource.filteredData[this.ROW_NUMBER];
    const asociacionCompleta = this.EntidadSeleccionada + " " + asociacion.TipoAsociacion + " " + asociacion.Entidad;
    const url = `AsociacionesOpcionales/${asociacion.IdAsociacion}/${asociacionCompleta}/${asociacion.IdEntidad}/${this.IdEntidadSeleccionada}`;
    //const url = 'AsociacionesOpcionales';
    this.router.navigate([url]);
  }

  guardarClick() {
    if (this.Service.form.value.Nivel > 1 || this.Service.form.value.Nivel < 0) {
      this.snackBar.open('La fuerza debe ser un valor entre 0 y 1.', 'OK', {
        duration: 8000,
      });
      return;
    }
    if (this.Service.form.value.IdAsociacion == null) {
      this.Service.set().subscribe(result => {

        if (result.status === 1) {
          this.CargarDgvElements();
          this.Service.form.patchValue(result.data);
          $('#OperationModalDialog').modal('hide');

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
    this.CargarDgvElements();
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
    const asociacion = this.dataSource.filteredData[this.ROW_NUMBER];
    console.log(JSON.stringify(asociacion));
    this.tipoAsociacionService.grelationshipet(this.IdEntidadSeleccionada, asociacion.IdEntidad).subscribe(result => {
      this.listTipoAsociacion = result.data;
    });
    this.Service.form.patchValue(
      {
        IdAsociacion: null,
        IdEntidad1: this.IdEntidadSeleccionada,
        IdEntidad2: asociacion.IdEntidad,
        IdTipoAsociacion: null,
        IdEstudiante: asociacion.IdEstudiante,
        IdProfesor: null,
        IdEntidad: asociacion.IdEntidad,
        IdTipoEntidad: asociacion.IdTipoEntidad,
        TipoEntidad: asociacion.TipoEntidad,
        Nivel: null,
        Evaluacion: null,
        Estado: null,
        Descripcion: null,
        EntidadSeleccionada: this.EntidadSeleccionada
      });

    this.dialogTittle = 'Modificar';
  }

  goToAsociacionesOpcionales() {

    this.redirectAsociacionesOpcionales();

  }

  goToListAsociaciones() {

    const asociacion = this.dataSource.filteredData[this.ROW_NUMBER];
    const url = `AsociacionList/${asociacion.IdEntidad}`;

    //const url = 'AsociacionList';
    this.router.navigate([url]);
  }


  setEvalucacion(estado, evaluacion) {
    this.EstadoEntidad = parseInt(estado, 32);
    this.EvaluacionEntidad = parseInt(evaluacion, 32);
  }

  cargarEvaluacion() {

    this.transaccionIsNew = false;
    const asociacion = this.dataSource.filteredData[this.ROW_NUMBER];
    this.ASOCIACION = this.dataSource.filteredData[this.ROW_NUMBER];
    this.EstadoEntidad = parseInt(asociacion.Estado, 32);
    this.EvaluacionEntidad = parseInt(asociacion.Evaluacion, 32);
    this.ComentarioEntidad = asociacion.Comentario;
    this.Service.form.patchValue({ IdEntidad: asociacion.IdEntidad });
    this.dialogTittle = 'Modificar';
  }

  ActualizarEvaluacion() {

    this.transaccionIsNew = false;
    this.ASOCIACION.Estado = this.EstadoEntidad.toString();
    this.ASOCIACION.Evaluacion = this.EvaluacionEntidad.toString();

    this.Service.form.patchValue({
      IdAsociacion: this.ASOCIACION.IdAsociacion,
      IdEntidad: this.ASOCIACION.IdEntidad,
      IdTipoEntidad: this.ASOCIACION.IdTipoEntidad,
      TipoEntidad: this.ASOCIACION.TipoEntidad,
      IdEstudiante: this.ASOCIACION.IdEstudiante,
      IdProfesor: this.authService.currentUser.IdProfesor,
      Evaluacion: this.ASOCIACION.Evaluacion,
      Estado: this.ASOCIACION.Estado,
      Comentario: this.ASOCIACION.Comentario,
      Descripcion: this.ASOCIACION.Descripcion,
      IdEntidad1: this.ASOCIACION.IdEntidad1,
      IdEntidad2: this.ASOCIACION.IdEntidad2,
      Nivel: this.ASOCIACION.Nivel,
      IdTipoAsociacion: this.ASOCIACION.IdTipoAsociacion
    });

    if (this.ASOCIACION.IdAsociacion == null) {

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


  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.Service.form.reset();
    this.Service.InicializarValoresFormGroup();
    this.dialogTittle = 'Nuevo';
  }

  ShowCheck() {
    this.asociar = true;
  }

  public redirectToAsociacion = () => {
    const url = 'Asociacion';
    this.router.navigate([url]);

  }

  checkboxChange() {
    this.CountEntidad++;
    const entidad = this.dataSource.filteredData[this.ROW_NUMBER];
    if (this.CountEntidad === 2) {
      this.redirectToAsociacion();
    }

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterDetalle(filterValue: string) {

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

    this.cargarEntidadesPorFiltroDetalles(filterValue);

  }


  public cargarEntidadesPorFiltroDetalles(filterValue: string) {

    this.listEntidadesAux = [];
    this.listIDS = [];

    this.dataSourceDetalle.filteredData.forEach(element => {
      this.listIDS.push(element.IdEntidad);
    });

    var novaArr = this.listIDS.filter((este, i) => this.listIDS.indexOf(este) === i);

    novaArr.forEach(element => {
      var asociacion = this.listEntidades.find((x: Asociacion) => x.IdEntidad == element);
      if (asociacion != null)
        this.listEntidadesAux.push(asociacion);
    });

    this.dataSource = new MatTableDataSource<Asociacion>(null);
    this.dataSource = new MatTableDataSource<Asociacion>(this.listEntidadesAux);
    console.log(this.listEntidadesAux);
    if (filterValue == "")
      this.CargarDgvElements();

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


  backClicked() {

    this._location.back();
  }

}
