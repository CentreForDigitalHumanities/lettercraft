import { SentenceCasePipe } from './sentence-case.pipe';

describe('SentenceCasePipe', () => {
    it('create an instance', () => {
        const pipe = new SentenceCasePipe();
        expect(pipe).toBeTruthy();
    });

    it('transforms strings to sentence case', () => {
        const pipe = new SentenceCasePipe();

        const testCases: Array<[string, string]> = [
            ['abc', 'Abc'],
            ['a', 'A'],
            ['', ''],
        ];

        for (const [input, output] of testCases) {
            expect(pipe.transform(input)).toEqual(output);
        }
    });
});
