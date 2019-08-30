import { Injectable } from '@angular/core';

import { AuthService } from '../../services/seguridad/auth.service';
import { AppConstantsService } from '../../utils/app-constants.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { CustomValidators } from 'src/app/utils/custom-validators';

@Injectable({
  providedIn: 'root'
})
export class SegUsuarioService {

  private BaseURL = '';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordconf: new FormControl('', Validators.required),
    IdRol: new FormControl(''),
    IdPersona: new FormControl('')
  });

  formChangePass: FormGroup = new FormGroup({
    id: new FormControl(null),
    upassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    upasswordconf: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService, private httpClient: HttpClient, private CONSTANS: AppConstantsService) {
    this.form.get('passwordconf').setValidators(
      CustomValidators.equalsValidator(this.form.get('password'))
    );
    this.formChangePass.get('upasswordconf').setValidators(
      CustomValidators.equalsValidator(this.formChangePass.get('upassword'))
    );
  }

  InicializarValoresFormGroup() {
    this.form.setValue({
      id: null,
      username: '',
      email: '',
      password: '',
      passwordconf: '',
      IdRol: '',
      IdPersona: ''
    });
  }

  InicializarValoresFormChangePassGroup() {
    this.formChangePass.setValue({
      id: null,
      upassword: '',
      upasswordconf: ''
    });
  }

  setUsuario() {
    this.loadingSubject.next(true);
    return this.httpClient
      .post<any>(
        this.CONSTANS.getApiUrl('register'),
        this.form.value,
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  updateUsuario() {
    this.loadingSubject.next(true);
    return this.httpClient
      .put<any>(
        this.CONSTANS.getApiUrl(this.BaseURL + 'update/' + this.form.value.IdUsuario),
        this.form.value,
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

}
