import { Component, computed, input } from '@angular/core';
import { dataIcons } from '@shared/icons';
import { BehaviorSubject } from 'rxjs';


export enum SearchFocus {
    Sources = "SOURCES",
    Episodes = "EPISODES",
    Agents = "AGENTS",
    Letters = "LETTERS",
    Gifts = "GIFTS",
    Locations = "LOCATIONS",
}


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

    tabMetadata = TAB_METADATA;

    counts = computed(() => {
        const data = this.data();
        return new Map<SearchFocus, number | undefined>([
            [SearchFocus.Sources, data?.sources?.length],
            [SearchFocus.Episodes, data?.episodes?.length],
            [SearchFocus.Agents, data?.agents?.length],
            [SearchFocus.Letters, data?.letters?.length],
            [SearchFocus.Gifts, data?.gifts?.length],
            [SearchFocus.Locations, data?.locations?.length],
        ]);
    });

    public changeTabs(newNavId: SearchFocus): void {
        this.focus$.next(newNavId);
    }
}
