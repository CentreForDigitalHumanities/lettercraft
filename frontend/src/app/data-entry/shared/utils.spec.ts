import { differencyBy } from "./utils";

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
        expect(differencyBy(a, b, 'id')).toEqual([a[0], a[2]]);
    });
});
