import { Component, Input } from '@angular/core';
import { dataIcons } from '@shared/icons';
import { agentIcon, locationIcon } from '@shared/icons-utils';
import { ViewEpisodesQuery, ViewSourceQuery } from 'generated/graphql';

type EpisodeWithEntities = NonNullable<ViewSourceQuery['source']>['episodes'][number];
type EpisodeWithSource = ViewEpisodesQuery['episodes'][number];

type Episode = EpisodeWithEntities | EpisodeWithSource;

@Component({
  selector: 'lc-episode-preview',
  templateUrl: './episode-preview.component.html',
  styleUrls: ['./episode-preview.component.scss']
})
export class EpisodePreviewComponent {
    @Input({required: true}) episode!: Episode;

    dataIcons = dataIcons;
    agentIcon = agentIcon;
    locationIcon = locationIcon;

    hasSource(episode: Episode): episode is EpisodeWithSource {
        return 'source' in episode;
    }

    hasEntities(episode: Episode): episode is EpisodeWithEntities {
        return 'agents' in episode;
    }

    hasSourceLocation(episode: Episode): boolean {
        return !!(episode.book || episode.chapter || episode.page);
    }
}
