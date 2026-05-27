import { Component, DestroyRef } from "@angular/core";
import { dataIcons, actionIcons, statusIcons } from "@shared/icons";
import { FormGroup, FormControl } from "@angular/forms";
import {
    SearchFocus, BrowseSearchGQL,
    BrowseSourcesPageGQL, BrowseEpisodesPageGQL, BrowseAgentsPageGQL,
    BrowseLettersPageGQL, BrowseGiftsPageGQL, BrowseLocationsPageGQL,
    BrowseSourcesPageQuery, BrowseEpisodesPageQuery, BrowseAgentsPageQuery,
    BrowseLettersPageQuery, BrowseGiftsPageQuery, BrowseLocationsPageQuery,
    BrowseSearchQuery
} from "generated/graphql";
import { Subject, startWith, mergeWith, throttleTime, asyncScheduler, map, distinctUntilChanged, shareReplay, filter } from "rxjs";
import { SearchService, SearchState } from "@services/search.service";
import {
    BrowseListItem, transformAgent, transformEpisode, transformGift, transformLetter,
    transformLocation, transformSource
} from "./search-item/browse-list-item";
import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component";
import { HasID, PageQueryGQL, PageResult } from "../utils/pagination";
import _ from "underscore";


type QueriedResults = NonNullable<NonNullable<SearchState<BrowseSearchQuery>['data']>['search']>;

interface TabMetadata {
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

type BrowsePageResult =
    | PageResult<BrowseSourcesPageQuery, BrowseListItem[]>
    | PageResult<BrowseEpisodesPageQuery, BrowseListItem[]>
    | PageResult<BrowseAgentsPageQuery, BrowseListItem[]>
    | PageResult<BrowseLettersPageQuery, BrowseListItem[]>
    | PageResult<BrowseGiftsPageQuery, BrowseListItem[]>
    | PageResult<BrowseLocationsPageQuery, BrowseListItem[]>;

@Component({
    selector: 'lc-browse',
    templateUrl: './browse.component.html',
    styleUrl: './browse.component.scss',
    standalone: false,
})
export class BrowseComponent {
    public readonly tabMetadata = TAB_METADATA;
    public readonly dataIcons = dataIcons;
    public readonly actionIcons = actionIcons;
    public readonly statusIcons = statusIcons;

    public breadcrumbs: Breadcrumb[] = [
        { link: "/", label: "Lettercraft" },
        { link: ".", label: "Browse" },
    ];

    public form = new FormGroup({
        searchTerm: new FormControl('', {
            nonNullable: true
        }),
        labelIds: new FormControl<string[]>([], {
            nonNullable: true
        }),
        searchFocus: new FormControl<SearchFocus>(SearchFocus.Sources, {
            nonNullable: true
        })
    });

    public formSubmit$ = new Subject<void>();

    public searchValue$ = this.form.valueChanges.pipe(
        startWith(null),
        mergeWith(this.formSubmit$),
        throttleTime(500, asyncScheduler, {leading: true, trailing: true}),
        map(() => this.form.getRawValue()),
        distinctUntilChanged(_.isEqual),
        shareReplay(1),
    );

    searchTabs = [
        SearchFocus.Sources,
        SearchFocus.Episodes,
        SearchFocus.Agents,
        SearchFocus.Letters,
        SearchFocus.Gifts,
        SearchFocus.Locations,
    ];

    constructor(
        private searchQuery: BrowseSearchGQL,
        private searchService: SearchService,
        private destroyRef: DestroyRef,
        private sourcesPageQuery: BrowseSourcesPageGQL,
        private episodesPageQuery: BrowseEpisodesPageGQL,
        private agentsPageQuery: BrowseAgentsPageGQL,
        private lettersPageQuery: BrowseLettersPageGQL,
        private giftsPageQuery: BrowseGiftsPageGQL,
        private locationsPageQuery: BrowseLocationsPageGQL,
    ) { }

    public searchResult$ = this.searchService.createSearch(
        this.searchValue$,
        this.searchQuery
    );

    public searchError$ = this.searchResult$.pipe(
        map(result => result.error)
    );

    public searchLoading$ = this.searchResult$.pipe(
        map(result => result.loading)
    );

    searchData$ = this.searchResult$.pipe(
        filter(results => !!results.data?.search),
        map(results => results.data!.search!),
    );

    public counts$ = this.searchData$.pipe(
        map(data => {
            return new Map<SearchFocus, number>([
                [SearchFocus.Sources, data.sourceCount],
                [SearchFocus.Episodes, data.episodeCount],
                [SearchFocus.Agents, data.agentCount],
                [SearchFocus.Letters, data.letterCount],
                [SearchFocus.Gifts, data.giftCount],
                [SearchFocus.Locations, data.locationCount]
            ]);
        }),
        shareReplay(1)
    );

    public changeTabs(newNavId: SearchFocus): void {
        this.form.controls.searchFocus.setValue(newNavId);
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
        unpack: (data: QueriedResults) => HasID[],
        pageQuery: PageQueryGQL<QueryData>,
        transform: (data: QueryData) => BrowseListItem[]
    ): PageResult<QueryData, BrowseListItem[]> {
        const objects$ = this.searchData$.pipe(
            map(data => unpack(data)),
        );
        return new PageResult(objects$, pageQuery, this.destroyRef, transform);
    }

    private transformSources(data: BrowseSourcesPageQuery): BrowseListItem[] {
        return data.sources.map(transformSource);
    }

    private transformEpisodes(data: BrowseEpisodesPageQuery): BrowseListItem[] {
        return data.episodes.map(transformEpisode);
    }

    private transformAgents(data: BrowseAgentsPageQuery): BrowseListItem[] {
        return data.agentDescriptions.map(transformAgent);
    }

    private transformLetters(data: BrowseLettersPageQuery): BrowseListItem[] {
        return data.letterDescriptions.map(transformLetter);
    }

    private transformGifts(data: BrowseGiftsPageQuery): BrowseListItem[] {
        return data.giftDescriptions.map(transformGift);
    }

    private transformLocations(data: BrowseLocationsPageQuery): BrowseListItem[] {
        return data.spaceDescriptions.map(transformLocation);
    }
}
