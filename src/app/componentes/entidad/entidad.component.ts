import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../services/seguridad/auth.service';

import { EntidadService } from '../../services/entidad';
import { Entidad } from 'src/app/models/entidad';

import { IdiomaService } from '../../services/idioma';
import { Idioma } from 'src/app/models/idioma';

import { TipoEntidadService } from '../../services/tipo-entidad';
import { TipoEntidad } from 'src/app/models/tipo-entidad';

import { AsociacionService } from 'src/app/services/asociacion';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../services/error-handler.service';


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

  transaccionIsNew = true;
  asociar = false;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo';

  // DataTable --
  dataSource: MatTableDataSource<Entidad>;
  displayedColumns = ['IdEntidad', 'TipoEntidad', 'Idioma', 'Entidad', 'info', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listIdiomas: Idioma[];
  listTiposEntidad: TipoEntidad[];

  constructor(
    private Service: EntidadService,
    private asociacionService: AsociacionService,
    private authService: AuthService,
    private idiomaService: IdiomaService,
    private tipoEntidadService: TipoEntidadService,
    private errorService: ErrorHandlerService,
    private router: Router,
  ) { }

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
        this.dataSource.paginator = this.paginator;
      }, (error) => {
        this.errorService.handleError(error);
      });
    } else {
      this.Service.getByProfesorEstado().subscribe(result => {
        this.dataSource = new MatTableDataSource<Entidad>(result.data);
        this.dataSource.paginator = this.paginator;
      }, (error) => {
        this.errorService.handleError(error);
      });
    }

  }

  public redirectToDetalleEntidad = () => {
    const url = 'FormEntidad';
    this.router.navigate([url]);

  }

  guardarClick() {

    if (this.transaccionIsNew) {
      this.Service.set().subscribe(result => {

        if (result.status === 1) {
          this.CargarDgvElements();
          this.Service.form.patchValue(result.data);
          $('#OperationModalDialog').modal('hide');
          this.redirectToDetalleEntidad();

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
    const entidad = this.dataSource.data[this.ROW_NUMBER];

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

  setEvalucacion(estado, evaluacion) {
    this.EstadoEntidad = parseInt(estado);
    this.EvaluacionEntidad = parseInt(evaluacion);
  }

  cargarEvaluacion() {
    this.transaccionIsNew = false;
    const entidad = this.dataSource.data[this.ROW_NUMBER];
    this.ENTIDAD = this.dataSource.data[this.ROW_NUMBER];
    this.EstadoEntidad = parseInt(entidad.Estado);
    this.EvaluacionEntidad = parseInt(entidad.Evaluacion);
    this.ComentarioEntidad = entidad.Comentario;
    this.Service.form.patchValue({ IdEntidad: entidad.IdEntidad });
    this.dialogTittle = 'Modificar';
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
      } else {
        this.errorService.handleError(result.error);
      }

    }, (error) => {
      this.errorService.handleError(error);
    });

  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.Service.form.reset();
    this.Service.InicializarValoresFormGroup();
    this.dialogTittle = 'Nuevo';
  }

  goToAsociciones() {
    const entidad = this.dataSource.data[this.ROW_NUMBER];  
    this.asociacionService.form.patchValue({
      IdEntidad1:entidad.IdEntidad,
      entidadSelecionada:entidad.Entidad
    });
    this.redirectToAsociacion();
  }

  public redirectToAsociacion = () => {
    const url = 'Asociacion';
    this.router.navigate([url]);

  }

  checkboxChange() {
    this.CountEntidad++;
    const entidad = this.dataSource.data[this.ROW_NUMBER];
    if (this.CountEntidad === 2) {
      this.redirectToAsociacion();
    }

  }

  applyFilter(filterValue: string) {
    console.log(filterValue.trim().toLowerCase());
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public redirectToRecursos = () => {
    const entidad = this.dataSource.data[this.ROW_NUMBER];
    const url = `EntidadRecurso/${entidad.IdEntidad}/${entidad.IdTipoEntidad}`;
    this.router.navigate([url]);
  }

}
