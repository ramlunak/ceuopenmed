import { isNullOrUndefined } from 'util';
import { ErrorHandlerService } from './../../../services/error-handler.service';
import { Entidad } from './../../../models/entidad';
import { VisorService } from './../../../services/visor.service';
import { TipoEntidad } from './../../../models/tipo-entidad';
import { Component, OnInit, Input } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { AuthService } from 'src/app/services/seguridad/auth.service';

@Component({
  selector: 'app-visor-tipo-asociacion',
  templateUrl: './visor-tipo-asociacion.component.html',
  styleUrls: ['./visor-tipo-asociacion.component.css']
})
export class VisorTipoAsociacionComponent implements OnInit {
  order: string = 'Entidad';
  reverse: boolean = false;

  @Input() TIPO_ENIDAD: TipoEntidad;
  valueSearch: string;
  totalSinFiltroCount: number;
  expand: boolean;
  search: boolean;
  MostrarTodas: boolean;
  MostrarMasMenos: boolean;
  ArrarEntidad: Entidad[];
  ArrarEntidadCount: Entidad[];
  ArrarEntidadSearch: Entidad[];

  constructor(
    private Service: VisorService,
    private errorService: ErrorHandlerService,
    private authService: AuthService,
    private orderPipe: OrderPipe
  ) {
    this.expand = false;
    this.MostrarMasMenos = false;
  }

  ngOnInit() {
    this.valueSearch = '';
    this.MostrarCount();
    this.EntidadByTipoEntidadLimit();
  }

  MostrarCount() {
    this.Service.EntidadByTipoEntidad(this.TIPO_ENIDAD.IdTipoEntidad).subscribe(result => {
      this.ArrarEntidadCount = result.data;
      this.totalSinFiltroCount = this.ArrarEntidadCount.length;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  EntidadByTipoEntidadLimit() {

    this.Service.EntidadByTipoEntidadLimit(this.TIPO_ENIDAD.IdTipoEntidad, 10).subscribe(result => {
      this.ArrarEntidad = result.data;
      this.ArrarEntidadSearch = result.data;
      this.MostrarTodas = true;
      if (result.totalCount < 9) {
        this.MostrarMasMenos = false;
      } else {
        this.MostrarMasMenos = true;
      }
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
    this.ArrarEntidad = this.ArrarEntidadSearch;
  }

  MostarTodas() {

    this.Service.EntidadByTipoEntidad(this.TIPO_ENIDAD.IdTipoEntidad).subscribe(result => {
      this.ArrarEntidad = result.data;
      this.ArrarEntidadSearch = result.data;
      this.MostrarTodas = false;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  MostarMenos() {
    this.EntidadByTipoEntidadLimit();
  }

  SearchOnChange(event: any) {
    this.ArrarEntidad = this.ArrarEntidadSearch.filter(x => this.eliminarDiacriticosEs(x.Entidad).toLowerCase().includes(this.eliminarDiacriticosEs(event.target.value).toLowerCase()));

  }

  public eliminarDiacriticosEs(texto) {
    return texto
      .normalize('NFD')
      .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1")
      .normalize();
  }


}
