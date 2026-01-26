import { Component } from '@angular/core';
import { actionIcons, dataIcons } from '@shared/icons';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowseSearchGQL, BrowseSearchQuery, BrowseSearchQueryVariables, SelectedSearch } from 'generated/graphql';
import { map, startWith, Subject, shareReplay, filter } from 'rxjs';
import { SearchService } from '@services/search.service';

interface SearchItem {
    id: string;
    name: string;
    description: string;
    subtext: string;
    icon: string;
}

interface SearchResult {
    type: SelectedSearch;
    count: number;
    icon: string;
    title: string;
    items: SearchItem[];
}

type QueriedResults = NonNullable<BrowseSearchQuery['search']>;

interface TabMetadata {
    type: SelectedSearch;
    title: string;
    icon: string;
}

const TAB_METADATA: TabMetadata[] = [
    { type: SelectedSearch.Sources, title: 'Sources', icon: dataIcons.source },
    { type: SelectedSearch.Episodes, title: 'Episodes', icon: dataIcons.episode },
    { type: SelectedSearch.Agents, title: 'Agents', icon: dataIcons.person },
    { type: SelectedSearch.Items, title: 'Letters/Gifts', icon: dataIcons.letter },
    { type: SelectedSearch.Locations, title: 'Locations', icon: dataIcons.location }
];

@Component({
    selector: 'lc-omnibrowse',
    templateUrl: './omnibrowse.component.html',
    styleUrl: './omnibrowse.component.scss',
    standalone: false,
})
export class OmnibrowseComponent {
    public readonly tabMetadata = TAB_METADATA;
    public readonly dataIcons = dataIcons;
    public readonly actionIcons = actionIcons;

    public form = new FormGroup({
        searchTerm: new FormControl('', {
            nonNullable: true
        }),
        labelIds: new FormControl<string[]>([], {
            nonNullable: true
        }),
        selectedType: new FormControl<SelectedSearch>(SelectedSearch.Sources, {
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
                selectedType: SelectedSearch.Sources,
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
            return new Map<SelectedSearch, number>([
                [SelectedSearch.Sources, data.sourceCount],
                [SelectedSearch.Episodes, data.episodeCount],
                [SelectedSearch.Agents, data.agentCount],
                [SelectedSearch.Items, data.letterCount + data.giftCount],
                [SelectedSearch.Locations, data.locationCount]
            ]);
        }),
        shareReplay(1)
    );

    // Items by type
    public itemsByType$ = this.searchResult$.pipe(
        filter(results => !!results.data?.search),
        map(results => {
            const data = results.data!.search!;
            return new Map<SelectedSearch, SearchItem[]>([
                [SelectedSearch.Sources, this.transformSources(data)],
                [SelectedSearch.Episodes, this.transformEpisodes(data)],
                [SelectedSearch.Agents, this.transformAgents(data)],
                [SelectedSearch.Items, this.transformItems(data)],
                [SelectedSearch.Locations, this.transformLocations(data)]
            ]);
        }),
        shareReplay(1)
    );

    public changeTabs(newNavId: SelectedSearch): void {
        this.form.controls.selectedType.setValue(newNavId);
        this.submitSearch();
    }

    public submitSearch(event?: Event): void {
        event?.preventDefault();
        const formValue = this.form.getRawValue();
        this.startSearch$.next(formValue);
    }

    private transformSources(results: QueriedResults): SearchItem[] {
        return results.sources.map(source => ({
            id: source.id,
            name: source.name,
            description: source.descriptionText,
            subtext: source.reference,
            icon: dataIcons.source
        }));
    }

    private transformEpisodes(results: QueriedResults): SearchItem[] {
        return results.episodes.map(episode => ({
            id: episode.id,
            name: episode.name,
            description: episode.summary,
            subtext: `${episode.source.reference}, book ${episode.book}, chapter ${episode.chapter}, page ${episode.page}`,
            icon: dataIcons.episode
        }));
    }

    private transformAgents(results: QueriedResults): SearchItem[] {
        return results.agents.map(agent => ({
            id: agent.id,
            name: agent.name,
            description: this.occurrenceData(agent),
            subtext: agent.isGroup ? 'Group' : 'Individual',
            icon: agent.isGroup ? dataIcons.group : dataIcons.person
        }));
    }

    private transformItems(results: QueriedResults): SearchItem[] {
        const letterItems: SearchItem[] = results.letters.map(letter => ({
            id: letter.id,
            name: letter.name,
            description: 'Occurs in ' + letter.episodes.length + ' episodes in ' + letter.source.reference,
            subtext: 'Letter',
            icon: dataIcons.letter
        }));

        const giftItems: SearchItem[] = results.gifts.map(gift => ({
            id: gift.id,
            name: gift.name,
            description: 'Occurs in ' + gift.episodes.length + ' episodes in ' + gift.source.reference,
            subtext: 'Gift',
            icon: dataIcons.gift
        }));

        return letterItems.concat(giftItems);
    }

    private transformLocations(results: QueriedResults): SearchItem[] {
        return results.locations.map(location => ({
            id: location.id,
            name: location.name,
            description: this.occurrenceData(location),
            subtext: location.description,
            icon: dataIcons.location
        }));
    }

    private occurrenceData(result: { episodes: unknown[]; source: { reference: string; }; }): string {
        return `Occurs in ${result.episodes.length} episode${result.episodes.length !== 1 ? 's' : ''} in ${result.source.reference}`;
    }
}
