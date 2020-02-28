import { Entidad } from './../../models/entidad';
import { isNullOrUndefined } from 'util';
import { VisorService } from './../../services/visor.service';
import { Component, OnInit } from '@angular/core';
import { TipoEntidad } from 'src/app/models/tipo-entidad';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { Router } from '@angular/router';
import { DetalleEntidadService } from 'src/app/services/entity/detalle-entidad.service';
import { DetalleEntidad } from 'src/app/models/detalle-entidad';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pagina-inicio',
  templateUrl: './pagina-inicio.component.html',
  styleUrls: ['./pagina-inicio.component.css']
})
export class PaginaInicioComponent implements OnInit {

  ArrarTipoEntidad: TipoEntidad[];
  ArrayEntidad: Entidad[];
  ArrayEntidadSearch: Entidad[];

  //BUSCAR POR DETALLE
  listEntidadesAux: Entidad[];
  listEntidadesDetalle: DetalleEntidad[];
  listIDS: Array<number> = [];
  dataSourceDetalle: MatTableDataSource<DetalleEntidad>;

  constructor(
    private Service: VisorService,
    private router: Router,
    private detalleEntidadService: DetalleEntidadService,
    private errorService: ErrorHandlerService
  ) {

  }

  ngOnInit() {
    this.CargarEntidades();
    this.CargarTiposEntidades();
    this.CargarDetalles();
    this.ArrayEntidadSearch = [];
  }

  CargarDetalles() {
    this.detalleEntidadService.get().subscribe(result => {

      this.listEntidadesDetalle = result.data;

      this.listEntidadesDetalle.forEach(element => {
        element.Entidad = this.eliminarDiacriticosEs(element.Entidad);
      });

      this.dataSourceDetalle = new MatTableDataSource<DetalleEntidad>(this.listEntidadesDetalle);

    }, (error) => {

    });
  }



  CargarTiposEntidades() {
    this.Service.get().subscribe(result => {
      this.ArrarTipoEntidad = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  CargarEntidades() {
    this.Service.Entidad().subscribe(result => {
      this.ArrayEntidad = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  /*   SearchOnChange(event: any) {
      this.ArrayEntidadSearch = this.ArrayEntidad.filter(x => x.Entidad.toLowerCase().includes(event.target.value.toLowerCase()));
      if (this.ArrayEntidadSearch.length === this.ArrayEntidad.length) {
        this.ArrayEntidadSearch = [];
      }

    } */


  //BUSCAR POR DETALLES
  applyFilterDetalle(filterValue: string) {

    if (filterValue === '') {
      this.ArrayEntidadSearch = [];
    } else {
      this.dataSourceDetalle.filter = this.eliminarDiacriticosEs(filterValue.trim().toLowerCase());
      this.cargarEntidadesPorFiltroDetalles();
    }

  }

  public cargarEntidadesPorFiltroDetalles() {

    this.listEntidadesAux = [];
    this.listIDS = [];

    this.dataSourceDetalle.filteredData.forEach(element => {
      this.listIDS.push(element.IdEntidad);
    });

    var novaArr = this.listIDS.filter((este, i) => this.listIDS.indexOf(este) === i);

    novaArr.forEach(element => {
      if (!isNullOrUndefined(this.ArrayEntidad.find((x: Entidad) => x.IdEntidad == element)))
        this.listEntidadesAux.push(this.ArrayEntidad.find((x: Entidad) => x.IdEntidad == element));
    });

    this.ArrayEntidadSearch = this.listEntidadesAux;
  }

  public eliminarDiacriticosEs(texto) {
    return texto
      .normalize('NFD')
      .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1")
      .normalize();
  }

}
