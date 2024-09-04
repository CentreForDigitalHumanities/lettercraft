import { SourceMention } from "generated/graphql";
import { SelectOptions } from "./types";

export const sourceMentionSelectOptions = (): SelectOptions<SourceMention> => [
    { value: SourceMention.Direct, label: 'Directly mentioned' },
    { value: SourceMention.Implied, label: 'Implied' }
];
