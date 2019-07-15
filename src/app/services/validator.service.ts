import { Injectable } from '@angular/core';
import { FormControlName,FormControl, FormGroup ,Validators} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  //VALIDACIONES
   
  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    nombre: new FormControl('',Validators.required)
  });

}
