import { Injectable } from '@angular/core';

import { AuthService } from './seguridad/auth.service';
import { AppConstantsService } from '../utils/app-constants.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';

import { EntidadService } from '../services/entidad';

@Injectable({
  providedIn: 'root'
})
export class DetalleEntidadService {

  private BaseURL = 'detalle-entidad/';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private entidadService: EntidadService,
    private authService: AuthService,
    private httpClient: HttpClient,
    private CONSTANS: AppConstantsService
  ) { }

  form: FormGroup = new FormGroup({
    IdRecurso: new FormControl(null),
    IdIdioma: new FormControl('', Validators.required),
    IdEntidad: new FormControl('', Validators.required),    
    TipoEntidad: new FormControl(null),
    Entidad: new FormControl('', Validators.required),
    Referencia: new FormControl(null),
    Nivel:   new FormControl('', Validators.required),
    IsImage:  new FormControl(null)    
  });

  InicializarValoresFormGroup() {
    this.form.setValue({
      IdRecurso: null,
      IdIdioma: null,
      IdEntidad: this.entidadService.form.value.IdEntidad,     
      TipoEntidad: this.entidadService.form.value.TipoEntidad,
      Entidad: '',
      Referencia: '',
      Nivel: null,
      IsImage: 0     
    });
  }

  get(): Observable<any> {
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
  }

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
        this.CONSTANS.getApiUrl(this.BaseURL + 'update/' + this.form.value.IdRecurso),
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
        this.CONSTANS.getApiUrl(this.BaseURL + 'delete/' + this.form.value.IdRecurso),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }
}
