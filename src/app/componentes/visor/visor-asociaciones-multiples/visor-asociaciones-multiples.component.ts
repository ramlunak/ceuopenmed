import { ErrorHandlerService } from './../../../services/error-handler.service';
import { AsociacionMultiple } from './../../../models/asociacion-multiple';
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
  ArrarAsociaiconesMultiple: AsociacionMultiple;
  expand: boolean;

  constructor(
    private Service: VisorService,
    private errorService: ErrorHandlerService) {

  }

  ngOnInit() {
    this.AsociacionMultipleByIdAsociacion();
    this.expand = true;
  }

  AsociacionMultipleByIdAsociacion() {
    this.Service.AsociasionMultipleyIdAsociacion(this.ASOCIACION.IdAsociacion).subscribe(result => {
      this.ArrarAsociaiconesMultiple = result.data;
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

}
