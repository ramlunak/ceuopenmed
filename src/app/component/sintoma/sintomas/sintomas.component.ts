import { Component, OnInit } from '@angular/core';
import { SintomaDetalleModel } from '../../../models/sintoma-detalle-model';
import { SintomaService } from '../../../services/sintoma.service';

@Component({
  selector: 'app-sintomas',
  templateUrl: './sintomas.component.html',
  styleUrls: ['./sintomas.component.less']
})
export class SintomasComponent implements OnInit {

  constructor(private service: SintomaService) {
    this.sintomasDetalle = service.getDetallesAll();
  }

  sintomasDetalle: SintomaDetalleModel[];

  ngOnInit() {
  }

  agregarClick() {
    this.service.addDetalle();
  }
 

}
