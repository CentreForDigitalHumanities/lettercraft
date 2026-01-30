import { Component } from '@angular/core';
import { actionIcons, dataIcons, statusIcons } from '@shared/icons';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowseSearchGQL, BrowseSearchQuery, BrowseSearchQueryVariables, SearchFocus } from 'generated/graphql';
import { map, startWith, Subject, shareReplay, filter } from 'rxjs';
import { SearchService } from '@services/search.service';
import { BrowseListItem } from './search-item/browse-list-item.component';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';


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

    public startSearch$ = new Subject<BrowseSearchQueryVariables>();

    public searchResult$ = this.searchService.createSearch(
        this.startSearch$.pipe(
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

    // Keep counts stable with shareReplay
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

    // Items by type
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
        this.submitSearch();
    }

    public submitSearch(event?: Event): void {
        event?.preventDefault();
        const formValue = this.form.getRawValue();
        this.startSearch$.next(formValue);
    }

    private transformSources(results: QueriedResults): BrowseListItem[] {
        return results.sources.map(source => ({
            id: source.id,
            name: source.name,
            description: source.descriptionText,
            subtext: source.reference,
            icon: dataIcons.source,
            link: `sources/${source.id}`
        }));
    }

    private transformEpisodes(results: QueriedResults): BrowseListItem[] {
        return results.episodes.map(episode => ({
            id: episode.id,
            name: episode.name,
            description: episode.summary,
            subtext: `${episode.source.reference}, book ${episode.book}, chapter ${episode.chapter}, page ${episode.page}`,
            icon: dataIcons.episode,
            link: `episodes/${episode.id}`,
            labels: episode.categories?.map(cat => cat.name) ?? []
        }));
    }

    private transformAgents(results: QueriedResults): BrowseListItem[] {
        return results.agents.map(agent => ({
            id: agent.id,
            name: agent.name,
            description: this.occurrenceData(agent),
            subtext: agent.isGroup ? 'Group' : 'Individual',
            icon: agent.isGroup ? dataIcons.group : dataIcons.person,
            link: `agents/${agent.id}`
        }));
    }

    private transformItems(results: QueriedResults): BrowseListItem[] {
        const letterItems: BrowseListItem[] = results.letters.map(letter => ({
            id: letter.id,
            name: letter.name,
            description: 'Occurs in ' + letter.episodes.length + ' episodes in ' + letter.source.reference,
            subtext: 'Letter',
            icon: dataIcons.letter,
            link: `items/${letter.id}`
        }));

        const giftItems: BrowseListItem[] = results.gifts.map(gift => ({
            id: gift.id,
            name: gift.name,
            description: 'Occurs in ' + gift.episodes.length + ' episodes in ' + gift.source.reference,
            subtext: 'Gift',
            icon: dataIcons.gift,
            link: `items/${gift.id}`
        }));

        return letterItems.concat(giftItems);
    }

    private transformLocations(results: QueriedResults): BrowseListItem[] {
        return results.locations.map(location => ({
            id: location.id,
            name: location.name,
            description: this.occurrenceData(location),
            subtext: location.description,
            icon: dataIcons.location,
            link: `locations/${location.id}`
        }));
    }

    private occurrenceData(result: { episodes: unknown[]; source: { reference: string; }; }): string {
        return `Occurs in ${result.episodes.length} episode${result.episodes.length !== 1 ? 's' : ''} in ${result.source.reference}`;
    }
}
