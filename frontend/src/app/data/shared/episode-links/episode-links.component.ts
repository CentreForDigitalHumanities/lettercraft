import { Component, Input } from '@angular/core';
import { dataIcons } from '@shared/icons';
import { agentIcon, locationIcon } from '@shared/icons-utils';
import { sourceMentionLabels } from '@shared/labels';
import { SourceMention, ViewAgentQuery, ViewEpisodeQuery, ViewGiftQuery, ViewLetterQuery, ViewLocationQuery } from 'generated/graphql';

type QueriedEpisodeLink =
    | NonNullable<ViewAgentQuery["agentDescription"]>["episodes"][number]
    | NonNullable<ViewLetterQuery["letterDescription"]>["episodes"][number]
    | NonNullable<ViewGiftQuery["giftDescription"]>["episodes"][number]
    | NonNullable<ViewLocationQuery["spaceDescription"]>["episodes"][number]
    | NonNullable<ViewEpisodeQuery['episode']>['agents'|'gifts'|'letters'|'spaces'][number];

type LinkedObject = { id: string, name: string, urlSegment: string, icon: string };

@Component({
  selector: 'lc-episode-links',
  templateUrl: './episode-links.component.html',
  styleUrls: ['./episode-links.component.scss']
})
export class EpisodeLinksComponent {
    @Input({required: true})
    data!: QueriedEpisodeLink[];

    dataIcons = dataIcons;

    SourceMention = SourceMention;
    sourceMentionLabels = sourceMentionLabels;

    linkedObject(link: QueriedEpisodeLink): LinkedObject | undefined {
        if ('episode' in link) {
            return {
                ...link.episode,
                urlSegment: '/data/episodes',
                icon: dataIcons.episode,
            };
        } else if ('agent' in link) {
            return {
                ...link.agent,
                urlSegment: 'agents',
                icon: agentIcon(link.agent),
            };
        } else if ('gift' in link) {
            return {
                ...link.gift,
                urlSegment: 'gifts',
                icon: dataIcons.gift,
            };
        } else if ('letter' in link) {
            return {
                ...link.letter,
                urlSegment: 'letters',
                icon: dataIcons.letter,
            };
        } else {
            return {
                ...link.space,
                urlSegment: 'locations',
                icon: locationIcon(link.space),
            };
        }
    }
}
