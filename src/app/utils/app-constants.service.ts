import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})

export class AppConstantsService {

  //private API_URL = 'http://localhost/CeuopenmedAPI/backend/web/';
  // private API_URL = 'http://copenmed.org/CeuopenmedAPI/backend/web/';
  private API_URL = 'http://copenmed.org/ceuopenapi_dev/backend/web/';

  private ROLES = { Administrador: 1, Profesor: 2, Estudiante: 3 };

  constructor() { }

  getApiUrl(module?: string) {
    if (isNullOrUndefined(module)) {
      return this.API_URL;
    } else {
      return this.API_URL + module;
    }
  }

  getApiHeaders(accesstoken?: string) {
    if (isNullOrUndefined(accesstoken)) {
      return new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Access-Token': accesstoken
      });
    }
  }

  getRoles() {
    return this.ROLES;
  }
}
