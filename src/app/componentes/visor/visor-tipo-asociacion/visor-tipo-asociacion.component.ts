import { isNullOrUndefined } from 'util';
import { ErrorHandlerService } from './../../../services/error-handler.service';
import { Entidad } from './../../../models/entidad';
import { VisorService } from './../../../services/visor.service';
import { TipoEntidad } from './../../../models/tipo-entidad';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-visor-tipo-asociacion',
  templateUrl: './visor-tipo-asociacion.component.html',
  styleUrls: ['./visor-tipo-asociacion.component.css']
})
export class VisorTipoAsociacionComponent implements OnInit {

  @Input() TIPO_ENIDAD: TipoEntidad;
  valueSearch: string;
  expand: boolean;
  search: boolean;
  ArrarEntidad: Entidad[];
  ArrarEntidadSearch: Entidad[];

  constructor(private Service: VisorService, private errorService: ErrorHandlerService) {
    this.expand = false;
  }

  ngOnInit() {
    this.valueSearch = '';
    this.EntidadByTipoEntidadLimit();
  }

  EntidadByTipoEntidadLimit() {
    this.Service.EntidadByTipoEntidadLimit(this.TIPO_ENIDAD.IdTipoEntidad, 10).subscribe(result => {
      this.ArrarEntidad = result.data;
      this.ArrarEntidadSearch = result.data;
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
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  SearchOnChange(event: any) {
    this.ArrarEntidad = this.ArrarEntidadSearch.filter(x => x.Entidad.toLowerCase().includes(event.target.value.toLowerCase()));

  }

}
