import { SourceMention } from "generated/graphql";
import { FormStatus, SelectOptions } from "./types";
import { BehaviorSubject } from "rxjs";
import _ from "underscore";

export const sourceMentionSelectOptions = (): SelectOptions<SourceMention> => [
    { value: SourceMention.Direct, label: 'Directly mentioned' },
    { value: SourceMention.Implied, label: 'Implied' }
];

export const formStatusSubject = () => new BehaviorSubject<FormStatus>('idle');

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
