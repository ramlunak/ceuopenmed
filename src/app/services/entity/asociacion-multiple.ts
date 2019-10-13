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
export class AsociacionMultipleService {

  private BaseURL = 'asociacion-multiple/';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private CONSTANS: AppConstantsService
  ) { }

  form: FormGroup = new FormGroup({
    IdAsociacionMultiple: new FormControl(null),
    IdAsociacion: new FormControl('', Validators.required),
    IdEntidad: new FormControl('', Validators.required),
    IdTipoEntidad: new FormControl('', Validators.required),
    IdTipoAsociacionMultiple:  new FormControl('', Validators.required),
    Nivel: new FormControl('', Validators.required)
  });

  InicializarValoresFormGroup() {
    this.form.setValue({
      IdAsociacionMultiple: null, 
      IdAsociacion : '', 
      IdEntidad: '',
      Entidad: '',
      IdTipoEntidad: '',
      IdTipoAsociacionMultiple: ''
    });
  }

  get(Id: number): Observable<any> {
    this.loadingSubject.next(true);
    return this.httpClient
    .get<any>(

      this.CONSTANS.getApiUrl(this.BaseURL),
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
        this.CONSTANS.getApiUrl(this.BaseURL + 'delete/' + this.form.value.IdAsociacionMultiple),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }
}
