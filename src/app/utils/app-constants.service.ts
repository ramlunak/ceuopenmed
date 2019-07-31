import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AppConstantsService {

  private API_URL = 'http://api.ceuopenmed.com/';

  constructor() { }

  getApiUrl(module?: string) {
    if (isNullOrUndefined(module)) {
      return this.API_URL;
    } else {
      return this.API_URL + module;
    }
  }

  getApiHeaders(accesstoken?: string) {
    if ( isNullOrUndefined(accesstoken) ) {
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
}
