import { Component, input } from '@angular/core';
import { dataIcons } from '@shared/icons';
import { SearchFocus } from 'generated/graphql';
import { BehaviorSubject } from 'rxjs';

export interface TabMetadata {
    type: SearchFocus;
    title: string;
    icon: string;
}

const TAB_METADATA: TabMetadata[] = [
    { type: SearchFocus.Sources, title: 'Sources', icon: dataIcons.source },
    { type: SearchFocus.Episodes, title: 'Episodes', icon: dataIcons.episode },
    { type: SearchFocus.Agents, title: 'Agents', icon: dataIcons.person },
    { type: SearchFocus.Letters, title: 'Letters', icon: dataIcons.letter },
    { type: SearchFocus.Gifts, title: 'Gifts', icon: dataIcons.gift },
    { type: SearchFocus.Locations, title: 'Locations', icon: dataIcons.location }
];


export interface TabData {
    sources?: { id: string }[];
    episodes?: { id: string }[];
    agents?: { id: string }[];
    letters?: { id: string }[];
    gifts?: { id: string }[];
    locations?: { id: string }[];
}

@Component({
    selector: 'lc-browse-tabs',
    standalone: false,
    templateUrl: './browse-tabs.component.html',
    styleUrl: './browse-tabs.component.scss'
})
export class BrowseTabsComponent {
    tabs = input.required<SearchFocus[]>();
    data = input.required<TabData | null>();
    focus$ = new BehaviorSubject<SearchFocus>(SearchFocus.Sources);
}
