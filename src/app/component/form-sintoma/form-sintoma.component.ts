import { Component, OnInit ,ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Roles} from '../../models/roles-model';
import {SintomaService} from '../../services/sintoma.service';
import {ValidatorService} from '../../services/validator.service';


@Component({
  selector: 'app-form-sintoma',
  templateUrl: './form-sintoma.component.html',
  styleUrls: ['./form-sintoma.component.less']
})


export class FormSintomaComponent implements OnInit {

  rolesArray: Roles[] = [
    {id:1,nombre:'Admin'},
    {id:2,nombre:'Profesor'},
    {id:3,nombre:'Estudiante'}
  ]; 
  //DataTable --
  displayedColumns: string[] = ['id', 'nombre','commands',];
  dataSource = new MatTableDataSource<Roles>(this.rolesArray);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(public service:SintomaService,public validator:ValidatorService) {}
    
  transaccionIsNew:boolean=true;
  dataUpdate:Roles;
  nombre:string="";
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

      this.rolesArray.push({
        id:1,
        nombre:this.nombre
      });
      this.dataSource = new MatTableDataSource<Roles>(this.rolesArray);
      this.dataSource.paginator = this.paginator;
      this.nombre ="";
    }
    else{
      this.dataUpdate.nombre = this.nombre;
      this.rolesArray.splice(this.id,1,this.dataUpdate);
      this.dataSource = new MatTableDataSource<Roles>(this.rolesArray);
      this.dataSource.paginator = this.paginator;
      this.nombre ="";
    }
    
  }

  eliminarClick() {
    this.rolesArray.splice(this.id,1);
    this.dataSource = new MatTableDataSource<Roles>(this.rolesArray);
    this.dataSource.paginator = this.paginator;
    this.nombre ="";
  }


  cargarDatos(){
    this.transaccionIsNew = false;
    this.dataUpdate = this.rolesArray[this.id];
    this.nombre = this.dataUpdate.nombre;
}

setTransaccionNew(){
        this.transaccionIsNew = true;
  }

}
