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

import { AsociacionMultipleService } from '../../../services/entity/asociacion-multiple';
import { AsociacionMultiple } from 'src/app/models/asociacion-multiple';

import { TipoAsociacionMultipleService } from '../../../services/administracion/tipo-asociacion-multiple.service';


import { TipoEntidadService } from '../../../services/administracion/tipo-entidad.service';
import { Entidad } from 'src/app/models/entidad';
import { TipoEntidad } from 'src/app/models/tipo-entidad';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormBuilder, FormGroup} from '@angular/forms';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

import {FormControl} from '@angular/forms';
import { Asociacion } from 'src/app/models/asociacion';

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
  IdAsociacion: number;
  IdEntidad: number;
  IdEntidadSelected: string;
  IdTipoEntidad: number;
  EvaluacionEntidad: number;
  TIPO_ENTIDAD: string;
  ENTIDAD: Entidad;
  
  // DataTable --
  dataSource: MatTableDataSource<AsociacionMultiple>;
  displayedColumns = ['IdAsociacionMultiple', 'Entidad','TipoAsociacion', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listIdiomas: Idioma[];
  listTiposEntidad: TipoEntidad[];
  listEntidad: Entidad[];
  listTipoAsociacion: AsociacionMultiple[];

//AUTOCOMPLETE
myControl = new FormControl();
options: string[] = [];
values: string[] = [];
filteredOptions: Observable<string[]>;

private _filter(value: string): string[] {  
  const filterValue = value.toLowerCase();
  return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
}

//--------------

  constructor(
    private _formBuilder: FormBuilder,
    private Service: AsociacionMultipleService,
    private SeTipoAsociacionMultipleServicervice: TipoAsociacionMultipleService,
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
    this.IdAsociacion = this.activeRoute.snapshot.params.idAsociacion;
       
    this.CargarDgvElements();   
    this.CargarSelects();

     this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
     );

     this.Service.form.patchValue({ IdAsociacion: this.IdAsociacion });
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

    this.Service.get(this.IdAsociacion).subscribe(result => {
      this.dataSource = new MatTableDataSource<AsociacionMultiple>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);   
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
      this.Service.set().subscribe(result => {

        if (result.status === 1) {
          //this.ActualizarEstadoEntidad();
          this.CargarDgvElements();
        } else {
          this.errorService.handleError(result.error);

        }
        this.Limpiar();
      }, (error) => {
        this.errorService.handleError(error);
      });
    } else {
      this.Service.update().subscribe(result => {

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
    this.Service.delete().subscribe(result => {

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
    this.values = [];
    
    this.entidadService.actionEntidadEvaluadaByIdTipoEntidad(event.value).subscribe(result => {
      this.listEntidad = result.data;        
    });

    this.SeTipoAsociacionMultipleServicervice.asociacionByIdTipoEntidad(event.value).subscribe(result => {
      this.listTipoAsociacion = result.data;        
    });

 }

 autocompleteChange(event){
  alert();return;
  this.entidadService.actionEntidadEvaluadaByIdTipoEntidad(event.value).subscribe(result => {
         result.data.forEach(element => {     
      this.options.push(element.Entidad);
      this.values[element.Entidad] = element.IdEntidad;
    });
  });
}
 
 cargarEntidadByName(){
  this.IdEntidadSelected = this.values[this.Service.form.value.Entidad]; 
 }

  setOperationsData() {
    this.transaccionIsNew = false;
    const asociaconmultiple = this.dataSource.data[this.ROW_NUMBER];
    this.Service.form.patchValue(
      {
        IdAsociacionMultiple: asociaconmultiple.IdAsociacionMultiple,
        IdTipoEntidad: asociaconmultiple.IdTipoEntidad,
        IdEntidad: this.IdEntidad,
        IdTipoAsociacionMultiple: asociaconmultiple.IdTipoAsociacionMultiple,
        Nivel: asociaconmultiple.Nivel
      }); 
  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.Service.InicializarValoresFormGroup();
    this.Service.form.reset();
    this.Service.form.patchValue({ IdEntidad: this.IdEntidad });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
