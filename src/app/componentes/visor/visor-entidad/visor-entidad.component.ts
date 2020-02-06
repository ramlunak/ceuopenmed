import { ErrorHandlerService } from './../../../services/error-handler.service';
import { VisorService } from './../../../services/visor.service';
import { ActivatedRoute } from '@angular/router';
import { Entidad } from './../../../models/entidad';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-visor-entidad',
  templateUrl: './visor-entidad.component.html',
  styleUrls: ['./visor-entidad.component.css']
})
export class VisorEntidadComponent implements OnInit {
  ENIDAD: Entidad;
  IdEntidad: number;
  constructor(
    private Service: VisorService,
    private activeRoute: ActivatedRoute,
    private errorService: ErrorHandlerService) { }

  ngOnInit() {
    this.IdEntidad = this.activeRoute.snapshot.params.idEntidad;
    this.EntidadByIdEntidad();
  }


  EntidadByIdEntidad() {
    this.Service.EntidadById(this.IdEntidad).subscribe(result => {
      this.ENIDAD = result.data[0];
    }, (error) => {
      this.errorService.handleError(error);
    });
  }


}
