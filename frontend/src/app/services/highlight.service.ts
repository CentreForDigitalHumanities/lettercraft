import { Injectable } from "@angular/core";

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
