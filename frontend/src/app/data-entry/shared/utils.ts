import { SourceMention } from "generated/graphql";
import { FormStatus, SelectOptions } from "./types";
import { BehaviorSubject } from "rxjs";

export const sourceMentionSelectOptions = (): SelectOptions<SourceMention> => [
    { value: SourceMention.Direct, label: 'Directly mentioned' },
    { value: SourceMention.Implied, label: 'Implied' }
];

export const formStatusSubject = () => new BehaviorSubject<FormStatus>('idle');
