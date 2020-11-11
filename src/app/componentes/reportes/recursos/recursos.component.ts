
import { isNullOrUndefined } from 'util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../services/seguridad/auth.service';

import { EntidadRecursoService } from '../../../services/entity/entidad-recurso.service';
import { EntidadRecurso, EntidadRecursoReporte } from 'src/app/models/entidad-recurso';
import { TipoEntidadService } from '../../../services/administracion/tipo-entidad.service';
import { TipoEntidad } from 'src/app/models/tipo-entidad';
import { MatDialog } from '@angular/material/dialog';
import { EntidadRecursoDescripcionComponent } from '../entidad-recurso-descripcion/entidad-recurso-descripcion.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EntidadService } from '../../../services/entity/entidad.service';
import { Entidad } from 'src/app/models/entidad';
// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.css']
})
export class RecursosComponent implements OnInit {

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
  displayedColumns = ['IdRecurso', 'Nivel', 'URL'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // Selects
  listRecursosReporte: EntidadRecursoReporte[] = [];
  listTiposEntidad: TipoEntidad[];
  EntidadIdEStudiante: number;
  ParametroBusqueda: string;

  constructor(
    private entidadService: EntidadService,
    private entidadRecursoService: EntidadRecursoService,
    private authService: AuthService,
    private tipoEntidadService: TipoEntidadService,
    private errorService: ErrorHandlerService,
    private router: Router,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private excelService: ExcelService,
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
    this.ParametroBusqueda = this.activeRoute.snapshot.params.parametroBusqueda;
    this.EntidadIdEStudiante = this.activeRoute.snapshot.params.IdEstudiante;
    this.EvaluacionEntidad = this.activeRoute.snapshot.params.EvaluacionEntidad;
    this.entidadRecursoService.form.patchValue({ IdEntidad: this.IdEntidad });

    this.CargarDgvElements();
  }

  CargarDgvElements() {
    this.entidadRecursoService.get().subscribe(result => {
      this.dataSource = new MatTableDataSource<EntidadRecurso>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  Descargar() {
    this.dataSource.data.forEach(item => {

      if (item.IsImage.toString() === '0') {
        var entidadRecurso = {
          IdRecurso: item.IdRecurso,
          IdEntidad: item.IdEntidad,
          Nivel: item.Nivel,
          URL: item.URL
        };
        this.listRecursosReporte.push(entidadRecurso);
      }
    });

    this.excelService.exportAsExcelFile(this.listRecursosReporte, 'Recursos');
  }

}
