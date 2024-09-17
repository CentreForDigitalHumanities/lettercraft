import _ from "underscore";

/**
 * Exclude all values from a list that have a matching value in another list, based
 * on the specified property.
 *
 * Similar to _.difference, but compares on a specified key.
 *
 * @param list The starting list
 * @param others The list with values to excluded
 * @param key The property by which to compare objects
 * @returns The contents of `list` for which no value in `others` matches the `key`
 * property.
 */
export const differencyBy = <T extends object>(
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
 * splat(Math.min)([3, 5, 2]) // => 2
 * ```
 *
 * @param func Function to transform
 * @return A function that accepts an array of the arguments to `func`, and returns
 * the output of `func`.
 */
export const splat = <I, O>(func: (...a: I[]) => O) =>
    (args: I[]) => func(...args);
