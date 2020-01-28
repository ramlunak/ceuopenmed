import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visor-tipo-asociacion',
  templateUrl: './visor-tipo-asociacion.component.html',
  styleUrls: ['./visor-tipo-asociacion.component.css']
})
export class VisorTipoAsociacionComponent implements OnInit {

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
