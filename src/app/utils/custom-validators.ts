import { ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { ValidationsService } from '../services/validations.service';
import { SegUsuario } from '../models/Seguridad/seg-usuario';
import { timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

export class CustomValidators {

    constructor() { }

    static equalsValidator(otherControl: AbstractControl): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const value: any = control.value;
            const otherValue: any = otherControl.value;
            return otherValue === value ? null : { notEquals: { value, otherValue } };
        };
    }

    /*private validarUsuario(control: AbstractControl) {
        const username = control.value;
        let error = null;
        /*if (!username.includes('$')) {
          error = { ...error, dollar: 'needs a dollar symbol' };
        }
        if (!parseFloat(username[0])) {
          error = { ...error, number: 'must start with a number' };
        }*/
    //     return error;
    //  }
}

export const loginAsyncValidator = (validationService: ValidationsService, time: number = 500) => {
    return (input: FormControl) => {
        return timer(time).pipe(
            switchMap(() => validationService.userNameExist(input.value)),
            map(res => {
                return isNullOrUndefined(res.data) ? null : { loginExist: true };
            })
        );
    };
};
