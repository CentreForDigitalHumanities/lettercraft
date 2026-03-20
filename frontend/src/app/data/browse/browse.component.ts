import { Component, DestroyRef } from "@angular/core";
import { dataIcons, actionIcons, statusIcons } from "@shared/icons";
import { FormGroup, FormControl } from "@angular/forms";
import { BrowseSearchQuery, SearchFocus, BrowseSearchGQL, EpisodeType, SourceType } from "generated/graphql";
import { Subject, startWith, mergeWith, throttleTime, asyncScheduler, map, distinctUntilChanged, shareReplay, filter } from "rxjs";
import { SearchService } from "@services/search.service";
import { BrowseListItem, EntityListItem } from "./search-item/browse-list-item.component";
import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component";
import { agentIcon, locationIcon } from "@shared/icons-utils";
import { InMemoryPageResult } from "../utils/in-memory-pagination";
import _ from "underscore";


type QueriedResults = NonNullable<BrowseSearchQuery['search']>;

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

    constructor(
        private searchQuery: BrowseSearchGQL,
        private searchService: SearchService,
        private destroyRef: DestroyRef
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

    public counts$ = this.searchResult$.pipe(
        filter(results => !!results.data?.search),
        map(results => {
            const data = results.data!.search!;
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

    public pageResultsByType = new Map<SearchFocus, InMemoryPageResult<BrowseListItem>>([
        [SearchFocus.Sources, this.toPageResult(result => transformSources(result))],
        [SearchFocus.Episodes, this.toPageResult(result => transformEpisodes(result))],
        [SearchFocus.Agents, this.toPageResult(result => transformAgents(result))],
        [SearchFocus.Letters, this.toPageResult(result => transformLetters(result))],
        [SearchFocus.Gifts, this.toPageResult(result => transformGifts(result))],
        [SearchFocus.Locations, this.toPageResult(result => transformLocations(result))]
    ]);

    public changeTabs(newNavId: SearchFocus): void {
        this.form.controls.searchFocus.setValue(newNavId);
    }

    private toPageResult(transform: (results: QueriedResults) => BrowseListItem[]): InMemoryPageResult<BrowseListItem> {
        const collection$ = this.searchResult$.pipe(
            filter(results => !!results.data?.search),
            map(results => transform(results.data!.search!)),
            shareReplay(1)
        );
        return new InMemoryPageResult(collection$, this.destroyRef);
    }
}

function transformSources(results: QueriedResults): BrowseListItem[] {
    return results.sources.map(source => ({
        id: source.id,
        name: source.name,
        type: 'source',
        description: source.descriptionText,
        numOfEpisodes: source.episodes.length,
        icon: dataIcons.source,
        link: `sources/${source.id}`,
    }));
}

function transformEpisodes(results: QueriedResults): BrowseListItem[] {
    return results.episodes.map(episode => ({
        id: episode.id,
        name: episode.name,
        type: 'episode',
        description: episode.summary,
        icon: dataIcons.episode,
        link: `episodes/${episode.id}`,
        labels: episode.categories?.map(cat => cat.name) ?? [],
        agents: episode.agents.map(({ agent }) => ({
            id: agent.id,
            name: agent.name,
            icon: agentIcon(agent),
            link: `agents/${agent.id}`
        })),
        letters: episode.letters.map(({ letter }) => ({
            id: letter.id,
            name: letter.name,
            icon: dataIcons.letter,
            link: `letters/${letter.id}`
        })),
        gifts: episode.gifts.map(({ gift }) => ({
            id: gift.id,
            name: gift.name,
            icon: dataIcons.gift,
            link: `gifts/${gift.id}`
        })),
        spaces: episode.spaces.map(({ space }) => ({
            id: space.id,
            name: space.name,
            icon: locationIcon(space),
            link: `locations/${space.id}`
        })),
        sourceLocation: {
            book: episode.book,
            chapter: episode.chapter,
            page: episode.page
        },
    }));
}

function transformAgents(results: QueriedResults): BrowseListItem[] {
    return results.agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        type: 'entity',
        description: agent.description,
        icon: agentIcon(agent),
        link: `agents/${agent.id}`,
        occurrence: occurrenceData(agent),
    }));
}

function transformLetters(results: QueriedResults): BrowseListItem[] {
    return results.letters.map(letter => ({
        id: letter.id,
        name: letter.name,
        type: 'entity',
        description: letter.description,
        icon: dataIcons.letter,
        link: `letters/${letter.id}`,
        occurrence: occurrenceData(letter),
    }));

}

function transformGifts(results: QueriedResults): BrowseListItem[] {
    return results.gifts.map(gift => ({
        id: gift.id,
        name: gift.name,
        type: 'entity',
        description: gift.description,
        icon: dataIcons.gift,
        link: `gifts/${gift.id}`,
        occurrence: occurrenceData(gift)
    }));
}

function transformLocations(results: QueriedResults): BrowseListItem[] {
    return results.locations.map(location => ({
        id: location.id,
        name: location.name,
        type: 'entity',
        description: location.description,
        icon: locationIcon(location),
        link: `locations/${location.id}`,
        occurrence: occurrenceData(location)
    }));
}

function occurrenceData(result: { episodes: Pick<EpisodeType, 'id'>[]; source: Pick<SourceType, 'reference' | 'id'>; }): EntityListItem['occurrence'] {
    return {
        numOfEpisodes: result.episodes.length,
        sourceName: result.source.reference,
        sourceLink: `sources/${result.source.id}`
    };
}
