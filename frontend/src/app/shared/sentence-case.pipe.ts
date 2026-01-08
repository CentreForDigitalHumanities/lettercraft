import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sentenceCase',
    standalone: false
})
export class SentenceCasePipe implements PipeTransform {

    transform(value: string): string {
        return value.slice(0, 1).toUpperCase() + value.slice(1);
    }

}
