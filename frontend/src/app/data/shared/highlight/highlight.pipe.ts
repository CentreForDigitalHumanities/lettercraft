import { Pipe, PipeTransform } from '@angular/core';

export interface Segment {
    text: string;
    highlight: boolean;
}

@Pipe({
    name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

    transform(value: string, query: string): Segment[] {
        return [];
    }
}
