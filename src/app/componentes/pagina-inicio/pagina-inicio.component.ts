import { Entidad } from './../../models/entidad';
import { isNullOrUndefined } from 'util';
import { VisorService } from './../../services/visor.service';
import { Component, OnInit } from '@angular/core';
import { TipoEntidad } from 'src/app/models/tipo-entidad';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-pagina-inicio',
  templateUrl: './pagina-inicio.component.html',
  styleUrls: ['./pagina-inicio.component.css']
})
export class PaginaInicioComponent implements OnInit {

  ArrarTipoEntidad: TipoEntidad[];
  ArrayEntidad: Entidad[];
  ArrayEntidadSearch: Entidad[];

  constructor(
    private Service: VisorService,
    private errorService: ErrorHandlerService
  ) {

  }

  ngOnInit() {
    this.CargarEntidades();
    this.CargarTiposEntidades();
    this.ArrayEntidadSearch = [];
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

  SearchOnChange(event: any) {
    this.ArrayEntidadSearch = this.ArrayEntidad.filter(x => x.Entidad.toLowerCase().includes(event.target.value.toLowerCase()));
    if (this.ArrayEntidadSearch.length === this.ArrayEntidad.length) {
      this.ArrayEntidadSearch = [];
    }

  }

}
