import { Component, computed, DestroyRef, input, SimpleChanges } from '@angular/core';
import { actionIcons, dataIcons } from '@shared/icons';
import { BehaviorSubject, combineLatest, filter, map, merge } from 'rxjs';
import { HasID, PageQueryGQL, PageResult } from '../utils/pagination';
import { BrowseAgentsPageGQL, BrowseAgentsPageQuery, BrowseEpisodesPageGQL, BrowseEpisodesPageQuery, BrowseGiftsPageGQL, BrowseGiftsPageQuery, BrowseLettersPageGQL, BrowseLettersPageQuery, BrowseLocationsPageGQL, BrowseLocationsPageQuery, BrowseSearchQuery, BrowseSourcesPageGQL, BrowseSourcesPageQuery } from 'generated/graphql';
import { BrowseListItem, transformEntity, transformEpisode, transformSource } from '../browse/search-item/browse-list-item';
import { agentIcon, locationIcon } from '@shared/icons-utils';
import _ from 'underscore';
import { toObservable } from '@angular/core/rxjs-interop';


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

type BrowsePageResult =
    | PageResult<BrowseSourcesPageQuery, BrowseListItem[]>
    | PageResult<BrowseEpisodesPageQuery, BrowseListItem[]>
    | PageResult<BrowseAgentsPageQuery, BrowseListItem[]>
    | PageResult<BrowseLettersPageQuery, BrowseListItem[]>
    | PageResult<BrowseGiftsPageQuery, BrowseListItem[]>
    | PageResult<BrowseLocationsPageQuery, BrowseListItem[]>;


@Component({
    selector: 'lc-browse-tabs',
    standalone: false,
    templateUrl: './browse-tabs.component.html',
    styleUrl: './browse-tabs.component.scss'
})
export class BrowseTabsComponent {
    tabs = input.required<SearchFocus[]>();
    data = input.required<TabData | null>();
    hideSource = input<boolean>(false);

    focus$ = new BehaviorSubject<SearchFocus>(SearchFocus.Sources);

    tabMetadata = TAB_METADATA;

    actionIcons = actionIcons;

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
    loading = computed(() => !this.data());

    filterItem = computed<(i: BrowseListItem) => BrowseListItem>(() =>
        this.hideSource() ?
        ((item: BrowseListItem) => _.omit(item, 'source') as any)
        : _.identity
    );

    constructor(
        private destroyRef: DestroyRef,
        private sourcesPageQuery: BrowseSourcesPageGQL,
        private episodesPageQuery: BrowseEpisodesPageGQL,
        private agentsPageQuery: BrowseAgentsPageGQL,
        private lettersPageQuery: BrowseLettersPageGQL,
        private giftsPageQuery: BrowseGiftsPageGQL,
        private locationsPageQuery: BrowseLocationsPageGQL,
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['tabs']) {
            this.focus$.next(_.first(this.tabs()) ?? SearchFocus.Sources);
        }
    }

    public changeTabs(newNavId: SearchFocus): void {
        this.focus$.next(newNavId);
    }

    public pageResultsByType = new Map<SearchFocus, BrowsePageResult>([
        [SearchFocus.Sources, this.createPageResult(data => data.sources, this.sourcesPageQuery, this.transformSources.bind(this))],
        [SearchFocus.Episodes, this.createPageResult(data => data.episodes, this.episodesPageQuery, this.transformEpisodes.bind(this))],
        [SearchFocus.Agents, this.createPageResult(data => data.agents, this.agentsPageQuery, this.transformAgents.bind(this))],
        [SearchFocus.Letters, this.createPageResult(data => data.letters, this.lettersPageQuery, this.transformLetters.bind(this))],
        [SearchFocus.Gifts, this.createPageResult(data => data.gifts, this.giftsPageQuery, this.transformGifts.bind(this))],
        [SearchFocus.Locations, this.createPageResult(data => data.locations, this.locationsPageQuery, this.transformLocations.bind(this))]
    ]);


    private createPageResult<QueryData>(
        unpack: (data: TabData) => HasID[] | undefined,
        pageQuery: PageQueryGQL<QueryData>,
        transform: (data: QueryData) => BrowseListItem[]
    ): PageResult<QueryData, BrowseListItem[]> {
        const objects$ = toObservable(this.data).pipe(
            filter(data => !!data),
            map(data => unpack(data) ?? []),
        );
        return new PageResult(objects$, pageQuery, this.destroyRef, transform);
    }

    private transformSources(data: BrowseSourcesPageQuery): BrowseListItem[] {
        return data.sources.map(transformSource);
    }

    private transformEpisodes(data: BrowseEpisodesPageQuery): BrowseListItem[] {
        return data.episodes.map(transformEpisode);
    }

    private transformEntities<Items extends
        BrowseAgentsPageQuery['agentDescriptions'] |
        BrowseLettersPageQuery['letterDescriptions'] |
        BrowseGiftsPageQuery['giftDescriptions'] |
        BrowseLocationsPageQuery['spaceDescriptions']
    >(entities: Items, icon: (e: Items[number]) => string, path: string): BrowseListItem[] {
        return entities.map(entity => transformEntity(entity, icon, path));
    }

    private transformAgents(data: BrowseAgentsPageQuery): BrowseListItem[] {
        return this.transformEntities(data.agentDescriptions, agentIcon, 'agents');
    }

    private transformLetters(data: BrowseLettersPageQuery): BrowseListItem[] {
        return this.transformEntities(
            data.letterDescriptions, _.constant(dataIcons.letter), 'letters'
        );
    }

    private transformGifts(data: BrowseGiftsPageQuery): BrowseListItem[] {
        return this.transformEntities(
            data.giftDescriptions, _.constant(dataIcons.gift), 'gifts'
        );
    }

    private transformLocations(data: BrowseLocationsPageQuery): BrowseListItem[] {
        return this.transformEntities(data.spaceDescriptions, locationIcon, 'locations');
    }
}
