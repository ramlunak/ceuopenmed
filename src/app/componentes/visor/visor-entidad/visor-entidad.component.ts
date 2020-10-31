import { ErrorHandlerService } from './../../../services/error-handler.service';
import { VisorService } from './../../../services/visor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Entidad } from './../../../models/entidad';
import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { delay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/seguridad/auth.service';


@Component({
  selector: 'app-visor-entidad',
  templateUrl: './visor-entidad.component.html',
  styleUrls: ['./visor-entidad.component.css']
})
export class VisorEntidadComponent implements OnInit {
  ENIDAD: Entidad;
  IdEntidad: number;
  IdTipoEntidad: number;
  constructor(
    private Service: VisorService,
    private activeRoute: ActivatedRoute,
    public location: Location,
    private authService: AuthService,
    public router: Router,

    private errorService: ErrorHandlerService) { }

  ngOnInit() {
    this.IdEntidad = this.activeRoute.snapshot.params.idEntidad;
    this.IdTipoEntidad = this.activeRoute.snapshot.params.idTipoEntidad;
    this.EntidadByIdEntidad();
  }

  EntidadByIdEntidad() {
    this.Service.EntidadById(this.IdEntidad).subscribe(result => {
      this.ENIDAD = result.data[0];
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  backClicked() {
    this.location.back();
    this.router.navigateByUrl("/refresh", { skipLocationChange: true }).then(() => {
      this.router.navigate([decodeURI(this.location.path())]);
    });
    console.log(this.location.path());

  }


}
