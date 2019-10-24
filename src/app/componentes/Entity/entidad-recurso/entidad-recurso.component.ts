import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../services/seguridad/auth.service';

import { EntidadRecursoService } from '../../../services/entity/entidad-recurso.service';
import { EntidadRecurso } from 'src/app/models/entidad-recurso';
import { TipoEntidadService } from '../../../services/administracion/tipo-entidad.service';
import { TipoEntidad } from 'src/app/models/tipo-entidad';
import { MatDialog } from '@angular/material/dialog';
import { EntidadRecursoDescripcionComponent } from '../entidad-recurso-descripcion/entidad-recurso-descripcion.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EntidadService } from '../../../services/entity/entidad.service';
import { Entidad } from 'src/app/models/entidad';
// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

@Component({
  selector: 'app-entidad-recurso',
  templateUrl: './entidad-recurso.component.html',
  styleUrls: ['./entidad-recurso.component.css']
})
export class EntidadRecursoComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo';
  IdEntidad: number;
  IdTipoEntidad: number;
  EvaluacionEntidad: number;
  TIPO_ENTIDAD: string;
  ENTIDAD: Entidad;
  // DataTable --
  dataSource: MatTableDataSource<EntidadRecurso>;
  displayedColumns = ['Nivel', 'URL', 'isImage', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // Selects
  listTiposEntidad: TipoEntidad[];

  constructor(
    private entidadService: EntidadService,
    private entidadRecursoService: EntidadRecursoService,
    private authService: AuthService,
    private tipoEntidadService: TipoEntidadService,
    private errorService: ErrorHandlerService,
    private router: Router,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';
    this.IdEntidad = this.activeRoute.snapshot.params.idEntidad;
    this.IdTipoEntidad = this.activeRoute.snapshot.params.idTipoEntidad;
    this.EvaluacionEntidad = this.activeRoute.snapshot.params.EvaluacionEntidad;
    this.entidadRecursoService.form.patchValue({ IdEntidad: this.IdEntidad });
    this.CargarTipoEntidad();
    this.CargarDgvElements();
  }

  CargarTipoEntidad() {
    this.tipoEntidadService.view(this.IdTipoEntidad).subscribe(result => {
      this.TIPO_ENTIDAD = result.data.TipoEntidad;
    }, (error) => {
      this.errorService.handleError(error);
    });

    this.entidadService.view(this.IdEntidad).subscribe(result => {
      this.ENTIDAD = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });

  }

  CargarDgvElements() {
    this.entidadRecursoService.getByEntidad().subscribe(result => {
      this.dataSource = new MatTableDataSource<EntidadRecurso>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
      this.router.navigateByUrl('entidad');
    });
  }

  ActualizarEstadoEntidad() {
    this.ENTIDAD.Estado = '0';
    this.entidadService.form.patchValue(this.ENTIDAD);
    this.entidadService.update().subscribe(result => {
      if (result.status === 1) {
        // this.CargarDgvElements();
      } else {
        this.errorService.handleError(result.error);
      }

    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  guardarClick() {

    if (this.transaccionIsNew) {
      this.entidadRecursoService.set().subscribe(result => {

        if (result.status === 1) {
          this.ActualizarEstadoEntidad();
          this.CargarDgvElements();
        } else {
          this.errorService.handleError(result.error);

        }
        this.Limpiar();
      }, (error) => {
        this.errorService.handleError(error);

      });
    } else {
      this.entidadRecursoService.update().subscribe(result => {

        if (result.status === 1) {
          this.ActualizarEstadoEntidad();
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
    this.entidadRecursoService.delete().subscribe(result => {

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
    const recurso = this.dataSource.data[this.ROW_NUMBER];
    this.entidadRecursoService.form.patchValue(
      {
        IdRecurso: recurso.IdRecurso,
        IdEntidad: this.IdEntidad,
        Nivel: recurso.Nivel,
        URL: recurso.URL,
        IsImage: (recurso.IsImage.toString() === '1') ? true : false
      });
  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.entidadRecursoService.InicializarValoresFormGroup();
    this.entidadRecursoService.form.reset();
    this.entidadRecursoService.form.patchValue({ IdEntidad: this.IdEntidad, IsImage: false });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogDescripcion(): void {
    const recurso = this.dataSource.data[this.ROW_NUMBER];

    const dialogRefDescrip = this.dialog.open(EntidadRecursoDescripcionComponent, {
      width: '1200px',
      data: recurso
    });

    dialogRefDescrip.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(result.OK, 'OK', {
          duration: 8000,
        });
      }

    });
  }

}
