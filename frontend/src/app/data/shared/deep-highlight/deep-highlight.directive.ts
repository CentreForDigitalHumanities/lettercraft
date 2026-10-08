import { Directive, effect, ElementRef, inject, input, OnDestroy } from '@angular/core';
import { HighlightService } from '@services/highlight.service';
import { getRanges } from '../../utils/highlight';

@Directive({
    selector: '[lcDeepHighlight]',
})
export class DeepHighlightDirective implements OnDestroy {
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
        if (query) {
            const el = this.elementRef.nativeElement;
            const ranges = this.nodeHighlightRanges(el, query);
            this.ranges = this.ranges.concat(ranges);
        }
        this.highlightService.add(...this.ranges);
    }


    clearHighlights() {
        this.highlightService.remove(...this.ranges);
        this.ranges = [];
    }


    private nodeHighlightRanges(node: Node, query: string): Range[] {
        let ranges: Range[] = [];
        ranges = ranges.concat(this.nodeTextHighlightRanges(node, query));
        ranges = ranges.concat(this.nodeChildHighlightRanges(node, query));
        return ranges;
    }


    private nodeTextHighlightRanges(node: Node, query: string): Range[] {
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
            const text = node.textContent;
            const matches = getRanges(text, query);
            return matches.map(match => {
                const range = new Range();
                range.setStart(node, match.start);
                range.setEnd(node, match.end);
                return range;
            });
        }
        return [];
    }

    private nodeChildHighlightRanges(node: Node, query: string): Range[] {
        if (node.hasChildNodes()) {
            let ranges: Range[] = [];
            node.childNodes.forEach(child =>
                ranges = ranges.concat(this.nodeHighlightRanges(child, query))
            );
            return ranges;
        }
        return [];
    }
}
