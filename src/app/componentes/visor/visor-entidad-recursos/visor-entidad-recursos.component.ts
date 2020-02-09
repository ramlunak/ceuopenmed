import { EntidadRecurso } from './../../../models/entidad-recurso';
import { DetalleEntidadService } from './../../../services/detalle-entidad.service';
import { DetalleEntidad } from './../../../models/detalle-entidad';
import { isNullOrUndefined } from 'util';
import { ErrorHandlerService } from './../../../services/error-handler.service';
import { Entidad } from './../../../models/entidad';
import { VisorService } from './../../../services/visor.service';
import { TipoEntidad } from './../../../models/tipo-entidad';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-visor-entidad-recursos',
  templateUrl: './visor-entidad-recursos.component.html',
  styleUrls: ['./visor-entidad-recursos.component.css']
})
export class VisorEntidadRecursosComponent implements OnInit {

  @Input() ID_ENTIDAD: number;
  valueSearch: string;
  expand: boolean;
  search: boolean;
  ArrarEntidadRecursos: EntidadRecurso[];
  ArrarEntidadRecursosSearch: EntidadRecurso[];

  constructor(
    private Service: VisorService,
    private errorService: ErrorHandlerService
  ) {
    this.expand = true;
  }

  ngOnInit() {
    this.valueSearch = '';
    this.EntidadRecursoByIdEntidadLimit();
  }

  EntidadRecursoByIdEntidadLimit() {
    this.Service.EntidadRecursoByEntidadLimit(this.ID_ENTIDAD, 10).subscribe(result => {
      this.ArrarEntidadRecursos = result.data;
      this.ArrarEntidadRecursosSearch = result.data;
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
    this.ArrarEntidadRecursos = this.ArrarEntidadRecursosSearch;
  }

  MostarTodas() {
    this.Service.EntidadRecursoByEntidad(this.ID_ENTIDAD).subscribe(result => {
      this.ArrarEntidadRecursos = result.data;
      this.ArrarEntidadRecursosSearch = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  SearchOnChange(event: any) {

  }

}
