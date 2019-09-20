import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { SegRolService } from '../../../services/seguridad/seg-rol.service';
import { SegRol } from 'src/app/models/Seguridad/seg-rol';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

// Selector jQuery
declare var $: any;


@Component({
  selector: 'app-seg-rol',
  templateUrl: './seg-rol.component.html',
  styleUrls: ['./seg-rol.component.css']
})
export class SegRolComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo Rol';

  // DataTable --
  dataSource: MatTableDataSource<SegRol>;
  displayedColumns = ['IdRol', 'Rol', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private rolService: SegRolService, private errorService: ErrorHandlerService) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';
    this.CargarDgvElements();
  }

  CargarDgvElements() {
    this.rolService.getRoles().subscribe(result => {
      this.dataSource = new MatTableDataSource<SegRol>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  guardarClick() {

    if (this.transaccionIsNew) {
      this.rolService.setRol().subscribe(result => {

        if (result.status === 1) {
          this.CargarDgvElements();
        } else {
          this.errorService.handleError(result.error);
        }
        this.Limpiar();
      }, (error) => {
        this.errorService.handleError(error);
      });
    } else {
      this.rolService.updateRol().subscribe(result => {

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
    this.rolService.deleteRol().subscribe(result => {

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
    const rol = this.dataSource.data[this.ROW_NUMBER];
    this.rolService.form.patchValue({ IdRol: rol.IdRol, Rol: rol.Rol });
    this.dialogTittle = 'Modificar Rol';
  }

  Limpiar() {
    this.rolService.InicializarValoresFormGroup();
    this.rolService.form.reset();
    if (!this.transaccionIsNew) {
      this.transaccionIsNew = true;
      this.dialogTittle = 'Nuevo Rol';
      $('#OperationModalDialog').modal('hide');
    }
  }

}
