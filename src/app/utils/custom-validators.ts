import { ValidatorFn, AbstractControl } from '@angular/forms';

export class CustomValidators {

    constructor() { }

    static equalsValidator(otherControl: AbstractControl): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const value: any = control.value;
            const otherValue: any = otherControl.value;
            return otherValue === value ? null : { notEquals: { value, otherValue } };
        };
    }
}
