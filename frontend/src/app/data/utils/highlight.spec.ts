import { highlightSegments } from "./highlight";


describe('highlightSegments', () => {

    it('handles no matches', () => {
        const result = highlightSegments(
            'frog and toad are friends',
            'snail',
        );
        expect(result).toEqual([
            { text: 'frog and toad are friends', highlight: false },
        ]);
    });

    it('highlights query match', () => {
        const result = highlightSegments(
            'frog and toad are friends',
            'toad',
        );
        expect(result).toEqual([
            { text: 'frog and ', highlight: false },
            { text: 'toad', highlight: true },
            { text: ' are friends', highlight: false },
        ]);
    });

    it('is not case-sensitive', () => {
        const result = highlightSegments(
            'Frog and Toad are Friends',
            'toad',
        );
        expect(result).toEqual([
            { text: 'Frog and ', highlight: false },
            { text: 'Toad', highlight: true },
            { text: ' are Friends', highlight: false },
        ]);
    });

    it('highlights multiple matches', () => {
        const result = highlightSegments(
            'toad and toad are friends',
            'toad',
        );
        expect(result).toEqual([
            { text: 'toad', highlight: true },
            { text: ' and ', highlight: false },
            { text: 'toad', highlight: true },
            { text: ' are friends', highlight: false },
        ]);
    });

    it('highlights multi-word queries', () => {
        const result = highlightSegments(
            'frog and toad are friends',
            'toad frog',
        );
        expect(result).toEqual([
            { text: 'frog', highlight: true },
            { text: ' and ', highlight: false },
            { text: 'toad', highlight: true },
            { text: ' are friends', highlight: false },
        ]);
    });

    it('escapes regex queries', () => {
        const result = highlightSegments(
            'frog and toad are friends',
            '.*',
        );
        expect(result).toEqual([
            { text: 'frog and toad are friends', highlight: false },
        ]);
    });

    it('handles overlapping matches', () => {
        const result = highlightSegments(
            'frog and toad are friends',
            'friend toad friends',
        );
        expect(result).toEqual([
            { text: 'frog and ', highlight: false },
            { text: 'toad', highlight: true },
            { text: ' are ', highlight: false },
            { text: 'friends', highlight: true },
        ]);
    });

    it('empty query', () => {
        const result = highlightSegments(
            'frog and toad are friends',
            undefined,
        );
        expect(result).toEqual([
            { text: 'frog and toad are friends', highlight: false }
        ]);
    });

    it('ignores whitespace-only query', () => {
        const result = highlightSegments(
            'frog and toad are friends',
            ' ',
        );
        expect(result).toEqual([
            { text: 'frog and toad are friends', highlight: false }
        ]);
    });
});
