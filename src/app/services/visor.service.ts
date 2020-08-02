import { TipoEntidad } from './../models/tipo-entidad';
import { Injectable } from '@angular/core';

import { AuthService } from './seguridad/auth.service';
import { AppConstantsService } from '../utils/app-constants.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisorService {

  private BaseURL = 'visor/';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private authService: AuthService, private httpClient: HttpClient, private CONSTANS: AppConstantsService) { }

  form: FormGroup = new FormGroup({
    IdTipoEntidad: new FormControl(null),
    IdIdioma: new FormControl('', Validators.required),
    TipoEntidad: new FormControl('', Validators.required)
  });

  InicializarValoresFormGroup() {
    this.form.setValue({
      IdTipoEntidad: null,
      IdIdioma: null,
      TipoEntidad: ''
    });
  }

  get(): Observable<any> {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL)
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  EntidadByTipoEntidadLimit(tipoEntidad: number, limit: number) {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl('entidad/'),
        {
          headers: this.CONSTANS.getApiHeaders(this.authService.getToken()),
          params: new HttpParams().set('search[IdTipoEntidad]', tipoEntidad.toString()).set('search[limit]', limit.toString())
        }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  EntidadByTipoEntidad(tipoEntidad: number) {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl('entidad/'),
        {
          headers: this.CONSTANS.getApiHeaders(this.authService.getToken()),
          params: new HttpParams().set('search[IdTipoEntidad]', tipoEntidad.toString())
        }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  Entidad() {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl('entidad/'),
        {
          headers: this.CONSTANS.getApiHeaders(this.authService.getToken()),
          params: new HttpParams().set('search[Estado]', '1')
        }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  DetalleEntidadByEntidadLimit(idEntidad: number, limit: number): Observable<any> {
    this.loadingSubject.next(true);

    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl('detalle-entidad/'),
        {
          headers: this.CONSTANS.getApiHeaders(this.authService.getToken()),
          params: new HttpParams().set('search[IdEntidad]', idEntidad.toString()).set('search[limit]', limit.toString())
        }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  DetalleEntidadByEntidad(idEntidad: number): Observable<any> {
    this.loadingSubject.next(true);

    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl('detalle-entidad/'),
        {
          headers: this.CONSTANS.getApiHeaders(this.authService.getToken()),
          params: new HttpParams().set('search[IdEntidad]', idEntidad.toString())
        }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  EntidadRecursoByEntidadLimit(idEntidad: number, limit: number): Observable<any> {
    this.loadingSubject.next(true);

    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl('recurso/'),
        {
          headers: this.CONSTANS.getApiHeaders(this.authService.getToken()),
          params: new HttpParams().set('search[IdEntidad]', idEntidad.toString()).set('search[limit]', limit.toString())
        }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  EntidadRecursoByEntidad(idEntidad: number): Observable<any> {
    this.loadingSubject.next(true);

    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl('recurso/'),
        {
          headers: this.CONSTANS.getApiHeaders(this.authService.getToken()),
          params: new HttpParams().set('search[IdEntidad]', idEntidad.toString())
        }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  AsociacionByIdEntidadEvaluada(Id: number): Observable<any> {
    this.loadingSubject.next(true);

    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl('asociacion/' + 'evaluated-associate-entitys-a/' + Id),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  AsociacionByIdEntidadEvaluadaB(Id: number): Observable<any> {
    this.loadingSubject.next(true);

    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl('asociacion/' + 'evaluated-associate-entitys-b/' + Id),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  EntidadById(Id: number) {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl('entidad/'),
        {
          headers: this.CONSTANS.getApiHeaders(this.authService.getToken()),
          params: new HttpParams().set('search[IdEntidad]', Id.toString())
        }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  AsociasionMultipleyIdAsociacion(Id: number) {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl('asociacion-multiple/'),
        {
          headers: this.CONSTANS.getApiHeaders(this.authService.getToken()),
          params: new HttpParams().set('search[IdAsociacion]', Id.toString())
        }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

}
