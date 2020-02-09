import { VisorService } from './../../../services/visor.service';
import { Component, OnInit, Input } from '@angular/core';
import { Asociacion } from './../../../models/asociacion';

@Component({
  selector: 'app-visor-asociaciones-multiples',
  templateUrl: './visor-asociaciones-multiples.component.html',
  styleUrls: ['./visor-asociaciones-multiples.component.css']
})

export class VisorAsociacionesMultiplesComponent implements OnInit {

  @Input() ASOCIACION: Asociacion;

  constructor(private Service: VisorService) {
  }

  ngOnInit() {

  }


}
