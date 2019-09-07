import { Injectable } from '@angular/core';

import { AuthService } from '../../services/seguridad/auth.service';
import { AppConstantsService } from '../../utils/app-constants.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, finalize } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { CustomValidators, loginAsyncValidator } from 'src/app/utils/custom-validators';
import { UpdateUsuario } from 'src/app/models/Seguridad/update-usuario';
import { ValidationsService } from '../validations.service';

@Injectable({
  providedIn: 'root'
})
export class SegUsuarioService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    username: new FormControl('', [Validators.required],
      loginAsyncValidator(this.validationsService)),
    email: new FormControl('', Validators.email),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordconf: new FormControl('', Validators.required),
    IdRol: new FormControl(''),
    IdPersona: new FormControl('')
  });

  formChangePass: FormGroup = new FormGroup({
    id: new FormControl(null),
    uusername: new FormControl(''),
    oldpassword: new FormControl(''),
    upassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    upasswordconf: new FormControl('', Validators.required)
  });

  formUpdate: FormGroup = new FormGroup({
    id: new FormControl(null),
    email: new FormControl('', Validators.email),
    status: new FormControl('', Validators.required),
    changePass: new FormControl(false, Validators.required)
  });

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private CONSTANS: AppConstantsService,
    private validationsService: ValidationsService
  ) {
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
      uusername: '',
      oldpassword: '',
      upassword: '',
      upasswordconf: ''
    });
  }

  InicializarValoresFormUpdateGroup() {
    this.formUpdate.setValue({
      id: null,
      email: '',
      status: '',
      changePass: false
    });
  }

  viewUsuario(id: number) {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl('view-user/' + id),
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
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
    const user: UpdateUsuario = {
      email: this.formUpdate.value.email,
      status: this.formUpdate.value.status,
      changePass: this.formUpdate.value.changePass,
      password: this.formChangePass.value.upassword
    };

    return this.httpClient
      .put<any>(
        this.CONSTANS.getApiUrl('update-user/' + this.formUpdate.value.id),
        user,
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  changePassword() {
    this.loadingSubject.next(true);
    return this.httpClient
      .put<any>(
        this.CONSTANS.getApiUrl('change-password/' + this.formChangePass.value.id),
        this.formChangePass.value,
        { headers: this.CONSTANS.getApiHeaders(this.authService.getToken()) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

}
