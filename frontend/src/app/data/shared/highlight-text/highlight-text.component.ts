import { Component, input } from '@angular/core';
import { Segment } from '../highlight/highlight.pipe';

@Component({
    selector: 'lc-highlight-text',
    imports: [],
    templateUrl: './highlight-text.component.html',
    styleUrl: './highlight-text.component.scss',
})
export class HighlightTextComponent {
    segments = input.required<Segment[]>();
}
