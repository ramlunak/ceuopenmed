import { DetalleEntidadService } from './../../../services/detalle-entidad.service';
import { DetalleEntidad } from './../../../models/detalle-entidad';
import { isNullOrUndefined } from 'util';
import { ErrorHandlerService } from './../../../services/error-handler.service';
import { Entidad } from './../../../models/entidad';
import { VisorService } from './../../../services/visor.service';
import { TipoEntidad } from './../../../models/tipo-entidad';
import { Component, OnInit, Input } from '@angular/core';

import { OrderPipe } from 'ngx-order-pipe';


@Component({
  selector: 'app-visor-entidad-detalle',
  templateUrl: './visor-entidad-detalle.component.html',
  styleUrls: ['./visor-entidad-detalle.component.css']
})
export class VisorEntidadDetalleComponent implements OnInit {
  order: string = 'Entidad';
  reverse: boolean = false;

  @Input() ID_ENTIDAD: number;
  @Input() ID_TIPOENTIDAD: number;
  valueSearch: string;
  expand: boolean;
  search: boolean;
  ArrarDetalleEntidad: DetalleEntidad[];
  ArrarDetalleEntidadSearch: DetalleEntidad[];

  constructor(
    private Service: VisorService,
    private errorService: ErrorHandlerService,
    private orderPipe: OrderPipe
  ) {
    this.expand = true;
  }

  ngOnInit() {
    this.valueSearch = '';
    this.DetalleEntidadByIdEntidadLimit();
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  DetalleEntidadByIdEntidadLimit() {
    this.Service.DetalleEntidadByEntidadLimit(this.ID_ENTIDAD, 10).subscribe(result => {
      this.ArrarDetalleEntidad = result.data;
      this.ArrarDetalleEntidadSearch = result.data;
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
    this.ArrarDetalleEntidad = this.ArrarDetalleEntidadSearch;
  }

  MostarTodas() {
    this.Service.DetalleEntidadByEntidad(this.ID_ENTIDAD).subscribe(result => {
      this.ArrarDetalleEntidad = result.data;
      this.ArrarDetalleEntidadSearch = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  SearchOnChange(event: any) {
    this.ArrarDetalleEntidad = this.ArrarDetalleEntidadSearch.filter(x => this.eliminarDiacriticosEs(x.Entidad).toLowerCase().includes(this.eliminarDiacriticosEs(event.target.value).toLowerCase()));

  }

  public eliminarDiacriticosEs(texto) {
    return texto
      .normalize('NFD')
      .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1")
      .normalize();
  }

}
