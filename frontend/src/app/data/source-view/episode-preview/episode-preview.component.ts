import { Component, Input } from '@angular/core';
import { dataIcons } from '@shared/icons';
import { agentIcon, locationIcon } from '@shared/icons-utils';
import { ViewEpisodesQuery, ViewSourceQuery } from 'generated/graphql';

type Episode = ViewSourceQuery['source']['episodes'][number] | ViewEpisodesQuery['episodes'][number];

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

    hasSource(episode: Episode): episode is ViewEpisodesQuery['episodes'][number] {
        return 'source' in episode;
    }

    hasEntities(episode: Episode): episode is ViewSourceQuery['source']['episodes'][number] {
        return 'agents' in episode;
    }
}
