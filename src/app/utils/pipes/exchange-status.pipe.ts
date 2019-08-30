import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exchangeStatus'
})
export class ExchangeStatusPipe implements PipeTransform {

  transform(value: string): string {
    if (value === '10') {
      return 'Activo';
    } else {
      return 'Inactivo';
    }

  }

}
