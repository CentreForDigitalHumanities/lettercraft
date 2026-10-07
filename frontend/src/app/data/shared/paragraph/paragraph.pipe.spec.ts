import { ParagraphPipe } from './paragraph.pipe';

describe('ParagraphPipe', () => {
    it('splits paragraphs', () => {
        const pipe = new ParagraphPipe();
        expect(pipe.transform('a\nbcd\nef')).toEqual(['a', 'bcd', 'ef']);
    });
});
