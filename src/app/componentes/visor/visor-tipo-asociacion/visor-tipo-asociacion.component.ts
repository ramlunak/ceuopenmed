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

  constructor() {
    this.expand = false;
    this.expand = false;
  }

  ngOnInit() {
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

}
