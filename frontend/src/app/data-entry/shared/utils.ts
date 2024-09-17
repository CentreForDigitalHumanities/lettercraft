import { Entity, SourceMention } from "generated/graphql";
import { FormStatus, SelectOptions } from "./types";
import { BehaviorSubject } from "rxjs";
import _ from "underscore";

export const sourceMentionSelectOptions = (): SelectOptions<SourceMention> => [
    { value: SourceMention.Direct, label: 'Directly mentioned' },
    { value: SourceMention.Implied, label: 'Implied' }
];

export const formStatusSubject = () => new BehaviorSubject<FormStatus>('idle');

/** names of entity types in natural language */
export const entityTypeNames: Record<Entity, string> = {
    [Entity.Agent]: 'agent',
    [Entity.Gift]: 'gift',
    [Entity.Letter]: 'letter',
    [Entity.Space]: 'location',
};
