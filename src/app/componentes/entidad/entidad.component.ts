import { Component, OnInit, ViewChild } from '@angular/core';

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

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo';
  
  // DataTable --
  dataSource: MatTableDataSource<Entidad>;
  displayedColumns = ['IdEntidad', 'Entidad','Evaluacion','Estado','info', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listIdiomas: Idioma[];
  listTiposEntidad: TipoEntidad[];

  constructor(
    private Service: EntidadService,
    private IdiomaService: IdiomaService, 
    private TipoEntidadService: TipoEntidadService, 
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
  }

  CargarSelects() {
    //Idioma
       this.IdiomaService.get().subscribe(result => {
       this.listIdiomas = result.data;
    });
    //Tipo Entidad
    this.TipoEntidadService.get().subscribe(result => {
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



  guardarClick() {

    if (this.transaccionIsNew) {
      this.Service.set().subscribe(result => {

        if (result.status === 1) {
          this.CargarDgvElements();
        } else {          
          this.errorService.handleError(result.error);
        }

      }, (error) => {

        //{"status":0,"error_code":400,"errors":{"Estado":["Estado debe ser un n\u00famero entero."],
        //"IdProfesor":["El profesor que seleccion\u00f3 no existe en la Base de Datos del Sistema."]}}
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
    const Entidad = this.dataSource.data[this.ROW_NUMBER];
    this.Service.form.patchValue({ IdEntidad: Entidad.IdEntidad, Entidad: Entidad.Entidad });
    this.dialogTittle = 'Modificar';
  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.Service.form.reset();
    this.Service.InicializarValoresFormGroup();
    this.dialogTittle = 'Nuevo';
  }

  applyFilter(filterValue: string) {
    console.log(filterValue.trim().toLowerCase());
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  
}
