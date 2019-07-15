import { Component, OnInit, Input } from '@angular/core';
import { SintomaDetalleModel } from '../../../models/sintoma-detalle-model';
import { SintomaService } from '../../../services/sintoma.service'

@Component({
  selector: 'app-sintoma-detalle',
  templateUrl: './sintoma-detalle.component.html',
  styleUrls: ['./sintoma-detalle.component.less']
})


export class SintomaDetalleComponent implements OnInit {

  constructor(private service: SintomaService) { }
  @Input() sintomaDetalle: SintomaDetalleModel;
  
  ngOnInit() {
  }

  deleteClick() {
    this.service.deleteDetalle('1');
  }
 

}
