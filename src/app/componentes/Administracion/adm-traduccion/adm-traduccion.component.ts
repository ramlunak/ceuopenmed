import { AdmTraduccionService } from './../../../services/administracion/adm-traduccion.service';
import { Idioma } from './../../../models/idioma';
import { IdiomaService } from './../../../services/idioma.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DocProfesorService } from 'src/app/services/docencia/doc-profesor.service';
import { DocGrupo } from 'src/app/models/Docencia/doc-grupo';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { AdmTraduccion } from 'src/app/models/Administracion/adm-traduccion';

@Component({
  selector: 'app-adm-traduccion',
  templateUrl: './adm-traduccion.component.html',
  styleUrls: ['./adm-traduccion.component.css']
})
export class AdmTraduccionComponent implements OnInit {

  ROW_NUMBER: number;
  dialogTittle = 'Nuevo';
  NombreTabla: string;
  NombreRegistro: string;
  IdProfesor: number;

  // DataTable --
  dataSource: MatTableDataSource<AdmTraduccion>;
  displayedColumns = ['Idioma', 'Traduccion', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // Selects
  listaIdiomas: Idioma[];
  Tabla: string;
  IdTabla: number;

  constructor(
    private service: AdmTraduccionService,
    private profesorService: DocProfesorService,
    private idiomaService: IdiomaService,
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

    this.Tabla = this.activeRoute.snapshot.params.tabla;
    this.IdTabla = this.activeRoute.snapshot.params.idTabla;
    this.NombreRegistro = this.activeRoute.snapshot.params.nombreRegistro;

    this.GetTableInfo(this.Tabla, this.IdTabla);
    this.CargarDgvElements();
    this.CargarSelects();


    /*     this.profesorService.viewProfesor(this.IdProfesor).subscribe(result => {

          if (result.status === 1) {
            this.NombreProfesor = result.data.NombreCompleto;
            this.CargarDgvElements();
            this.CargarSelects();
            this.profesorService.formGrupos.patchValue({ IdProfesor: this.IdProfesor });
          } else {
            this.errorService.handleError(result.error);
          }

        }, (error) => {
          this.errorService.handleError(error);
        }); */

  }

  CargarDgvElements() {
    this.service.get(this.Tabla, this.IdTabla).subscribe(result => {
      this.dataSource = new MatTableDataSource<AdmTraduccion>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  CargarSelects() {
    this.idiomaService.get().subscribe(result => {
      this.listaIdiomas = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  guardarClick() {
    this.service.form.patchValue({
      Tabla: 'TipoAsociacion',
      IdTabla: this.IdTabla
    });

    this.service.set().subscribe(result => {
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

  eliminarClick() {
    this.service.delete().subscribe(result => {

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
    const traduccion = this.dataSource.filteredData[this.ROW_NUMBER];
    this.service.form.patchValue({ IdTraduccion: traduccion.IdTraduccion });
  }

  Limpiar() {
    this.service.InicializarValoresFormGroup();
    this.service.form.reset();
    this.CargarSelects();
  }

  public redirectToTipoAsocicion = () => {
    this.router.navigateByUrl('TipoAsociacion');
  }

  GetTableInfo(table: string, idTable: number) {
    if (table === 'TipoAsociacion') {
      this.NombreTabla = 'Tipo de Asociacion';
    }
  }


}
