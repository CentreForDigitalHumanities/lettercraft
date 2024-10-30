import _ from "underscore";

/**
 * Exclude all values from a list that have a matching value in another list, based
 * on the specified property.
 *
 * Similar to _.difference, but compares on a specified key.
 *
 * @param list The starting list
 * @param others The list with values to exclude
 * @param key The property by which to compare objects
 * @returns The contents of `list` for which no value in `others` matches the `key`
 * property.
 */
export const differenceBy = <T extends object>(
    list: T[], others: object[], key: string
): T[] => {
    const getValue = (obj: object) => _.get(obj, key, undefined);
    const excludeValues = others.map(getValue);
    return list.filter(item => !excludeValues.includes(getValue(item)));
}

/**
 * Wrapper for functions to accept arguments as an array.
 *
 * For example:
 *
 * ```ts
 * splat(Math.min)([3, 5, 2]) // => Math.min(3, 5, 2) => 2
 * ```
 *
 * @param func Function to transform
 * @returns A function that accepts an array of the arguments to `func`, and returns
 * the output of `func`.
 */
export const splat = <I, O>(func: (...a: I[]) => O) =>
    (args: I[]) => func(...args);


/**
 * Moves an item within an array from one index to another. Returns the same array if the from and to indices are identical or out of bounds.
 *
 * @param {T[]} array - The array containing the item to move.
 * @param {number} fromIndex - The index of the item to move.
 * @param {number} toIndex - The index to move the item to.
 * @returns {T[]} The array with the item moved to the new index.
 */
export function moveItemInArray<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    if (fromIndex === toIndex) {
        return array;
    }

    const fromIndexOutOfBounds = fromIndex < 0 || fromIndex >= array.length;
    const toIndexOutOfBounds = toIndex < 0 || toIndex >= array.length;

    if (fromIndexOutOfBounds || toIndexOutOfBounds) {
        return array;
    }

    const item = array.splice(fromIndex, 1)[0];
    array.splice(toIndex, 0, item);
    return array;
}
