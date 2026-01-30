import { Component, input } from '@angular/core';

export interface BrowseListItem {
    id: string;
    name: string;
    description: string;
    subtext: string;
    icon: string;
    link: string;
    labels?: string[];
}


@Component({
    selector: 'lc-browse-list-item',
    templateUrl: './browse-list-item.component.html',
    styleUrl: './browse-list-item.component.scss',
    standalone: false,
})
export class BrowseListItemComponent {
    public readonly listItem = input.required<BrowseListItem>();
}
