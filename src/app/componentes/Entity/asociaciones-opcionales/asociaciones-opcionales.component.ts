import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../services/seguridad/auth.service';

import { EntidadService } from '../../../services/entity/entidad.service';

import { DetalleEntidadService } from '../../../services/entity/detalle-entidad.service';
import { DetalleEntidad } from 'src/app/models/detalle-entidad';

import { IdiomaService } from '../../../services/administracion/idioma.service';
import { Idioma } from 'src/app/models/idioma';

import { TipoEntidadService } from '../../../services/administracion/tipo-entidad.service';
import { Entidad } from 'src/app/models/entidad';
import { TipoEntidad } from 'src/app/models/tipo-entidad';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormBuilder, FormGroup} from '@angular/forms';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

import {FormControl} from '@angular/forms';

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};


@Component({
  selector: 'app-asociaciones-opcionales',
  templateUrl: './asociaciones-opcionales.component.html',
  styleUrls: ['./asociaciones-opcionales.component.css']
})
export class AsociacionesOpcionalesComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo';
  IdEntidad: number;
  IdTipoEntidad: number;
  EvaluacionEntidad: number;
  TIPO_ENTIDAD: string;
  ENTIDAD: Entidad;
  
  // DataTable --
  dataSource: MatTableDataSource<DetalleEntidad>;
  displayedColumns = ['Idioma', 'Entidad', 'Nivel', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listIdiomas: Idioma[];
  listTiposEntidad: TipoEntidad[];

//AUTOCOMPLETE
myControl = new FormControl();
options: string[] = [];
filteredOptions: Observable<string[]>;

private _filter(value: string): string[] {  
  const filterValue = value.toLowerCase();
  return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
}

//--------------

  constructor(
    private _formBuilder: FormBuilder,
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
   // this.IdEntidad = this.activeRoute.snapshot.params.idEntidad;
   // this.IdTipoEntidad = this.activeRoute.snapshot.params.idTipoEntidad;
   // this.EvaluacionEntidad = this.activeRoute.snapshot.params.EvaluacionEntidad;
   // this.detalleEntidadService.form.patchValue({ IdEntidad: this.IdEntidad });
   // this.CargarDgvElements();
  //  this.CargarExtraInfo();
   this.CargarSelects();

     this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
     );
  }
 

 
  
  CargarSelects() {
   
      // Tipo Entidad
      this.tipoEntidadService.get().subscribe(result => {
        this.listTiposEntidad = result.data;
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

  change(event){
    this.options = [];
    this.entidadService.actionEntidadEvaluadaByIdTipoEntidad(event.value).subscribe(result => {
           result.data.forEach(element => {     
        this.options.push(element.Entidad);
      });
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
        Nivel: detalle.Nivel
      });
  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.detalleEntidadService.InicializarValoresFormGroup();
    this.detalleEntidadService.form.reset();
    this.detalleEntidadService.form.patchValue({ IdEntidad: this.IdEntidad });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
