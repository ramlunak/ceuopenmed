import { Injectable } from '@angular/core';

import { AuthService } from '../seguridad/auth.service';
import { AppConstantsService } from '../../utils/app-constants.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AsociacionService {

  private BaseURL = 'asociacion/';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private authService: AuthService, private httpClient: HttpClient, private CONSTANS: AppConstantsService) { }

  form: FormGroup = new FormGroup({
    IdAsociacion: new FormControl(null),
    IdEntidad1: new FormControl('', Validators.required),
    IdEntidad2: new FormControl(null),
    IdTipoAsociacion: new FormControl(null, Validators.required),
    IdEstudiante: new FormControl(null, Validators.required),
    IdProfesor: new FormControl(null),
    IdEntidad: new FormControl(null),
    IdTipoEntidad: new FormControl(null),
    TipoEntidad: new FormControl(''),
    Evaluacion: new FormControl(null),
    Estado: new FormControl(null),
    Comentario: new FormControl(null),
    Descripcion: new FormControl(null),
    Nivel: new FormControl('', Validators.required),
    entidadSelecionada: new FormControl(null),
    Buscar: new FormControl(null),

  });

  InicializarValoresFormGroup() {
    this.form.setValue({
      IdAsociacion: null,
      IdEntidad1: null,
      IdEntidad2: null,
      IdTipoAsociacion: null,
      IdEstudiante: this.authService.currentUser.IdEstudiante,
      IdProfesor: null,
      IdEntidad: null,
      IdTipoEntidad: null,
      TipoEntidad: '',
      Evaluacion: 0,
      Estado: 0,
      Comentario: '',
      Descripcion: null,
      Nivel: '',
      entidadSelecionada: '',
      Buscar: '',
    });
  }

  /* get(): Observable<any> {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL),
        {
          headers: this.CONSTANS.getApiHeaders(this.authService.getToken()),
        }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  } */

  view(Id: number) {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'view/' + Id),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  getByIdEntidad(Id: number): Observable<any> {
    this.loadingSubject.next(true);

    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'associate-entitys/' + Id),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  getListaAsociasiones(IdEntidad2: number): Observable<any> {
    this.loadingSubject.next(true);

    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'lista/' + this.form.value.IdEntidad1 + '/' + IdEntidad2),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  getByIdEntidadEvaluada(Id: number): Observable<any> {
    this.loadingSubject.next(true);

    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'evaluated-associate-entitys/' + Id),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }


  viewDetalle(Id: number) {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'view-detalles/' + Id),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  set() {
    this.form.value.Estado = 0;
    this.loadingSubject.next(true);
    return this.httpClient
      .post<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'create'),
        this.form.value,
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  update() {

    this.loadingSubject.next(true);
    return this.httpClient
      .put<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'update/' + this.form.value.IdAsociacion),
        this.form.value,
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  delete() {
    this.loadingSubject.next(true);
    return this.httpClient
      .delete<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'delete/' + this.form.value.IdAsociacion),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  getByProfesorEstado(): Observable<any> {
    this.loadingSubject.next(true);
    let idestudiante: number;
    if (isNullOrUndefined(this.authService.currentUser.IdEstudiante)) {
      idestudiante = 0;
    } else {
      idestudiante = this.authService.currentUser.IdEstudiante;
    }
    return this.httpClient

      .get<any>(

        this.CONSTANS.getApiUrl(this.BaseURL + 'profesor-evaluations/' + this.authService.currentUser.IdProfesor + '/0'),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }

      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );


  }

  getByEtudiante(): Observable<any> {
    this.loadingSubject.next(true);
    let idestudiante: number;
    if (isNullOrUndefined(this.authService.currentUser.IdEstudiante)) {
      idestudiante = 0;
    } else {
      idestudiante = this.authService.currentUser.IdEstudiante;
    }
    return this.httpClient
      .get<any>(

        this.CONSTANS.getApiUrl(this.BaseURL),
        {
          headers: this.CONSTANS.getApiHeaders(this.authService.getToken()),
          params: new HttpParams().set('search[IdEstudiante]', idestudiante.toString())
        }

      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );

  }

}
