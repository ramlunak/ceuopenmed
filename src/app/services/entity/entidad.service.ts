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
export class EntidadService {

  private BaseURL = 'entidad/';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private authService: AuthService, private httpClient: HttpClient, private CONSTANS: AppConstantsService) { }

  form: FormGroup = new FormGroup({
    IdEntidad: new FormControl(null),
    IdTipoEntidad: new FormControl('', Validators.required),
    TipoEntidad: new FormControl(''),
    IdEstudiante: new FormControl(null, Validators.required),
    IdProfesor: new FormControl(null),
    Evaluacion: new FormControl(null),
    Estado: new FormControl(0),
    Comentario: new FormControl(null),
    Entidad: new FormControl(null),
  });

  InicializarValoresFormGroup() {
    this.form.setValue({
      IdEntidad: null,
      IdTipoEntidad: null,
      TipoEntidad: '',
      IdEstudiante: '',
      IdProfesor: null,
      Evaluacion: 0,
      Estado: 0,
      Comentario: '',
      Entidad: '',
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

  actionEntidadEvaluadaByIdTipoEntidad(Id: number) {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL),
          {
              headers: this.CONSTANS.getApiHeaders(this.authService.getToken()),
              params: new HttpParams().set('search[IdTipoEntidad]', Id.toString())
          }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  actionEntidadByName(name: string) {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL),
          {
              headers: this.CONSTANS.getApiHeaders(this.authService.getToken()),
              params: new HttpParams().set('search[Entidad]', name)
          }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  set() {
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
        this.CONSTANS.getApiUrl(this.BaseURL + 'update/' + this.form.value.IdEntidad),
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
        this.CONSTANS.getApiUrl(this.BaseURL + 'delete/' + this.form.value.IdEntidad),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  getByProfesorEstado(): Observable<any> {
    this.loadingSubject.next(true);
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

  getByProfesorEstado1(): Observable<any> {
    this.loadingSubject.next(true);
    return this.httpClient

      .get<any>(

        this.CONSTANS.getApiUrl(this.BaseURL + 'profesor-evaluations/' + this.authService.currentUser.IdProfesor + '/1'),
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
