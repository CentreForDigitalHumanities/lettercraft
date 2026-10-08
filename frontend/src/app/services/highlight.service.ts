import { Injectable } from "@angular/core";

/**
 * Service for using the CSS custom highlight API.
 *
 * This is used in tandem with the DeepHighlightDirective which registers highlight
 * ranges via this service. The Highlight instance on which ranges are registered must be
 * a singleton, so this service is necessary to register highlights in multiple
 * components.
 *
 * (Note that the TextHighlightComponent does not rely on the Highlight API,
 * so it does not use this service.)
 */
@Injectable({
    providedIn: 'root'
})
export class HighlightService {
    private highlight = new Highlight();

    constructor() {
        (CSS.highlights as unknown as any).set('search-highlight', this.highlight);
    }

    add(...ranges: Range[]) {
        ranges.forEach(range =>
            (this.highlight as unknown as any).add(range)
        );
    }

    remove(...ranges: Range[]) {
        ranges.forEach(range =>
            (this.highlight as unknown as any).delete(range)
        );
    }
}
