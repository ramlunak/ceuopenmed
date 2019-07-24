import { Component, OnInit ,ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Entidad} from '../../models/entidad-model';
import {SintomaService} from '../../services/sintoma.service';
import {ValidatorService} from '../../services/validator.service';

@Component({
  selector: 'app-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.less']
})
export class EntidadComponent implements OnInit {

  Array: Entidad[] = [
    {id:1,nombre:'Sintoma',nombreEvaluador:'Dr.Fulano Perez M.'},
    {id:2,nombre:'Enfermedad',nombreEvaluador:'Dr.Fulano Perez M.'},
    {id:3,nombre:'Poblacion',nombreEvaluador:'Dr.Fulano Perez M.'}
  ]; 
  //DataTable --
  displayedColumns: string[] = ['id', 'nombre','nombreEvaluador','commands',];
  dataSource = new MatTableDataSource<Entidad>(this.Array);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(public service:SintomaService,public validator:ValidatorService) {}
    
  transaccionIsNew:boolean=true;
  dataUpdate:Entidad;
  nombre:string="";
  nombreEvaluador:string="";
  id:number=0;

  ngOnInit() {
 this.paginator._intl.itemsPerPageLabel="Registros por página";

  //  this.service.getRoles().subscribe(
  //      data=>{this.rolesArray = data;}
  //      ,error => console.log('error')
  //   )

  this.dataSource.paginator = this.paginator;

  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  guardarClick(event: Event) {
    
   
    if(this.transaccionIsNew)
    {

      this.Array.push({
        id:1,
        nombre:this.nombre,
        nombreEvaluador:this.nombreEvaluador
      });
      this.dataSource = new MatTableDataSource<Entidad>(this.Array);
      this.dataSource.paginator = this.paginator;
      this.nombre ="";
      this.nombreEvaluador="";
    }
    else{
      this.dataUpdate.nombre = this.nombre;
      this.Array.splice(this.id,1,this.dataUpdate);
      this.dataSource = new MatTableDataSource<Entidad>(this.Array);
      this.dataSource.paginator = this.paginator;
      this.nombre ="";
      this.nombreEvaluador="";
    }
    
  }

  eliminarClick() {
    this.Array.splice(this.id,1);
    this.dataSource = new MatTableDataSource<Entidad>(this.Array);
    this.dataSource.paginator = this.paginator;
    this.nombre ="";
    this.nombreEvaluador="";
  }


  cargarDatos(){
    this.transaccionIsNew = false;
    this.dataUpdate = this.Array[this.id];
    this.nombre = this.dataUpdate.nombre;
}

setTransaccionNew(){
        this.transaccionIsNew = true;
  }

}
