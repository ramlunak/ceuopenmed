import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../services/seguridad/auth.service';

import { EntidadRecursoService } from '../../services/entidad-recurso.service';
import { EntidadRecurso } from 'src/app/models/entidad-recurso';

import { IdiomaService } from '../../services/idioma.service';
import { Idioma } from 'src/app/models/idioma';

import { TipoEntidadService } from '../../services/tipo-entidad.service';
import { TipoEntidad } from 'src/app/models/tipo-entidad';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../services/error-handler.service';

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
  TIPO_ENTIDAD: string;

  // DataTable --
  dataSource: MatTableDataSource<EntidadRecurso>;
  displayedColumns = ['Idioma', 'Nivel', 'URL', 'isImage', 'Descripcion', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // Selects
  listIdiomas: Idioma[];
  listTiposEntidad: TipoEntidad[];
  // slide-toggle
  // @ViewChild('slideIsImage', { static: true }) mSTisImage: MatSlideToggle;

  constructor(
    private entidadRecursoService: EntidadRecursoService,
    private authService: AuthService,
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
    this.entidadRecursoService.form.patchValue({ IdEntidad: this.IdEntidad });
    this.CargarTipoEntidad();
    this.CargarSelects();
    this.CargarDgvElements();
  }

  CargarSelects() {
    // Idioma
    this.idiomaService.get().subscribe(result => {
      this.listIdiomas = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });

  }

  CargarTipoEntidad() {
    this.tipoEntidadService.view(this.IdTipoEntidad).subscribe(result => {
      this.TIPO_ENTIDAD = result.data.TipoEntidad;
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

  guardarClick() {

    if (this.transaccionIsNew) {
      this.entidadRecursoService.set().subscribe(result => {

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
      this.entidadRecursoService.update().subscribe(result => {

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
        IdIdioma: recurso.IdIdioma,
        IdEntidad: this.IdEntidad,
        Nivel: recurso.Nivel,
        URL: recurso.URL,
        IsImage: (recurso.IsImage.toString() === '1') ? true : false,
        Descripcion: recurso.Descripcion
      });
  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.entidadRecursoService.InicializarValoresFormGroup();
    this.entidadRecursoService.form.reset();
    this.entidadRecursoService.form.patchValue({ IdEntidad: this.IdEntidad });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}