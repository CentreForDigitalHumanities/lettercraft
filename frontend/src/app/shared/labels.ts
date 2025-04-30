import { SourceMention } from "generated/graphql";

export const sourceMentionLabels: Record<SourceMention, string> = {
    [SourceMention.Direct]: 'directly mentioned',
    [SourceMention.Implied]: 'implied',
    [SourceMention.UpForDebate]: 'up for debate',
};
