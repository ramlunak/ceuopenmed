import { Injectable } from '@angular/core';

import { AuthService } from './seguridad/auth.service';
import { AppConstantsService } from '../utils/app-constants.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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

}
