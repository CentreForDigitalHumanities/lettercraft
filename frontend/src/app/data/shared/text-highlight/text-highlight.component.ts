import { Component, computed, input } from '@angular/core';
import { highlightSegments } from '../../utils/highlight';

@Component({
    selector: 'lc-text-highlight',
    imports: [],
    templateUrl: './text-highlight.component.html',
    styleUrl: './text-highlight.component.scss',
})
export class TextHighlightComponent {
    text = input.required<string>();
    query = input<string>();

    segments = computed(() => highlightSegments(this.text(), this.query()));
}
