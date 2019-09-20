import { Injectable } from '@angular/core';

import { AuthService } from '../../services/seguridad/auth.service';
import { AppConstantsService } from '../../utils/app-constants.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocProfesorService {

  private BaseURL = 'doc-profesor/';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private authService: AuthService, private httpClient: HttpClient, private CONSTANS: AppConstantsService) { }

  form: FormGroup = new FormGroup({
    IdProfesor: new FormControl(null),
    IdPersona: new FormControl(null)
  });

  formEspecialidad: FormGroup = new FormGroup({
    IdProfesor: new FormControl(null),
    IdEspecialidad: new FormControl('', Validators.required)
  });

  formGrupos: FormGroup = new FormGroup({
    IdProfesor: new FormControl(null),
    IdGrupo: new FormControl('', Validators.required)
  });

  InicializarValoresFormGroup() {
    this.form.setValue({
      IdProfesor: null,
      IdPersona: ''
    });
  }

  InicializarValoresFormEspecialidadGroup() {
    this.formEspecialidad.setValue({
      IdProfesor: null,
      IdEspecialidad: ''
    });
  }

  InicializarValoresFormGruposGroup() {
    this.formGrupos.setValue({
      IdProfesor: null,
      IdGrupo: ''
    });
  }

  getProfesores(): Observable<any> {
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

  viewProfesor(IdProfesor: number) {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'view/' + IdProfesor),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  setProfesor() {
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

  updateProfesor() {
    this.loadingSubject.next(true);
    return this.httpClient
      .put<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'update/' + this.form.value.IdProfesor),
        this.form.value,
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  deleteProfesor() {
    this.loadingSubject.next(true);
    return this.httpClient
      .delete<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'delete/' + this.form.value.IdProfesor),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  // Especialidades
  getEspecialidades(IdProfesor: number): Observable<any> {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'especialidades/' + IdProfesor),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  getUnsolicitedEspecialidades(IdProfesor: number): Observable<any> {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'unsolicited-especialidades/' + IdProfesor),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  setProfesorEspecialidad() {
    this.loadingSubject.next(true);
    return this.httpClient
      .post<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'create-especialidad'),
        this.formEspecialidad.value,
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  deleteProfesorEspecialidad() {
    this.loadingSubject.next(true);
    return this.httpClient
      .delete<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'delete-especialidad/' + this.formEspecialidad.value.IdProfesor +
          '/' + this.formEspecialidad.value.IdEspecialidad),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  // Grupos
  getGrupos(IdProfesor: number): Observable<any> {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'grupos/' + IdProfesor),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  getUnsolicitedGroups(IdProfesor: number): Observable<any> {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'unsolicited-groups/' + IdProfesor),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  setProfesorGrupo() {
    this.loadingSubject.next(true);
    return this.httpClient
      .post<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'create-grupo'),
        this.formGrupos.value,
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  deleteProfesorGrupo() {
    this.loadingSubject.next(true);
    return this.httpClient
      .delete<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'delete-grupo/' + this.formGrupos.value.IdProfesor + '/' + this.formGrupos.value.IdGrupo),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }
}
