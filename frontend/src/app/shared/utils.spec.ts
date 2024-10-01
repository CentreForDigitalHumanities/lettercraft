import { differenceBy, splat } from "./utils";

describe('differenceBy', () => {
    it('should compare lists', () => {
        const a = [
            { id: '1', name: 'Bert' },
            { id: '2', name: 'Ernie' },
            { id: '3', name: 'Elmo' },
            { id: '4', name: 'Big Bird' },
        ];
        const b = [
            { id: '2' },
            { id: '4' },
        ];
        expect(differenceBy(a, b, 'id')).toEqual([a[0], a[2]]);
    });
});

describe('splat', () => {
    it('should handle a list of arguments', () => {
        expect(splat(Math.min)([3, 5, 2])).toBe(2)
    });
});
