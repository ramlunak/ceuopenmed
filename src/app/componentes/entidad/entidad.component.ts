import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { EntidadService } from '../../services/entidad';
import { Entidad } from 'src/app/models/entidad';

import { IdiomaService } from '../../services/idioma';
import { Idioma } from 'src/app/models/idioma';

import { TipoEntidadService } from '../../services/tipo-entidad';
import { TipoEntidad } from 'src/app/models/tipo-entidad';

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
  ComentarioEntidad = null;
  ENTIDAD: Entidad;

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo';

  // DataTable --
  dataSource: MatTableDataSource<Entidad>;
  displayedColumns = ['select','IdEntidad', 'TipoEntidad', 'Idioma', 'Entidad',  'info', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listIdiomas: Idioma[];
  listTiposEntidad: TipoEntidad[];

  constructor(
    private Service: EntidadService,
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
    this.Service.get().subscribe(result => {
      this.dataSource = new MatTableDataSource<Entidad>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
    });

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
        TipoEntidad: entidad.TipoEntidad 
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
    this.Service.form.setValue(this.ENTIDAD);
  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.Service.form.reset();
    this.Service.InicializarValoresFormGroup();
    this.dialogTittle = 'Nuevo';
  }

  checkboxChange(entidad) {
   
  }

  applyFilter(filterValue: string) {
    console.log(filterValue.trim().toLowerCase());
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



}
