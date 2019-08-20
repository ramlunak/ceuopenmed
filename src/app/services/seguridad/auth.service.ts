import { Injectable } from '@angular/core';

import { SegUsuario } from '../../models/Seguridad/seg-usuario';
import { AppConstantsService } from '../../utils/app-constants.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map, finalize } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  public showMenus = false;
  currentUser: SegUsuario;

  constructor(private httpClient: HttpClient, private CONSTANS: AppConstantsService) { }

  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  InicializarValoresFormGroup() {
    this.form.setValue({
      username: '',
      password: ''
    });
  }

  loginUser() {
    this.loadingSubject.next(true);
    return this.httpClient
      .post<any>(
        this.CONSTANS.getApiUrl('authorize'),
        this.form.value,
        { headers: this.CONSTANS.getApiHeaders() }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  // tslint:disable-next-line: variable-name
  requestAccesToken(authorization_code: string) {
    this.loadingSubject.next(true);
    return this.httpClient
      .post<any>(
        this.CONSTANS.getApiUrl('accesstoken'),
        { authorization_code },
        { headers: this.CONSTANS.getApiHeaders() }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  getMyInformations(accesToken: string) {
    this.loadingSubject.next(true);
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl('me'),
        { headers: this.CONSTANS.getApiHeaders(accesToken) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

  setUser(user: object): void {
    const userString = JSON.stringify(user);
    localStorage.setItem('currentUser', userString);
  }

  setToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  getCurrentUser(): SegUsuario {
    const userString = localStorage.getItem('currentUser');
    if (!isNullOrUndefined(userString)) {
      this.currentUser = JSON.parse(userString);
      return this.currentUser;
    } else {
      return null;
    }
  }

  logoutUser() {
    this.loadingSubject.next(true);
    const accesToken = localStorage.getItem('accessToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    return this.httpClient
      .get<any>(
        this.CONSTANS.getApiUrl('logout'),
        { headers: this.CONSTANS.getApiHeaders(accesToken) }
      )
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        map(res => res)
      );
  }

}
