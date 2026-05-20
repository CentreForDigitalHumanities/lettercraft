import { Component, Input } from '@angular/core';
import { dataIcons } from '@shared/icons';
import { agentIcon, locationIcon } from '@shared/icons-utils';
import { ViewSourceEpisodesPageQuery } from 'generated/graphql';

type Episode = NonNullable<ViewSourceEpisodesPageQuery>['episodes'][number];

@Component({
    selector: 'lc-episode-preview',
    templateUrl: './episode-preview.component.html',
    styleUrls: ['./episode-preview.component.scss'],
    standalone: false
})
export class EpisodePreviewComponent {
    @Input({required: true}) episode!: Episode;

    dataIcons = dataIcons;
    agentIcon = agentIcon;
    locationIcon = locationIcon;

    hasSourceLocation(episode: Episode): boolean {
        return !!(episode.book || episode.chapter || episode.page);
    }
}
