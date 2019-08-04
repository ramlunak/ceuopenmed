import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { SegRolService } from '../../../services/seguridad/seg-rol.service';
import { SegRol } from 'src/app/models/Seguridad/seg-rol';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';


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

    const formData = this.rolService.form.value;

    if (this.transaccionIsNew) {
      this.rolService.setRol(formData.Rol).subscribe(result => {

        if (result.status === 1) {
          this.CargarDgvElements();
        } else {
          this.errorService.handleError(result.error);
        }

      }, (error) => {
        this.errorService.handleError(error);
      });
    } else {
      this.rolService.updateRol(formData.IdRol, formData.Rol).subscribe(result => {

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
    const formData = this.rolService.form.value;
    this.rolService.deleteRol(formData.IdRol).subscribe(result => {

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
    const rol = this.dataSource.data[this.ROW_NUMBER];
    this.rolService.form.patchValue({ IdRol: rol.IdRol, Rol: rol.Rol });
    this.dialogTittle = 'Modificar Rol';
  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.rolService.form.reset();
    this.rolService.InicializarValoresFormGroup();
    this.dialogTittle = 'Nuevo Rol';
  }

}
