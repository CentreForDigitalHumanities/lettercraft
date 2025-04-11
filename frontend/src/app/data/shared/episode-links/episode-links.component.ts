import { Component, Input } from '@angular/core';
import { dataIcons } from '@shared/icons';
import { sourceMentionLabels } from '@shared/labels';
import { SourceMention, ViewAgentQuery, ViewGiftQuery, ViewLetterQuery, ViewLocationQuery } from 'generated/graphql';

type QueriedEpisodeLink =
    | NonNullable<ViewAgentQuery["agentDescription"]>["episodes"][number]
    | NonNullable<ViewLetterQuery["letterDescription"]>["episodes"][number]
    | NonNullable<ViewGiftQuery["giftDescription"]>["episodes"][number]
    | NonNullable<ViewLocationQuery["spaceDescription"]>["episodes"][number];

@Component({
  selector: 'lc-episode-links',
  templateUrl: './episode-links.component.html',
  styleUrls: ['./episode-links.component.scss']
})
export class EpisodeLinksComponent {
    @Input({required: true})
    episodes!: QueriedEpisodeLink[];

    dataIcons = dataIcons;

    SourceMention = SourceMention;
    sourceMentionLabels = sourceMentionLabels;
}
