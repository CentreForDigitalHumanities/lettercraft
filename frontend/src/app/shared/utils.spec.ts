import { differenceBy, moveItemInArray, splat } from "./utils";

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

describe("moveItemInArray", () => {
    it("should move an item in an array", () => {
        const array = ["Alice", "Bernard", "Claire", "David", "Eve"];
        expect(moveItemInArray(array, 1, 3)).toEqual([
            "Alice",
            "Claire",
            "David",
            "Bernard",
            "Eve",
        ]);
    });

    it("should return the same array if the indices are the same", () => {
        const array = ["Alice", "Bernard", "Claire", "David", "Eve"];
        expect(moveItemInArray(array, 4, 4)).toBe(array);
    });

    it("should return the same array if the indices are out of bounds", () => {
        const array = ["Alice", "Bernard", "Claire", "David", "Eve"];
        expect(moveItemInArray(array, -99, 99)).toBe(array);
    });
});
