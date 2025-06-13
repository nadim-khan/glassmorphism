import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortName',
  standalone: true
})
export class ShortNamePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    debugger
    let updated = '';
    if (value && value.trim() !== '') {
      let arr = value.split(' ');
      updated = arr.length > 1 ? arr[0].charAt(0) + arr[1].charAt(0) : arr[0].charAt(0) + arr[0].charAt(1)
    }
    return updated.toUpperCase();
  }

}
