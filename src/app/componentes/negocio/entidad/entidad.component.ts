import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { NegEntidadService } from '../../../services/negocio/neg-Entidad.service';
import { NegEntidad } from 'src/app/models/negocio/neg-Entidad';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

@Component({
  selector: 'app-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.css']
})

export class EntidadComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nueva Entidad';
  
  // DataTable --
  dataSource: MatTableDataSource<NegEntidad>;
  displayedColumns = ['IdEntidad','Entidad','info','commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private _router: Router,private Service: NegEntidadService, private errorService: ErrorHandlerService) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';
    this.CargarDgvElements();   
  }

  CargarDgvElements() {
     this.Service.getEntidades().subscribe(result => {
       this.dataSource = new MatTableDataSource<NegEntidad>(result.data);     
      this.dataSource.paginator = this.paginator;
     }, (error) => {
       this.errorService.handleError(error);
     });
      
  }

  applyFilter(filterValue: string) {
    console.log(filterValue.trim().toLowerCase());
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  guardarClick() {

    const formData = this.Service.form.value;

    if (this.transaccionIsNew) {
      this.Service.setEntidad(formData.Grupo).subscribe(result => {

        if (result.status === 1) {
          this.CargarDgvElements();
        } else {
          this.errorService.handleError(result.error);
        }

      }, (error) => {
        this.errorService.handleError(error);
      });
    } else {
      this.Service.updateEntidad(formData.IdGrupo, formData.Grupo).subscribe(result => {

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
    const formData = this.Service.form.value;
    this.Service.deleteEntidad(formData.IdGrupo).subscribe(result => {

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
    this.Service.form.patchValue({ Id: entidad.IdEntidad });
    this.dialogTittle = 'Modificar Entidad';
  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.Service.form.reset();
    this.Service.InicializarValoresFormGroup();
    this.dialogTittle = 'Nueva Entidad';
  }
  
  goTo(value) {
    this._router.navigate([value]);
  }
  
}
