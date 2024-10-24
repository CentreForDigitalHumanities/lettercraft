import { Entity, SourceMention } from "generated/graphql";
import { FormStatus, SelectOptions } from "./types";
import { BehaviorSubject } from "rxjs";

export const sourceMentionSelectOptions = (): SelectOptions<SourceMention> => [
    { value: SourceMention.Direct, label: 'Directly mentioned' },
    { value: SourceMention.Implied, label: 'Implied' },
    { value: SourceMention.UpForDebate, label: 'Up for debate' },
];

export const formStatusSubject = () => new BehaviorSubject<FormStatus>('idle');

/** names of entity types in natural language */
export const entityTypeNames: Record<Entity, string> = {
    [Entity.Agent]: 'agent',
    [Entity.Gift]: 'gift',
    [Entity.Letter]: 'letter',
    [Entity.Space]: 'location',
};

export const nameExamples: Record<string, string[]> = {
    episode: ['journey to Rome', 'Clovis\' response', 'Radegund asks Germanus for help'],
    agent: ['Radegund', 'messenger from Poitiers', 'the citizens of Arles'],
    letter: ['letter from Radegund to Germanus', 'Radegund\'s first letter'],
    gift: ['royal gifts', 'golden cup'],
    location: ['Alemannia', 'royal court', 'ducal villa'],
}

/** wrap each item in quotation marks and join them into a comma-separated string */
export const listWithQuotes = (names: string[]): string =>
    names.map(name => `"${name}"`).join(', ');
