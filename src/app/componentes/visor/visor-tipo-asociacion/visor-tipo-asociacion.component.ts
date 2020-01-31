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

  expand: boolean;
  search: boolean;
  ArrarEntidad: Entidad[];

  constructor(private Service: VisorService, private errorService: ErrorHandlerService) {
    this.expand = false;
    this.expand = false;
  }

  ngOnInit() {
    this.EntidadByTipoEntidadLimit();
  }

  EntidadByTipoEntidadLimit() {
    this.Service.EntidadByTipoEntidadLimit(this.TIPO_ENIDAD.IdTipoEntidad, 10).subscribe(result => {
      this.ArrarEntidad = result.data;
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
  }

  MostarTodas() {
    this.Service.EntidadByTipoEntidad(this.TIPO_ENIDAD.IdTipoEntidad).subscribe(result => {
      this.ArrarEntidad = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

}
