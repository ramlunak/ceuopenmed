import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Asociacion } from '../models/asociacion';
import { DetalleEntidad } from '../models/detalle-entidad';
import { Entidad } from '../models/entidad';
import { EntidadRecurso } from '../models/entidad-recurso';
import { Idioma } from '../models/idioma';
import { TipoAsociacion } from '../models/tipo-asociacion';
import { TipoEntidad } from '../models/tipo-entidad';
import { IdiomaService } from '../services/administracion/idioma.service';
import { TipoAsociacionService } from '../services/administracion/tipo-asociacion.service';
import { TipoEntidadService } from '../services/administracion/tipo-entidad.service';
import { AsociacionService } from '../services/entity/asociacion.service';
import { DetalleEntidadService } from '../services/entity/detalle-entidad.service';
import { EntidadRecursoService } from '../services/entity/entidad-recurso.service';
import { EntidadService } from '../services/entity/entidad.service';
import { ExcelService } from '../services/excel.service';
import { AuthService } from '../services/seguridad/auth.service';
import { AppConstantsService } from '../utils/app-constants.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  isAdmin: boolean;
  isProf: boolean;

  dataSourceTipoEntidad: MatTableDataSource<TipoEntidad>;
  dataSourceTipoAsociacion: MatTableDataSource<TipoAsociacion>;
  dataSourceIdioma: MatTableDataSource<Idioma>;
  dataSourceAsociacion: MatTableDataSource<Asociacion>;
  dataSourceEntidad: MatTableDataSource<Entidad>;
  dataSourceDetalleEntidad: MatTableDataSource<DetalleEntidad>;
  dataSourceEntidadRecurso: MatTableDataSource<EntidadRecurso>;

  constructor(
    private authService: AuthService,
    private CONSTANS: AppConstantsService,
    private excelService: ExcelService,
    private tipoEntidadService: TipoEntidadService,
    private tipoAsociacionService: TipoAsociacionService,
    public idiomaService: IdiomaService,
    private asociacionService: AsociacionService,
    public entidadService: EntidadService,
    private detalleEntidadService: DetalleEntidadService,
    private entidadRecursoService: EntidadRecursoService
  ) { }


  ngOnInit() {
    const roles = this.CONSTANS.getRoles();
    this.isAdmin = (this.authService.currentUser.IdRol === roles.Administrador);
    this.isProf = (this.authService.currentUser.IdRol === roles.Profesor);
  }

  CargarDgvElementsTipoEntidad() {
    this.tipoEntidadService.get().subscribe(result => {
      this.dataSourceTipoEntidad = new MatTableDataSource<TipoEntidad>(result.data);
      this.CargarDgvElementsTipoAsociacion();
    }, (error) => {
      this.CargarDgvElementsTipoAsociacion();
    });
  }

  CargarDgvElementsTipoAsociacion() {
    this.tipoAsociacionService.get().subscribe(result => {
      this.dataSourceTipoAsociacion = new MatTableDataSource<TipoAsociacion>(result.data);
      this.CargarDgvElementsIdioma();
    }, (error) => {
      this.CargarDgvElementsIdioma();
    });
  }

  CargarDgvElementsIdioma() {
    this.idiomaService.get().subscribe(result => {
      this.dataSourceIdioma = new MatTableDataSource<Idioma>(result.data);
      this.CargarDgvElementsAsociacion();
    }, (error) => {
      this.CargarDgvElementsAsociacion();
    });
  }

  CargarDgvElementsAsociacion() {
    this.asociacionService.get().subscribe(result => {
      this.dataSourceAsociacion = new MatTableDataSource<Asociacion>(result.data);
      this.CargarDgvElementsEntidad();
    }, (error) => {
      this.CargarDgvElementsEntidad();
    });
  }

  CargarDgvElementsEntidad() {
    this.entidadService.get().subscribe(result => {
      this.dataSourceEntidad = new MatTableDataSource<Entidad>(result.data);
      this.CargarDgvElementsDetalleEntidad();
    }, (error) => {
      this.CargarDgvElementsDetalleEntidad();
    });

  }

  CargarDgvElementsDetalleEntidad() {
    this.detalleEntidadService.get().subscribe(result => {
      this.dataSourceDetalleEntidad = new MatTableDataSource<DetalleEntidad>(result.data);
      this.CargarDgvElements();
    }, (error) => {
      this.CargarDgvElements();
    });
  }

  CargarDgvElements() {
    this.entidadRecursoService.get().subscribe(result => {
      this.dataSourceEntidadRecurso = new MatTableDataSource<EntidadRecurso>(result.data);
      this.exportAll();
    }, (error) => {
      this.exportAll();
    });
  }

  CargarDatosReporteYExportar() {
    this.CargarDgvElementsTipoEntidad();
  }


  exportAll() {

    this.excelService.exportAllExcelFile('Reportes',
      this.dataSourceTipoEntidad.data,
      this.dataSourceTipoAsociacion.data,
      this.dataSourceIdioma.data,
      this.dataSourceAsociacion.data,
      this.dataSourceEntidad.data,
      this.dataSourceDetalleEntidad.data,
      this.dataSourceEntidadRecurso.data);
  }

}
