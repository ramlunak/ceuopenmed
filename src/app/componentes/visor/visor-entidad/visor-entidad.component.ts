import { ActivatedRoute } from '@angular/router';
import { Entidad } from './../../../models/entidad';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-visor-entidad',
  templateUrl: './visor-entidad.component.html',
  styleUrls: ['./visor-entidad.component.css']
})
export class VisorEntidadComponent implements OnInit {
  @Input() ENIDAD: Entidad;
  IdEntidad: number;
  constructor(private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.IdEntidad = this.activeRoute.snapshot.params.idEntidad;
  }

}
