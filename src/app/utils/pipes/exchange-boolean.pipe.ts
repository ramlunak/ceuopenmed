import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exchangeBoolean'
})
export class ExchangeBooleanPipe implements PipeTransform {

  transform(value: string): string {
    if (value === '1') {
      return 'Si';
    } else {
      return 'No';
    }
  }

}
