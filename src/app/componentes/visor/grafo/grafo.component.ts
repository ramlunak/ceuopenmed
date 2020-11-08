import { isNullOrUndefined } from 'util';
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
  COLORES: string[] = [];
  DAFAULT_NODE_COLOR = '#007bff';
  DAFAULT_BASENODO_COLOR = '#5DADE2';

  constructor(
    private Service: VisorService,
    private entidadService: EntidadService,
    private asociacionService: AsociacionService,
    public router: Router,
    private errorService: ErrorHandlerService
  ) { }

  ngOnInit() {
    this.CargarColores();
    this.AsociacionByIdEntidadEvaluadaLimit();
  }

  CargarColores() {
    this.COLORES[6] = '#9370DB';
    this.COLORES[7] = '#663399';
    this.COLORES[8] = '#8B008B';
    this.COLORES[9] = '#7B68EE';
    this.COLORES[10] = '#32CD32';
    this.COLORES[11] = '#FFD700';
    this.COLORES[12] = '#F4A460';
    this.COLORES[13] = '#C71585';
    this.COLORES[14] = '#FFC0CB';
    this.COLORES[15] = '#D8BFD8';
    this.COLORES[16] = '#87CEFA';
    this.COLORES[17] = '#DDA0DD';
    this.COLORES[18] = '#DDA0DD';
    this.COLORES[19] = '#C71585';
    this.COLORES[20] = '#FFA07A';
    this.COLORES[21] = '#FF4500';
    this.COLORES[22] = '#FF8C00';
    this.COLORES[23] = '#BDB76B';
    this.COLORES[24] = '#EE82EE';
    this.COLORES[25] = '#FF00FF';
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

    var asociacionBase = new AsociacionNodo(this.ID_ENTIDAD, label, this.ENTIDAD, this.DAFAULT_BASENODO_COLOR, new Font());
    this.AsociacionNodos.push(asociacionBase);
  }

  GrafoAddAsociacionesTo() {

    this.ArrarAsociaiconesTo.forEach(item => {

      let label = item.Entidad.slice(0, this.CARACTERES);
      if (item.Entidad.length > this.CARACTERES) {
        label = label + '...';
      }

      let color = this.COLORES[item.IdTipoEntidad];
      if (isNullOrUndefined(color)) {
        color = this.DAFAULT_NODE_COLOR;
      }


      let asociacionNodo = new AsociacionNodo(item.IdEntidad, label, item.Entidad, color, new Font());
      this.AsociacionNodos.push(asociacionNodo);

      let flechaNodo = new FlechaNodo(this.ID_ENTIDAD, item.IdEntidad, new Arrows(new To(true), new From(false)), new Color(color));
      this.FlechaNodos.push(flechaNodo);
    });
  }

  GrafoAddAsociacionesFrom() {

    this.ArrarAsociaiconesFrom.forEach(item => {

      let label = item.Entidad.slice(0, this.CARACTERES);
      if (item.Entidad.length > this.CARACTERES) {
        label = label + '...';
      }

      let color = this.COLORES[item.IdTipoEntidad];
      if (isNullOrUndefined(color)) {
        color = this.DAFAULT_NODE_COLOR;
      }

      let asociacionNodo = new AsociacionNodo(item.IdEntidad, label, item.Entidad, color, new Font());
      this.AsociacionNodos.push(asociacionNodo);

      let flechaNodo = new FlechaNodo(this.ID_ENTIDAD, item.IdEntidad, new Arrows(new To(false), new From(true)), new Color(color));
      this.FlechaNodos.push(flechaNodo);
    });
  }

  PintarGrafo() {

    // console.log('AsociacionNodo', this.AsociacionNodos);
    //console.log('flechas', this.FlechaNodos);

    const distinctThings = this.AsociacionNodos.filter(
      (thing, i, arr) => arr.findIndex(t => t.id === thing.id) === i
    );

    const nodesArray = new DataSet(distinctThings);
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
  color: string;
  font: Font;
  constructor(ID: number, LABEL: string, TITLE: string = '', COLOR: string = '#AED6F1', FONT: Font) {
    this.id = ID;
    this.label = LABEL;
    this.title = TITLE;
    this.color = COLOR;
    this.font = FONT;
  }
}

class FlechaNodo {
  from: number;
  to: number;
  arrows: Arrows;
  color: Color;
  constructor(FROM: number, TO: number, ARROWS: Arrows, COLOR: Color) {
    this.from = FROM;
    this.to = TO;
    this.arrows = ARROWS;
    this.color = COLOR;
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
  scaleFactor: number;
  constructor(ENABLED: boolean = false, TYPE: string = 'arrow', SCALEFACTOR: number = 1) {
    this.enabled = ENABLED;
    this.type = TYPE;
    this.scaleFactor = SCALEFACTOR;
  }
}

class From {
  enabled: boolean;
  type: string;
  scaleFactor: number;
  constructor(ENABLED: boolean = false, TYPE: string = 'arrow', SCALEFACTOR: number = 1) {
    this.enabled = ENABLED;
    this.type = TYPE;
    this.scaleFactor = SCALEFACTOR;
  }
}

class Color {
  color: string;
  constructor(COLOR: string = 'red') {
    this.color = COLOR;
  }
}

class Font {
  color: string;
  constructor(COLOR: string = 'white') {
    this.color = COLOR;
  }
}
