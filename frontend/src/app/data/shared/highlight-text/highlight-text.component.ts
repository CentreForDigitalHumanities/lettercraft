import { Component, input } from '@angular/core';
import { HighlightPipe } from '../highlight/highlight.pipe';

@Component({
    selector: 'lc-highlight-text',
    imports: [
        HighlightPipe,
    ],
    templateUrl: './highlight-text.component.html',
    styleUrl: './highlight-text.component.scss',
})
export class HighlightTextComponent {
    text = input.required<string>();
    query = input<string>();
}
