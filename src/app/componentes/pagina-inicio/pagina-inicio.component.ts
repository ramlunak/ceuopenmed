import { VisorService } from './../../services/visor.service';
import { Component, OnInit } from '@angular/core';
import { TipoEntidad } from 'src/app/models/tipo-entidad';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-pagina-inicio',
  templateUrl: './pagina-inicio.component.html',
  styleUrls: ['./pagina-inicio.component.css']
})
export class PaginaInicioComponent implements OnInit {

  ArrarTipoEntidad: TipoEntidad[];

  constructor(
    private Service: VisorService,
    private errorService: ErrorHandlerService
  ) {

  }

  ngOnInit() {
    this.CargarTiposEntidades();
  }

  CargarTiposEntidades() {
    this.Service.get().subscribe(result => {
      this.ArrarTipoEntidad = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

}
