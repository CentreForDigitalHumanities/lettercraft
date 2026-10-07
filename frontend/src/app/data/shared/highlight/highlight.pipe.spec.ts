import { HighlightPipe } from './highlight.pipe';

describe('HighlightPipe', () => {
    let pipe: HighlightPipe;

    beforeEach(() => {
        pipe = new HighlightPipe();
    });

    it('handles no matches', () => {
        const result = pipe.transform(
            'frog and toad are friends',
            'snail',
        );
        expect(result).toEqual([
            { text: 'frog and toad are friends', highlight: false },
        ]);
    });

    it('highlights query match', () => {
        const result = pipe.transform(
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
        const result = pipe.transform(
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
        const result = pipe.transform(
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
        const result = pipe.transform(
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
});
