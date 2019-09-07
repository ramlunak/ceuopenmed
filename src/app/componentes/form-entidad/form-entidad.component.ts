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
import { Server } from 'net';

@Component({
  selector: 'app-form-entidad',
  templateUrl: './form-entidad.component.html',
  styleUrls: ['./form-entidad.component.css']
})
export class FormEntidadComponent implements OnInit {

  // para cargar evaluacion
  EstadoEntidad = 0;
  isImage:boolean;
  EvaluacionEntidad = 0;
  ComentarioEntidad = null;
  ENTIDAD: DetalleEntidad;

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo';

  // DataTable --
  dataSource: MatTableDataSource<DetalleEntidad>;
  displayedColumns = ['Idioma', 'Entidad','Nivel','isImage', 'commands'];
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
    this.CargarTipoEntidad();
  }

  CargarSelects() {
    // Idioma
    this.idiomaService.get().subscribe(result => {
      this.listIdiomas = result.data;
    });
       
  }

  CargarTipoEntidad() {
    // Idioma
    this.tipoEntidadService.view(this.Service.form.value.IdTipoEntidad).subscribe(result => {
      this.detalleEntidadService.form.patchValue({
        TipoEntidad :  result.data.TipoEntidad
      }) ;
    });
       
  }


  CargarDgvElements() {
    this.Service.viewDetalle(this.Service.form.value.IdEntidad).subscribe(result => {
      this.dataSource = new MatTableDataSource<DetalleEntidad>(result.data);
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
    const DetalleEntidad = this.dataSource.data[this.ROW_NUMBER];
    this.detalleEntidadService.form.patchValue(
      {        	
        IdRecurso:DetalleEntidad.IdRecurso,
        IdIdioma:DetalleEntidad.IdIdioma,
        Entidad:DetalleEntidad.Entidad,
        Referencia:DetalleEntidad.Referencia,
        Nivel:DetalleEntidad.Nivel,
        IdEntidad:this.Service.form.value.IdEntidad,
        IdTipoEntidad:this.Service.form.value.IdTipoEntidad,
      });
      if(DetalleEntidad.IsImage == 0)
      this.isImage = false;
      else{
        this.isImage = true;
      } 
    this.dialogTittle = 'Modificar';
  }

  
  setOperationsDataEliminar() {
   
    const DetalleEntidad = this.dataSource.data[this.ROW_NUMBER];
    this.detalleEntidadService.form.patchValue(
      {        	
        IdRecurso:DetalleEntidad.IdRecurso      
      });     
  }

  setEvalucacion(estado, evaluacion) {
    this.EstadoEntidad = parseInt(estado, 11);
    this.EvaluacionEntidad = parseInt(evaluacion, 11);
  }

  Limpiar() {
    this.transaccionIsNew = true;   
    this.detalleEntidadService.InicializarValoresFormGroup();    
  }

  isImageChage() {
    this.isImage = !this.isImage;    
    if(this.isImage)
    {
    this.detalleEntidadService.form.patchValue({
      IsImage:1
    });
  
  }
    else
    {
    this.detalleEntidadService.form.patchValue({
      IsImage:0
    });}
  }

  applyFilter(filterValue: string) {
    console.log(filterValue.trim().toLowerCase());
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}