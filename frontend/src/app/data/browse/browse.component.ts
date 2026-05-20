import { Component } from "@angular/core";
import { dataIcons, actionIcons, statusIcons } from "@shared/icons";
import { FormGroup, FormControl } from "@angular/forms";
import { BrowseSearchQuery, SearchFocus, BrowseSearchGQL, EpisodeType, SourceType } from "generated/graphql";
import { Subject, startWith, mergeWith, throttleTime, asyncScheduler, map, distinctUntilChanged, shareReplay, filter } from "rxjs";
import { SearchService } from "@services/search.service";
import { BrowseListItem, EntityListItem } from "./search-item/browse-list-item.component";
import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component";
import { agentIcon, locationIcon } from "@shared/icons-utils";
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
        private searchService: SearchService
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

    public itemsByType$ = this.searchResult$.pipe(
        filter(results => !!results.data?.search),
        map(results => {
            const data = results.data!.search!;
            return new Map<SearchFocus, BrowseListItem[]>([
                [SearchFocus.Sources, this.transformSources(data)],
                [SearchFocus.Episodes, this.transformEpisodes(data)],
                [SearchFocus.Agents, this.transformAgents(data)],
                [SearchFocus.Letters, this.transformLetters(data)],
                [SearchFocus.Gifts, this.transformGifts(data)],
                [SearchFocus.Locations, this.transformLocations(data)]
            ]);
        }),
        shareReplay(1)
    );

    public changeTabs(newNavId: SearchFocus): void {
        this.form.controls.searchFocus.setValue(newNavId);
    }

    private transformSources(results: QueriedResults): BrowseListItem[] {
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

    private transformEpisodes(results: QueriedResults): BrowseListItem[] {
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

    private transformAgents(results: QueriedResults): BrowseListItem[] {
        return results.agents.map(agent => ({
            id: agent.id,
            name: agent.name,
            type: 'entity',
            description: agent.description,
            icon: agentIcon(agent),
            link: `agents/${agent.id}`,
            occurrence: this.occurrenceData(agent),
        }));
    }

    private transformLetters(results: QueriedResults): BrowseListItem[] {
        return results.letters.map(letter => ({
            id: letter.id,
            name: letter.name,
            type: 'entity',
            description: letter.description,
            icon: dataIcons.letter,
            link: `letters/${letter.id}`,
            occurrence: this.occurrenceData(letter),
        }));

    }

    private transformGifts(results: QueriedResults): BrowseListItem[] {
        return results.gifts.map(gift => ({
            id: gift.id,
            name: gift.name,
            type: 'entity',
            description: gift.description,
            icon: dataIcons.gift,
            link: `gifts/${gift.id}`,
            occurrence: this.occurrenceData(gift)
        }));
    }

    private transformLocations(results: QueriedResults): BrowseListItem[] {
        return results.locations.map(location => ({
            id: location.id,
            name: location.name,
            type: 'entity',
            description: location.description,
            icon: locationIcon(location),
            link: `locations/${location.id}`,
            occurrence: this.occurrenceData(location)
        }));
    }

    private occurrenceData(result: { episodes: Pick<EpisodeType, 'id'>[]; source: Pick<SourceType, 'reference' | 'id'>; }): EntityListItem['occurrence'] {
        return {
            numOfEpisodes: result.episodes.length,
            sourceName: result.source.reference,
            sourceLink: `sources/${result.source.id}`
        };
    }
}
