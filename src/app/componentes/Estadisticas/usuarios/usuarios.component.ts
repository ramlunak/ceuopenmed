import { EstadistiasUsuarios } from './../../../models/estadisticas';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EntidadService } from 'src/app/services/entity/entidad.service';
import { AuthService } from 'src/app/services/seguridad/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Entidad } from 'src/app/models/entidad';
import { OrderPipe } from 'ngx-order-pipe';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-estadisticas-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class EstadisticasUsuariosComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // DataTable --
  dataSource: MatTableDataSource<EstadistiasUsuarios>;
  displayedColumns = ['IdEstudiante', 'usuario', 'entidades', 'asociaciones', 'suma'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSourceAux: any;
  dataSourcePalabras: any;


  constructor(
    private Service: EntidadService,
    private authService: AuthService,
    private errorService: ErrorHandlerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.CargarDgvElements();
  }

  CargarDgvElements() {

    this.Service.getEstadisticasUsuarios().subscribe(result => {
      console.log(result.data);
      this.dataSource = new MatTableDataSource<EstadistiasUsuarios>(result.data);
      this.dataSourceAux = new MatTableDataSource<EstadistiasUsuarios>(result.data);
      this.dataSourcePalabras = new MatTableDataSource<EstadistiasUsuarios>(result.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (error) => {
      this.errorService.handleError(error);
    });

  }

  applyFilter(filterValue: string) {

    //dividir el filtro por spacio
    var palabras = filterValue.split(' ');

    this.dataSource.data = this.dataSourceAux.data;

    this.dataSourcePalabras.data = this.dataSource.data;
    this.dataSource.filteredData = this.dataSource.data;

    palabras.forEach(element => {

      if (element != "" && element != " ") {
        if (this.dataSource.filteredData.length > 0)
          this.dataSourcePalabras.data = this.dataSource.filteredData;

        this.dataSourcePalabras.filter = this.eliminarDiacriticosEs(element.trim().toLowerCase());
        this.dataSource.data = this.dataSourcePalabras.filteredData;
      }

    });

  }

  public eliminarDiacriticosEs(texto) {
    return texto
      .normalize('NFD')
      .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1")
      .normalize();
  }

}
