import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { EntidadService } from '../../services/entidad';
import { Entidad } from 'src/app/models/entidad';

import { DetalleEntidadService } from '../../services/detalle-entidad';
import { DetalleEntidad } from 'src/app/models/detalle-entidad';

import { IdiomaService } from '../../services/idioma';
import { Idioma } from 'src/app/models/idioma';

import { TipoEntidadService } from '../../services/tipo-entidad';
import { TipoEntidad } from 'src/app/models/tipo-entidad';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-form-entidad',
  templateUrl: './form-entidad.component.html',
  styleUrls: ['./form-entidad.component.css']
})
export class FormEntidadComponent implements OnInit {

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
  displayedColumns = ['TipoEntidad', 'Idioma', 'Entidad', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listIdiomas: Idioma[];
  listTiposEntidad: TipoEntidad[];

  constructor(
    private Service: EntidadService,
    private detalleEntidadService: DetalleEntidadService,
    private idiomaService: IdiomaService,
    private tipoEntidadService: TipoEntidadService,
    private errorService: ErrorHandlerService
  ) { }

  ngOnInit() {
  
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';
    this.CargarDgvElements();
    this.CargarSelects();
    this.detalleEntidadService.InicializarValoresFormGroup();
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
    this.detalleEntidadService.get().subscribe(result => {
      this.dataSource = new MatTableDataSource<Entidad>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
    });

  }



  guardarClick() {
    
    if (this.transaccionIsNew) {
      this.detalleEntidadService.set().subscribe(result => {

        if (result.status === 1) {
          this.CargarDgvElements();
        } else {
          this.errorService.handleError(result.error);
        }

      }, (error) => {
        this.errorService.handleError(error);

      });
    } else {
      this.detalleEntidadService.update().subscribe(result => {

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
    this.detalleEntidadService.delete().subscribe(result => {

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
      });
    this.dialogTittle = 'Modificar';
  }

  setEvalucacion(estado, evaluacion) {
    this.EstadoEntidad = parseInt(estado, 11);
    this.EvaluacionEntidad = parseInt(evaluacion, 11);
  }

  cargarEvaluacion() {
    this.transaccionIsNew = false;
    const entidad = this.dataSource.data[this.ROW_NUMBER];
    this.ENTIDAD = this.dataSource.data[this.ROW_NUMBER];
    this.EstadoEntidad = parseInt(entidad.Estado, 11);
    this.EvaluacionEntidad = parseInt(entidad.Evaluacion, 11);
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
    this.detalleEntidadService.InicializarValoresFormGroup();    
  }

  applyFilter(filterValue: string) {
    console.log(filterValue.trim().toLowerCase());
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
