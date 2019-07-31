import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstantsService } from '../../utils/app-constants.service';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SegUsuarioService {

  constructor(private httpClient: HttpClient, private CONSTANS: AppConstantsService) { }

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    username: new FormControl(null),
    email: new FormControl(null),
    password: new FormControl(null)
  });
}
