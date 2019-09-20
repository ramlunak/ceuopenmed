import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../services/seguridad/auth.service';

import { EntidadService } from '../../services/entidad.service';

import { DetalleEntidadService } from '../../services/detalle-entidad.service';
import { DetalleEntidad } from 'src/app/models/detalle-entidad';

import { IdiomaService } from '../../services/idioma.service';
import { Idioma } from 'src/app/models/idioma';

import { TipoEntidadService } from '../../services/tipo-entidad.service';
import { Entidad } from 'src/app/models/entidad';
import { TipoEntidad } from 'src/app/models/tipo-entidad';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../services/error-handler.service';


@Component({
  selector: 'app-form-entidad',
  templateUrl: './form-entidad.component.html',
  styleUrls: ['./form-entidad.component.css']
})
export class FormEntidadComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo';
  IdEntidad: number;
  IdTipoEntidad: number;
  TIPO_ENTIDAD: string;
  ENTIDAD: Entidad;

  // DataTable --
  dataSource: MatTableDataSource<DetalleEntidad>;
  displayedColumns = ['Idioma', 'Entidad', 'Nivel', 'isImage', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listIdiomas: Idioma[];
  listTiposEntidad: TipoEntidad[];

  constructor(
    private entidadService: EntidadService,
    private authService: AuthService,
    private detalleEntidadService: DetalleEntidadService,
    private idiomaService: IdiomaService,
    private tipoEntidadService: TipoEntidadService,
    private errorService: ErrorHandlerService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';
    this.IdEntidad = this.activeRoute.snapshot.params.idEntidad;
    this.IdTipoEntidad = this.activeRoute.snapshot.params.idTipoEntidad;
    this.detalleEntidadService.form.patchValue({ IdEntidad: this.IdEntidad });
    this.CargarDgvElements();
    this.CargarExtraInfo();
    this.CargarSelects();
  }

  CargarSelects() {
    // Idioma
    this.idiomaService.get().subscribe(result => {
      this.listIdiomas = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });

  }

  CargarExtraInfo() {
    // Tipo Entidad
    this.tipoEntidadService.view(this.IdTipoEntidad).subscribe(result => {
      this.TIPO_ENTIDAD = result.data.TipoEntidad;
    }, (error) => {
      this.errorService.handleError(error);
    });
    // Entidad
    this.entidadService.view(this.IdEntidad).subscribe(result => {
      this.ENTIDAD = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }


  CargarDgvElements() {
    this.entidadService.viewDetalle(this.IdEntidad).subscribe(result => {
      this.dataSource = new MatTableDataSource<DetalleEntidad>(result.data);
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
      this.detalleEntidadService.set().subscribe(result => {

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
      this.detalleEntidadService.update().subscribe(result => {

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
    this.detalleEntidadService.delete().subscribe(result => {

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
    const detalle = this.dataSource.data[this.ROW_NUMBER];
    this.detalleEntidadService.form.patchValue(
      {
        IdRecurso: detalle.IdRecurso,
        IdIdioma: detalle.IdIdioma,
        IdEntidad: this.IdEntidad,
        Entidad: detalle.Entidad,
        Referencia: detalle.Referencia,
        IsImage: (detalle.IsImage.toString() === '1') ? true : false,
        Nivel: detalle.Nivel
      });
  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.detalleEntidadService.InicializarValoresFormGroup();
    this.detalleEntidadService.form.reset();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
