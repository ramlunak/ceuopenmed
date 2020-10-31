import { Router } from '@angular/router';
import { ErrorHandlerService } from './../../../services/error-handler.service';
import { AsociacionMultiple } from './../../../models/asociacion-multiple';
import { VisorService } from './../../../services/visor.service';
import { Component, OnInit, Input } from '@angular/core';
import { Asociacion } from './../../../models/asociacion';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/seguridad/auth.service';
import { AsociacionService } from 'src/app/services/entity/asociacion.service';

@Component({
  selector: 'app-visor-asociaciones-multiples',
  templateUrl: './visor-asociaciones-multiples.component.html',
  styleUrls: ['./visor-asociaciones-multiples.component.css']
})

export class VisorAsociacionesMultiplesComponent implements OnInit {

  @Input() ENTIDAD: string;
  @Input() ID_ENTIDAD: number;
  @Input() ASOCIACION: Asociacion;
  @Input() DIRECCION: boolean;
  ArrarAsociaiconesMultiple: AsociacionMultiple;
  expand: boolean;

  constructor(
    private Service: VisorService,
    private errorService: ErrorHandlerService,
    private asociacionService: AsociacionService,
    private router: Router,
    public authService: AuthService,
    public location: Location) {

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

  goToAsociciones(idEntidad1: number, entidad: string, asociacion: string) {

    this.asociacionService.form.patchValue({
      IdEntidad1: idEntidad1,
      entidadSelecionada: entidad,
      Buscar: asociacion
    });
    this.redirectToAsociacion();
  }

  public redirectToAsociacion = () => {
    this.router.navigate(['Asociacion']);
  }


  public goToAsocicionesMultiples = (TipoAsociacion: string, asociacionEntidad: string, IdAsociacion: number, IdEntidad) => {

    const asociacionCompleta = this.ENTIDAD + " " + TipoAsociacion + " " + asociacionEntidad;
    const url = `AsociacionesOpcionales/${IdAsociacion}/${asociacionCompleta}/${IdEntidad}/${this.ID_ENTIDAD}`;
    this.router.navigate([url]);

  }

  refresh(id: number, idTipoEntidad): void {

    this.router.navigateByUrl("/refresh", { skipLocationChange: true }).then(() => {
      this.router.navigate([decodeURI('/VisorEntidad/' + id + '/' + idTipoEntidad)]);
    });
  }

}
