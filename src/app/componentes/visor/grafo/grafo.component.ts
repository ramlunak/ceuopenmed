import { EntidadService } from 'src/app/services/entity/entidad.service';
import { AsociacionService } from 'src/app/services/entity/asociacion.service';
import { Entidad } from 'src/app/models/entidad';
import { Component, OnInit, Input } from '@angular/core';
import { title } from 'process';
import { from } from 'rxjs';
import { Asociacion } from 'src/app/models/asociacion';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { VisorService } from 'src/app/services/visor.service';
import { Network, DataSet, Node, Edge } from 'vis-network/standalone';
import { Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

@Component({
  selector: 'app-grafo',
  templateUrl: './grafo.component.html',
  styleUrls: ['./grafo.component.css']
})

export class GrafoComponent implements OnInit {

  @Input() ENTIDAD: string;
  @Input() ID_ENTIDAD: number;
  @Input() DIRECCION: boolean;

  ArrarAsociaiconesTo: Asociacion[] = [];
  ArrarAsociaiconesFrom: Asociacion[] = [];
  AsociacionNodos: AsociacionNodo[] = [];
  FlechaNodos: FlechaNodo[] = [];
  CARACTERES = 12;
  APP = this;
  ID_TIPOENTIDAD = 0;

  constructor(
    private Service: VisorService,
    private entidadService: EntidadService,
    private asociacionService: AsociacionService,
    public router: Router,
    private errorService: ErrorHandlerService
  ) { }

  ngOnInit() {
    this.AsociacionByIdEntidadEvaluadaLimit();
  }

  AsociacionByIdEntidadEvaluadaLimit() {

    this.Service.AsociacionByIdEntidadEvaluada(this.ID_ENTIDAD).subscribe(result => {
      this.ArrarAsociaiconesTo = result.data;

      //CARGAR ASOCIACIONES FROM
      this.Service.AsociacionByIdEntidadEvaluadaB(this.ID_ENTIDAD).subscribe(result => {
        this.ArrarAsociaiconesFrom = result.data;

        //PINTAR GRAFO
        this.GrafoAddAsociacionBase();
        this.GrafoAddAsociacionesTo();
        this.GrafoAddAsociacionesFrom();
        this.PintarGrafo();

      }, (error) => {
        this.errorService.handleError(error);
      });


    }, (error) => {
      this.errorService.handleError(error);
    });



  }

  GrafoAddAsociacionBase() {

    let label = this.ENTIDAD.slice(0, this.CARACTERES);
    if (this.ENTIDAD.length > this.CARACTERES) {
      label = label + '...';
    }

    var asociacionBase = new AsociacionNodo(this.ID_ENTIDAD, label, this.ENTIDAD);
    this.AsociacionNodos.push(asociacionBase);
  }

  GrafoAddAsociacionesTo() {

    this.ArrarAsociaiconesTo.forEach(item => {

      let label = item.Entidad.slice(0, this.CARACTERES);
      if (item.Entidad.length > this.CARACTERES) {
        label = label + '...';
      }

      let asociacionNodo = new AsociacionNodo(item.IdEntidad, label, item.Entidad);
      this.AsociacionNodos.push(asociacionNodo);

      let flechaNodo = new FlechaNodo(this.ID_ENTIDAD, item.IdEntidad, new Arrows(new To(true), new From(false)));
      this.FlechaNodos.push(flechaNodo);
    });
  }

  GrafoAddAsociacionesFrom() {

    this.ArrarAsociaiconesFrom.forEach(item => {

      let label = item.Entidad.slice(0, this.CARACTERES);
      if (item.Entidad.length > this.CARACTERES) {
        label = label + '...';
      }

      let asociacionNodo = new AsociacionNodo(item.IdEntidad, label, item.Entidad);
      this.AsociacionNodos.push(asociacionNodo);

      let flechaNodo = new FlechaNodo(this.ID_ENTIDAD, item.IdEntidad, new Arrows(new To(false), new From(true)));
      this.FlechaNodos.push(flechaNodo);
    });
  }

  PintarGrafo() {

    console.log('AsociacionNodo', this.AsociacionNodos);
    console.log('flechas', this.FlechaNodos);

    const nodesArray = new DataSet(this.AsociacionNodos);
    const edgesArray: Edge[] = this.FlechaNodos;

    const container = document.getElementById('mynetwork');
    const data = {
      nodes: nodesArray,
      edges: edgesArray,
    };
    const options = {};
    const network = new Network(container, data, options);

    var APP = this;

    network.on('click', function (params) {

      let idEntidad = params.nodes[0];

      //CARGAR ENTIDAD PARA OBTENER IdTIpoEntidad;
      APP.entidadService.view(idEntidad).subscribe(result => {
        console.log(result.data.IdTipoEntidad);
        APP.ID_TIPOENTIDAD = result.data.IdTipoEntidad;

        APP.router.navigateByUrl("/refresh", { skipLocationChange: true }).then(() => {
          APP.router.navigate([decodeURI('/VisorEntidad/' + idEntidad + '/' + APP.ID_TIPOENTIDAD + '')]);
        });

      }, (error) => {

      });



    });

  }


}

class AsociacionNodo {
  id: number;
  label: string;
  title: string;
  constructor(ID: number, LABEL: string, TITLE: string = '') {
    this.id = ID;
    this.label = LABEL;
    this.title = TITLE;
  }
}

class FlechaNodo {
  from: number;
  to: number;
  arrows: Arrows;
  constructor(FROM: number, TO: number, ARROWS: Arrows) {
    this.from = FROM;
    this.to = TO;
    this.arrows = ARROWS;
  }
}

class Arrows {
  to: To;
  from: From;
  constructor(TO: To, FROM: From) {
    this.to = TO;
    this.from = FROM;
  }
}

class To {
  enabled: boolean;
  type: string;
  constructor(ENABLED: boolean = false, TYPE: string = 'arrow') {
    this.enabled = ENABLED;
    this.type = TYPE;
  }
}


class From {
  enabled: boolean;
  type: string;
  constructor(ENABLED: boolean = false, TYPE: string = 'arrow') {
    this.enabled = ENABLED;
    this.type = TYPE;
  }
}
