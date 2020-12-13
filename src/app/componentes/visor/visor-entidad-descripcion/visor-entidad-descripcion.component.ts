import { EntidadDescripcion } from './../../../models/entidad-descripcion';
import { EntidadDescripcionService } from './../../../services/entidad-descripcion.service';

import { isNullOrUndefined } from 'util';
import { ErrorHandlerService } from './../../../services/error-handler.service';
import { Entidad } from './../../../models/entidad';
import { VisorService } from './../../../services/visor.service';
import { TipoEntidad } from './../../../models/tipo-entidad';
import { Component, OnInit, Input } from '@angular/core';

import { OrderPipe } from 'ngx-order-pipe';
import { AuthService } from 'src/app/services/seguridad/auth.service';

@Component({
  selector: 'app-visor-entidad-descripcion',
  templateUrl: './visor-entidad-descripcion.component.html',
  styleUrls: ['./visor-entidad-descripcion.component.scss']
})
export class VisorEntidadDescripcionComponent implements OnInit {
  order: string = 'descripcion';
  reverse: boolean = false;

  @Input() ID_ENTIDAD: number;
  @Input() ID_TIPOENTIDAD: number;
  valueSearch: string;
  expand: boolean;
  search: boolean;
  ArrarDescripcionEntidad: EntidadDescripcion[];
  ArrarDescripcionEntidadSearch: EntidadDescripcion[] = [];

  constructor(
    private Service: EntidadDescripcionService,
    private errorService: ErrorHandlerService,
    private orderPipe: OrderPipe,
    public authService: AuthService
  ) {
    this.expand = true;
  }

  ngOnInit() {
    this.valueSearch = '';
    this.EntidadDescripcionByIdEntidadLimit();
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  EntidadDescripcionByIdEntidadLimit() {
    this.Service.getByEntidad(this.ID_ENTIDAD).subscribe(result => {
      this.ArrarDescripcionEntidad = result.data;
      this.ArrarDescripcionEntidadSearch = result.data;
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
    this.ArrarDescripcionEntidad = this.ArrarDescripcionEntidadSearch;
  }

  MostarTodas() {
    this.Service.getByEntidad(this.ID_ENTIDAD).subscribe(result => {
      this.ArrarDescripcionEntidad = result.data;
      this.ArrarDescripcionEntidadSearch = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  SearchOnChange(event: any) {
    this.ArrarDescripcionEntidad = this.ArrarDescripcionEntidadSearch.filter(x => this.eliminarDiacriticosEs(x.descripcion).toLowerCase().includes(this.eliminarDiacriticosEs(event.target.value).toLowerCase()));

  }

  public eliminarDiacriticosEs(texto) {
    return texto
      .normalize('NFD')
      .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1")
      .normalize();
  }

}
