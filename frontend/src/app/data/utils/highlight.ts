import _ from 'underscore';

export interface HighlightSegment {
    text: string;
    highlight: boolean;
}

export interface HighlightRange {
    start: number;
    end: number;
}


export function highlightSegments (value: string, query?: string): HighlightSegment[] {
    const ranges = getRanges(value, query);
    return toSegments(value, ranges);
}


export function getRanges(value: string, query?: string): HighlightRange[] {
    if (!query || !query.trim()) {
        return [];
    }

    const matches = findMatches(value, query);
    return matchRanges(matches);

}


/** parse query into an array in regular expressions */
function parseQuery(query: string): RegExp[] {
    const terms = query.split(/\s+/);
    return terms.map(term => {
        const escaped = (RegExp as unknown as any).escape(term) // RegExp.escape requires Typescript >= 6.0 to be recognised
        return RegExp(escaped, 'gi');
    });
}


/** find matches to each term in the query */
function findMatches(text: string, query: string): RegExpStringIterator<RegExpExecArray>[] {
    const patterns = parseQuery(query);
    return patterns.map(pattern => text.matchAll(pattern));
}


/** merge regex matches into sorted array of non-overlapping ranges */
function matchRanges(matches: RegExpStringIterator<RegExpExecArray>[]): HighlightRange[] {
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
export function toSegments(
    text: string, highlightRanges: HighlightRange[], startIndex: number = 0
): HighlightSegment[] {
    if (!highlightRanges.length) {
        if (startIndex < text.length) {
            return [{ text: text.slice(startIndex), highlight: false }];
        } else {
            return [];
        }
    }

    const next = highlightRanges[0];
    const lead: HighlightSegment[] =
        next.start > startIndex ?
        [{ text: text.slice(startIndex, next.start), highlight: false }] :
        [];
    const match: HighlightSegment = { text: text.slice(next.start, next.end), highlight: true };
    const tail: HighlightSegment[] = toSegments(text, highlightRanges.slice(1), next.end);

    return [...lead, match, ...tail];
}
