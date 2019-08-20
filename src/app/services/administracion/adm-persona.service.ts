import { Injectable } from '@angular/core';

import { AuthService } from '../../services/seguridad/auth.service';
import { AppConstantsService } from '../../utils/app-constants.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdmPersonaService {

  private BaseURL = 'adm-persona/';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private authService: AuthService, private httpClient: HttpClient, private CONSTANS: AppConstantsService) { }

  form: FormGroup = new FormGroup({
    IdPersona: new FormControl(null),
    PrimerNombre: new FormControl('', Validators.required),
    SegundoNombre: new FormControl(''),
    ApellidoPaterno: new FormControl('', Validators.required),
    ApellidoMaterno: new FormControl('', Validators.required)
  });

  InicializarValoresFormGroup() {
    this.form.setValue({
      IdPersona: null,
      PrimerNombre: '',
      SegundoNombre: '',
      ApellidoPaterno: '',
      ApellidoMaterno: ''
    });
  }

  getPersonas(): Observable<any>  {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl( this.BaseURL ),
        { headers: this.CONSTANS.getApiHeaders( this.authService.getToken() ) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  viewPersona(IdPersona: number) {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl( this.BaseURL + 'view/' + IdPersona ),
        { headers: this.CONSTANS.getApiHeaders( this.authService.getToken() ) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  setPersona() {
    this.loadingSubject.next(true);
    return this.httpClient
      .post<any>(
        this.CONSTANS.getApiUrl( this.BaseURL + 'create' ),
        this.form.value,
        { headers: this.CONSTANS.getApiHeaders( this.authService.getToken() ) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  updatePersona() {
    this.loadingSubject.next(true);
    return this.httpClient
      .put<any>(
        this.CONSTANS.getApiUrl( this.BaseURL + 'update/' + this.form.value.IdPersona ),
        this.form.value,
        { headers: this.CONSTANS.getApiHeaders( this.authService.getToken() ) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  deletePersona(IdPersona: number) {
    this.loadingSubject.next(true);
    return this.httpClient
      .delete<any>(
        this.CONSTANS.getApiUrl( this.BaseURL + 'delete/' + IdPersona ),
        { headers: this.CONSTANS.getApiHeaders( this.authService.getToken() ) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }
}
