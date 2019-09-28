import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../services/seguridad/auth.service';

import { EntidadRecursoService } from '../../../services/entity/entidad-recurso.service';
import { EntidadRecurso } from 'src/app/models/entidad-recurso';

import { IdiomaService } from '../../../services/administracion/idioma.service';
import { Idioma } from 'src/app/models/idioma';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { EntidadRecursoDescripcionService } from 'src/app/services/entity/entidad-recurso-descripcion.service';
import { EntidadRecursoDescripcion } from 'src/app/models/entidad-recurso-descripcion';


@Component({
  selector: 'app-entidad-recurso-descripcion',
  templateUrl: './entidad-recurso-descripcion.component.html',
  styleUrls: ['./entidad-recurso-descripcion.component.css']
})
export class EntidadRecursoDescripcionComponent implements OnInit {

  transaccionIsNewDescripcion = true;
  ROW_NUMBER_DES: number;
  RECURSO: EntidadRecurso;

  // DataTable --
  dataSourceDescripcion: MatTableDataSource<EntidadRecursoDescripcion>;
  displayedColumnsDescripcion = ['Idioma', 'Descripcion', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginatorDescripcion: MatPaginator;
  // Selects
  listIdiomas: Idioma[];

  constructor(
    public dialogRefDescrip: MatDialogRef<EntidadRecursoDescripcionComponent>,
    @Inject(MAT_DIALOG_DATA) public recurso: EntidadRecurso,
    private errorService: ErrorHandlerService,
    private entidadRecursoDescripcionService: EntidadRecursoDescripcionService,
    private authService: AuthService,
    private idiomaService: IdiomaService
  ) {
    this.RECURSO = recurso;
    this.entidadRecursoDescripcionService.form.patchValue({ IdRecurso: recurso.IdRecurso });
    this.CargarSelects();
    this.CargarDgvElements();
  }

  ngOnInit() {
    this.paginatorDescripcion._intl.itemsPerPageLabel = 'Registros por página';
    this.paginatorDescripcion._intl.previousPageLabel = 'Anterior';
    this.paginatorDescripcion._intl.nextPageLabel = 'Siguiente';
    this.paginatorDescripcion._intl.firstPageLabel = 'Primero';
    this.paginatorDescripcion._intl.lastPageLabel = 'Último';
  }

  onNoClick(): void {
    this.dialogRefDescrip.close();
  }

  onOKClick() {
    this.dialogRefDescrip.close({ OK: 'Listo.' });
    this.LimpiarDescripcion();
  }

  CargarSelects() {
    // Idioma
    this.idiomaService.get().subscribe(result => {
      this.listIdiomas = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });

  }

  CargarDgvElements() {
    this.entidadRecursoDescripcionService.getByRecurso().subscribe(result => {
      this.dataSourceDescripcion = new MatTableDataSource<EntidadRecursoDescripcion>(result.data);
      this.dataSourceDescripcion.paginator = this.paginatorDescripcion;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  guardarDescripcionClick() {

    if (this.transaccionIsNewDescripcion) {
      this.entidadRecursoDescripcionService.set().subscribe(result => {

        if (result.status === 1) {
          this.CargarDgvElements();
        } else {
          this.errorService.handleError(result.error);

        }
        this.LimpiarDescripcion();
      }, (error) => {
        this.errorService.handleError(error);

      });
    } else {
      this.entidadRecursoDescripcionService.update().subscribe(result => {

        if (result.status === 1) {
          this.CargarDgvElements();
        } else {
          this.errorService.handleError(result.error);
        }
        this.LimpiarDescripcion();
      }, (error) => {
        this.errorService.handleError(error);
      });
    }

  }

  eliminarDescripcionClick() {
    this.entidadRecursoDescripcionService.delete().subscribe(result => {

      if (result.status === 1) {
        this.CargarDgvElements();
      } else {
        this.errorService.handleError(result.error);
      }
      this.LimpiarDescripcion();
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  setOperationsDescripcionData() {
    this.transaccionIsNewDescripcion = false;
    const recurso = this.dataSourceDescripcion.data[this.ROW_NUMBER_DES];
    this.entidadRecursoDescripcionService.form.patchValue(
      {
        IdRecursoDescripcion: recurso.IdRecursoDescripcion,
        IdRecurso: recurso.IdRecurso,
        IdIdioma: recurso.IdIdioma,
        Descripcion: recurso.Descripcion
      });
  }

  LimpiarDescripcion() {
    this.transaccionIsNewDescripcion = true;
    this.entidadRecursoDescripcionService.InicializarValoresFormGroup();
    this.entidadRecursoDescripcionService.form.reset();
    this.entidadRecursoDescripcionService.form.patchValue({ IdRecurso: this.RECURSO.IdRecurso });
  }

  applyFilterDescripcion(filterValue: string) {
    this.dataSourceDescripcion.filter = filterValue.trim().toLowerCase();
  }


}
