import { Asociacion } from './../../../models/asociacion';
import { EntidadRecurso } from './../../../models/entidad-recurso';
import { DetalleEntidadService } from './../../../services/detalle-entidad.service';
import { DetalleEntidad } from './../../../models/detalle-entidad';
import { isNullOrUndefined } from 'util';
import { ErrorHandlerService } from './../../../services/error-handler.service';
import { Entidad } from './../../../models/entidad';
import { VisorService } from './../../../services/visor.service';
import { TipoEntidad } from './../../../models/tipo-entidad';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-visor-entidad-asociaciones',
  templateUrl: './visor-entidad-asociaciones.component.html',
  styleUrls: ['./visor-entidad-asociaciones.component.css']
})

export class VisorEntidadAsociacionesComponent implements OnInit {

  @Input() ID_ENTIDAD: number;
  valueSearch: string;
  expand: boolean;
  search: boolean;
  ArrarAsociaicones: Asociacion[];
  ArrarAsociaiconesSearch: Asociacion[];
  order: string = 'info.name';
  reverse: boolean = false;

  constructor(
    private Service: VisorService,
    private errorService: ErrorHandlerService,
    private router: Router,
    private orderPipe: OrderPipe
  ) {
    this.expand = true;
  }

  ngOnInit() {
    this.valueSearch = '';
    this.AsociacionByIdEntidadEvaluadaLimit();
  }

  AsociacionByIdEntidadEvaluadaLimit() {
    this.Service.AsociacionByIdEntidadEvaluada(this.ID_ENTIDAD).subscribe(result => {
      this.ArrarAsociaicones = result.data;
      this.ArrarAsociaiconesSearch = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  Expand() {
    this.expand = true;
  }

  Collapse() {
    this.expand = false;
  }

  Search() {
    this.search = true;
  }

  CancelSearch() {
    this.search = false;
    this.ArrarAsociaicones = this.ArrarAsociaiconesSearch;
  }

  MostarTodas() {
    this.Service.AsociacionByIdEntidadEvaluada(this.ID_ENTIDAD).subscribe(result => {
      this.ArrarAsociaicones = result.data;
      this.ArrarAsociaiconesSearch = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }


  public RedirectAsociacionesOpcionales = (id) => {

    const url = `VisorAsociacionesMultiples/${id}`;
    this.router.navigate([url]);

  }

  SearchOnChange(event: any) {
    this.ArrarAsociaicones = this.ArrarAsociaiconesSearch.filter(x => x.Entidad.toLowerCase().includes(event.target.value.toLowerCase()));

  }

}
