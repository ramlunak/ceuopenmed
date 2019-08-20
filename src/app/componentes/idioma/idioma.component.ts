import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { IdiomaService } from '../../services/idioma';
import { Idioma } from 'src/app/models/idioma';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../services/error-handler.service';


@Component({
  selector: 'app-idioma',
  templateUrl: './idioma.component.html',
  styleUrls: ['./idioma.component.css']
})

export class IdiomaComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo';
  
  // DataTable --
  dataSource: MatTableDataSource<Idioma>;
  displayedColumns = ['IdIdioma', 'Idioma', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private Service: IdiomaService, private errorService: ErrorHandlerService) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';
    this.CargarDgvElements();   
  }

  CargarDgvElements() {
     this.Service.get().subscribe(result => {
       this.dataSource = new MatTableDataSource<Idioma>(result.data);     
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
    const Idioma = this.dataSource.data[this.ROW_NUMBER];
    this.Service.form.patchValue({ IdIdioma: Idioma.IdIdioma, Idioma: Idioma.Idioma });
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
