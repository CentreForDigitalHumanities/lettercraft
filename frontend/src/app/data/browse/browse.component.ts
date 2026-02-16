import { Component } from '@angular/core';
import { actionIcons, dataIcons, statusIcons } from '@shared/icons';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowseSearchGQL, BrowseSearchQuery, EpisodeType, SearchFocus, SourceType } from 'generated/graphql';
import { map, startWith, shareReplay, filter, debounceTime } from 'rxjs';
import { SearchService } from '@services/search.service';
import { BrowseListItem, EntityListItem } from './search-item/browse-list-item.component';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { agentIcon, locationIcon } from '@shared/icons-utils';


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
    { type: SearchFocus.Items, title: 'Letters/Gifts', icon: dataIcons.letter },
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
        { link: ".", label: "Data" },
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

    constructor(
        private searchQuery: BrowseSearchGQL,
        private searchService: SearchService
    ) { }

    private debouncedSearch$ = this.form.valueChanges.pipe(
        map(() => this.form.getRawValue()),
        debounceTime(300)
    );

    public searchResult$ = this.searchService.createSearch(
        this.debouncedSearch$.pipe(
            startWith({
                searchTerm: "",
                labelIds: [],
                searchFocus: SearchFocus.Sources,
            })
        ),
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
                [SearchFocus.Items, data.letterCount + data.giftCount],
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
                [SearchFocus.Items, this.transformItems(data)],
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
                    link: `items/${letter.id}`
                })),
                gifts: episode.gifts.map(({ gift }) => ({
                    id: gift.id,
                    name: gift.name,
                    icon: dataIcons.gift,
                    link: `items/${gift.id}`
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

    private transformItems(results: QueriedResults): BrowseListItem[] {
        const letterItems: BrowseListItem[] = results.letters.map(letter => ({
            id: letter.id,
            name: letter.name,
            type: 'entity',
            description: letter.description,
            icon: dataIcons.letter,
            link: `items/${letter.id}`,
            occurrence: this.occurrenceData(letter),
        }));

        const giftItems: BrowseListItem[] = results.gifts.map(gift => ({
            id: gift.id,
            name: gift.name,
            type: 'entity',
            description: gift.description,
            icon: dataIcons.gift,
            link: `items/${gift.id}`,
            occurrence: this.occurrenceData(gift)
        }));

        return letterItems.concat(giftItems);
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
