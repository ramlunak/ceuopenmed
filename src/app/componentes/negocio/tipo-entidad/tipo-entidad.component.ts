import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { NegTipoEntidadService } from '../../../services/negocio/neg-tipoEntidad.service';
import { NegTipoEntidad } from 'src/app/models/negocio/neg-tipoEntidad';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';


@Component({
  selector: 'app-tipo-entidad',
  templateUrl: './tipo-entidad.component.html',
  styleUrls: ['./tipo-entidad.component.css']
})

export class TipoEntidadComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo Tipo de Entidad';
  
  // DataTable --
  dataSource: MatTableDataSource<NegTipoEntidad>;
  displayedColumns = ['IdTipoEntidad', 'TipoEntidad', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private Service: NegTipoEntidadService, private errorService: ErrorHandlerService) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';
    this.CargarDgvElements();   
  }

  CargarDgvElements() {
     this.Service.getTipoEntidades().subscribe(result => {
       this.dataSource = new MatTableDataSource<NegTipoEntidad>(result.data);     
      this.dataSource.paginator = this.paginator;
     }, (error) => {
       this.errorService.handleError(error);
     });
      
  }

  applyFilter(filterValue: string) {
    console.log(filterValue.trim().toLowerCase());
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  
}
