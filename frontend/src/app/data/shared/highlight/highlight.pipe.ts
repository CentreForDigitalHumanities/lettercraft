import { Pipe, PipeTransform } from '@angular/core';
import _ from 'underscore';

export interface Segment {
    text: string;
    highlight: boolean;
}

interface HighlightRange {
    start: number;
    end: number;
}

@Pipe({
    name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

    transform(value: string, query?: string): Segment[] {
        if (!query) {
            return this.toSegments(value, []);
        }
        const matches = this.findMatches(value, query);
        const ranges = this.matchRanges(matches);
        return this.toSegments(value, ranges);
    }

    /** parse query into an array in regular expressions */
    private parseQuery(query: string): RegExp[] {
        const terms = query.split(/\s+/);
        return terms.map(term => {
            const escaped = (RegExp as unknown as any).escape(term) // RegExp.escape requires Typescript >= 6.0 to be recognised
            return RegExp(escaped, 'gi');
        });
    }

    /** find matches to each term in the query */
    private findMatches(text: string, query: string): RegExpStringIterator<RegExpExecArray>[] {
        const patterns = this.parseQuery(query);
        return patterns.map(pattern => text.matchAll(pattern));
    }

    /** merge regex matches into sorted array of non-overlapping ranges */
    private matchRanges(matches: RegExpStringIterator<RegExpExecArray>[]): HighlightRange[] {
        const ranges: HighlightRange[] = [];
        for (let termMatches of matches) {
            for (let match of termMatches) {
                const start = match.index;
                const end = match.index + match[0].length;

                const overlap = ranges.find(range => range.start <= end && range.end >= start);
                if (overlap) {
                    overlap.start = Math.min(overlap.start, start);
                    overlap.end = Math.max(overlap.end, end);
                } else {
                    ranges.push({start, end });
                }
            }
        }
        return ranges.sort((a, b) => a.start - b.start);
    }

    /** convert text with highlight ranges to segment array */
    private toSegments(
        text: string, highlightRanges: HighlightRange[], startIndex: number = 0
    ): Segment[] {
        if (!highlightRanges.length) {
            if (startIndex < text.length) {
                return [{ text: text.slice(startIndex), highlight: false }];
            } else {
                return [];
            }
        }

        const next = highlightRanges[0];
        const lead: Segment[] =
            next.start > startIndex ?
            [{ text: text.slice(startIndex, next.start), highlight: false }] :
            [];
        const match: Segment = { text: text.slice(next.start, next.end), highlight: true };
        const tail: Segment[] = this.toSegments(text, highlightRanges.slice(1), next.end);

        return [...lead, match, ...tail];
    }
}
