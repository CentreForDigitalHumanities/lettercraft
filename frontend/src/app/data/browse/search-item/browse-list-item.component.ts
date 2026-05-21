import { Component, input } from '@angular/core';
import { dataIcons } from '@shared/icons';
import { EpisodeType } from 'generated/graphql';


interface ListItemEntity {
    id: string;
    name: string;
    icon: string;
    link: string;
}

interface BaseListItem {
    id: string;
    name: string;
    description: string;
    icon: string;
    link: string;
}

interface ListItemSource {
    id: string;
    name: string;
}

interface EpisodeListItem extends BaseListItem {
    type: 'episode';
    labels: string[];
    agents: ListItemEntity[];
    letters: ListItemEntity[];
    gifts: ListItemEntity[];
    spaces: ListItemEntity[];
    source: ListItemSource,
    sourceLocation: {
        book: string;
        chapter: string;
        page: string;
    };
}

interface SourceListItem extends BaseListItem {
    type: 'source';
    numOfEpisodes: number;
}

export interface EntityListItem extends BaseListItem {
    type: 'entity';
    numOfEpisodes: number;
    source: ListItemSource,
}

export type BrowseListItem = EpisodeListItem | EntityListItem | SourceListItem;

@Component({
    selector: 'lc-browse-list-item',
    templateUrl: './browse-list-item.component.html',
    styleUrl: './browse-list-item.component.scss',
    standalone: false,
})
export class BrowseListItemComponent {
    public readonly listItem = input.required<BrowseListItem>();

    public dataIcons = dataIcons;

    public hasSourceLocation(episode: Pick<EpisodeType, 'book' | 'chapter' | 'page'>): boolean {
        return !!(episode.book || episode.chapter || episode.page);
    }
}
