import { Component, input } from '@angular/core';
import { dataIcons } from '@shared/icons';
import { EpisodeType } from 'generated/graphql';
import _ from 'underscore';
import { BrowseListItem } from './browse-list-item';

@Component({
    selector: 'lc-browse-list-item',
    templateUrl: './browse-list-item.component.html',
    styleUrl: './browse-list-item.component.scss',
    standalone: false,
})
export class BrowseListItemComponent {
    public readonly listItem = input.required<BrowseListItem>();

    public dataIcons = dataIcons;

    hasBody(item: BrowseListItem): boolean {
        if (item.type !== 'episode') {
            return true;
        }
        const values = [
            item.description, item.categories, item.agents, item.letters,
            item.gifts, item.spaces
        ];
        return _.any(values, i => i.length > 0);
    }

    public hasSourceLocation(episode: Pick<EpisodeType, 'book' | 'chapter' | 'page'>): boolean {
        return !!(episode.book || episode.chapter || episode.page);
    }
}
