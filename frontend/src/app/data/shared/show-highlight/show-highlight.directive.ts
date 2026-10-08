import { Directive, effect, ElementRef, inject, input, OnDestroy } from '@angular/core';
import { HighlightService } from '@services/highlight.service';
import { getRanges } from '../../utils/highlight';

@Directive({
    selector: '[lcShowHighlight]',
})
export class ShowHighlightDirective implements OnDestroy {
    query = input<string>();

    private elementRef: ElementRef<HTMLElement> = inject(ElementRef);
    private highlightService = inject(HighlightService);
    private ranges: Range[] = [];

    constructor() {
        effect(() => this.makeHighlights(this.query()));
    }

    ngOnDestroy(): void {
        this.clearHighlights();
    }

    makeHighlights(query?: string) {
        this.clearHighlights();
        const el = this.elementRef.nativeElement;
        this.addHighlightRanges(el, query);
        this.highlightService.add(...this.ranges);
    }

    clearHighlights() {
        this.highlightService.remove(...this.ranges);
        this.ranges = [];
    }

    private addHighlightRanges(node: Node, query?: string) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {

            const text = node.textContent;
            const matches = getRanges(text, query);
            if (matches.length) {
                matches.forEach(match => {
                    const range = new Range();
                    range.setStart(node, match.start);
                    range.setEnd(node, match.end);
                    this.ranges.push(range);
                });
            }
        }
        if (node.hasChildNodes()) {
            node.childNodes.forEach(child => this.addHighlightRanges(child, query));
        }
    }
}
