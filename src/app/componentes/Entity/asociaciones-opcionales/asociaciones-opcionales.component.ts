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


import { AsociacionService } from '../../../services/entity/asociacion.service';


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

import { MatSnackBar } from '@angular/material/snack-bar';
import { element } from 'protractor';

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
  AsocioacionSeleccionada: string;
  IdEntidad1: number;
  IdEntidad2: number;
  ENTIDAD: Entidad;
  
  // DataTable --
  dataSource: MatTableDataSource<AsociacionMultiple>;
  displayedColumns = [ 'Entidad','IdAsociacionMultiple','TipoAsociacion', 'Nivel','Comentario','commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listIdiomas: Idioma[];
  listTiposEntidad: TipoEntidad[];
  listEntidad: Entidad[] = [];
  GridLista: Entidad[] = [];
  
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
    private AsociacionService: AsociacionService,
    private SeTipoAsociacionMultipleServicervice: TipoAsociacionMultipleService,
    private entidadService: EntidadService,
    private authService: AuthService,
    private detalleEntidadService: DetalleEntidadService,
    private idiomaService: IdiomaService,
    private tipoEntidadService: TipoEntidadService,
    private errorService: ErrorHandlerService,
    private router: Router,
    private activeRoute: ActivatedRoute,
   private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';  
    this.IdAsociacion = this.activeRoute.snapshot.params.idAsociacion;
    this.AsocioacionSeleccionada = this.activeRoute.snapshot.params.Asociacion;
    this.IdEntidad1 = this.activeRoute.snapshot.params.idEntidad1;
    this.IdEntidad2 = this.activeRoute.snapshot.params.idEntidad2;
          
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
      this.GridLista = result.data;
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

if(this.Service.form.value.Nivel > 1 || this.Service.form.value.Nivel < 0)
{
  this.snackBar.open('La fuerza debe ser un valor entre 0 y 1.', 'OK', {
    duration: 8000,
  });
  return;
}

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
    
    this.filtrarEntidades(event.value);

    this.SeTipoAsociacionMultipleServicervice.asociacionByIdTipoEntidad(event.value).subscribe(result => {
      this.listTipoAsociacion = result.data;        
    });
 }

  filtrarEntidades(id){
    this.listEntidad = [];
      this.entidadService.actionEntidadEvaluadaByIdTipoEntidad(id).subscribe(result => {
         result.data.forEach(element => {    
           if(element.IdEntidad != this.IdEntidad1 && element.IdEntidad != this.IdEntidad2) {
           var bandera = 0;
         
            this.GridLista.forEach(item => {        
           
              if(item.IdEntidad == element.IdEntidad)
                {
                 bandera = 1;               
                }
            }); 
         
           if(bandera == 0)
            this.listEntidad.push(element);
           }            
     });  
    }); 

  }

   arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele != value;
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

CargarDatosModificar(asociaconmultiple){
  
  this.Service.form.patchValue(
    {
      IdTipoEntidad: asociaconmultiple.IdTipoEntidad,       
    });

    this.entidadService.actionEntidadEvaluadaByIdTipoEntidad(asociaconmultiple.IdTipoEntidad).subscribe(result => {
      this.listEntidad = result.data;        
    });

    this.Service.form.patchValue(
      {
        IdEntidad: asociaconmultiple.IdEntidad,       
      });

      this.SeTipoAsociacionMultipleServicervice.asociacionByIdTipoEntidad(asociaconmultiple.IdTipoEntidad).subscribe(result => {
        this.listTipoAsociacion = result.data;        
      });

      this.Service.form.patchValue(
        {
          idAsociacion:this.IdAsociacion,
          IdAsociacionMultiple:asociaconmultiple.IdAsociacionMultiple, 
          IdTipoAsociacionMultiple: asociaconmultiple.IdTipoAsociacionMultiple,      
          Nivel: asociaconmultiple.Nivel,      
          Comentario: asociaconmultiple.Comentario           
        });
}

  setOperationsData() {
    this.transaccionIsNew = false;
    const asociaconmultiple = this.dataSource.filteredData[this.ROW_NUMBER];
    this.CargarDatosModificar(asociaconmultiple);
    this.Service.form.patchValue(
      {
        IdAsociacionMultiple: asociaconmultiple.IdAsociacionMultiple,       
      }); 
  }

  setEliminarData() {
    this.transaccionIsNew = true;
    const asociaconmultiple = this.dataSource.filteredData[this.ROW_NUMBER];
  
    this.Service.form.patchValue(
      {
        IdAsociacionMultiple: asociaconmultiple.IdAsociacionMultiple,       
      }); 
  }

  Limpiar() {   
    this.transaccionIsNew = true;
    this.Service.InicializarValoresFormGroup();
    this.Service.form.reset();
    this.Service.form.patchValue({ IdAsociacion: this.IdAsociacion });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
