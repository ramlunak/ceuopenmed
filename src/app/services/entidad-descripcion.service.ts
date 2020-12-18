import { Idioma } from './../models/idioma';
import { Injectable } from '@angular/core';

import { AuthService } from './seguridad/auth.service';
import { AppConstantsService } from '../utils/app-constants.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class EntidadDescripcionService {

  private BaseURL = 'entidad/';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private authService: AuthService, private httpClient: HttpClient, private CONSTANS: AppConstantsService) { }

  form: FormGroup = new FormGroup({
    idEntidadDescripcion: new FormControl(null),
    TipoEntidad: new FormControl(null),
    IdIdioma: new FormControl('', Validators.required),
    IdEntidad: new FormControl('', Validators.required),
    Descripcion: new FormControl('', Validators.required)
  });

  formEntidadAux: FormGroup = new FormGroup({
    IdEstudiante: new FormControl(null),
    IdTipoEntidad: new FormControl(null),
    Comentario: new FormControl(null)
  });

  InicializarValoresFormGroup() {
    this.form.setValue({
      idEntidadDescripcion: null,
      IdIdioma: '',
      Descripcion: '',
    });
  }

  get(): Observable<any> {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'descripciones/0'),
        {
          headers: this.CONSTANS.getApiHeaders(this.authService.getToken()),
        }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  getByEntidad(idEntidad: number): Observable<any> {
    this.loadingSubject.next(true);

    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'descripciones/' + idEntidad),
        {
          headers: this.CONSTANS.getApiHeaders(this.authService.getToken())
        }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  set() {
    this.loadingSubject.next(true);

    this.formEntidadAux.patchValue({
      IdEstudiante: this.form.value.IdEntidad,
      IdTipoEntidad: this.form.value.IdIdioma,
      Comentario: this.form.value.Descripcion,
    });

    return this.httpClient
      .post<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'create-d'),
        this.formEntidadAux.value,
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }


  /*
  set() {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + "create-descripcion/1/1/asdfasdfasdf"),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }*/

  update() {
    this.loadingSubject.next(true);

    this.formEntidadAux.patchValue({
      IdEstudiante: this.form.value.IdEntidad,
      IdTipoEntidad: this.form.value.IdIdioma,
      Comentario: this.form.value.Descripcion,
    });

    return this.httpClient
      .put<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'update-d/' + this.form.value.idEntidadDescripcion),
        this.formEntidadAux.value,
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
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'delete-descripcion/' + this.form.value.idEntidadDescripcion),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }
}
