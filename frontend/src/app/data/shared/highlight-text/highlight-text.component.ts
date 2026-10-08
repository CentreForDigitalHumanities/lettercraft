import { Component, computed, input } from '@angular/core';
import { highlightSegments } from '../../utils/highlight';

@Component({
    selector: 'lc-highlight-text',
    imports: [],
    templateUrl: './highlight-text.component.html',
    styleUrl: './highlight-text.component.scss',
})
export class HighlightTextComponent {
    text = input.required<string>();
    query = input<string>();

    segments = computed(() => highlightSegments(this.text(), this.query()));
}
