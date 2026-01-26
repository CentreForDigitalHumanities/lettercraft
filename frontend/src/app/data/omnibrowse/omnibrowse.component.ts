import { Component } from '@angular/core';
import { actionIcons, dataIcons } from '@shared/icons';
import { FormControl, FormGroup } from '@angular/forms';
import { BrowseSearchGQL, BrowseSearchQuery, BrowseSearchQueryVariables, SelectedSearch } from 'generated/graphql';
import { map, startWith, Subject } from 'rxjs';
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

@Component({
    selector: 'lc-omnibrowse',
    templateUrl: './omnibrowse.component.html',
    styleUrl: './omnibrowse.component.scss',
    standalone: false,
})
export class OmnibrowseComponent {
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

    public collection$ = this.searchResult$.pipe(
        map(results => {
            const data = results.data?.search;
            if (!data) {
                return null;
            }
            return this.transformResultsToDisplay(data);
        })
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

    private transformResultsToDisplay(results: QueriedResults): SearchResult[] {
        const displayResults: SearchResult[] = [];

        displayResults.push(this.transformSourceData(results));
        displayResults.push(this.transformEpisodeData(results));
        displayResults.push(this.transformAgentData(results));
        displayResults.push(this.transformItemData(results));
        displayResults.push(this.transformLocationData(results));

        return displayResults;
    }

    private transformSourceData(results: QueriedResults): SearchResult {
        return {
            type: SelectedSearch.Sources,
            count: results.sourceCount,
            title: 'Sources',
            icon: dataIcons.source,
            items: results.sources.map(source => ({
                id: source.id,
                name: source.name,
                description: source.descriptionText,
                subtext: source.reference,
                icon: dataIcons.source
            }))
        };
    }

    private transformEpisodeData(results: QueriedResults): SearchResult {
        return {
            type: SelectedSearch.Episodes,
            count: results.episodeCount,
            title: 'Episodes',
            icon: dataIcons.episode,
            items: results.episodes.map(episode => ({
                id: episode.id,
                name: episode.name,
                description: episode.summary,
                subtext: `${episode.source.reference}, book ${episode.book}, chapter ${episode.chapter}, page ${episode.page}`,
                icon: dataIcons.episode
            }))
        };
    }

    private transformAgentData(results: QueriedResults): SearchResult {
        return {
            type: SelectedSearch.Agents,
            count: results.agentCount,
            title: 'Agents',
            icon: dataIcons.person,
            items: results.agents.map(agent => ({
                id: agent.id,
                name: agent.name,
                description: this.occurrenceData(agent),
                subtext: agent.isGroup ? 'Group' : 'Individual',
                icon: agent.isGroup ? dataIcons.group : dataIcons.person
            }))
        };
    }

    private transformItemData(results: QueriedResults): SearchResult {
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

        return {
            type: SelectedSearch.Items,
            count: results.letterCount + results.giftCount,
            title: 'Letters/Gifts',
            icon: dataIcons.letter,
            items: letterItems.concat(giftItems)
        };
    }

    private transformLocationData(results: QueriedResults): SearchResult {
        return {
            type: SelectedSearch.Locations,
            count: results.locationCount,
            title: 'Locations',
            icon: dataIcons.location,
            items: results.locations.map(location => ({
                id: location.id,
                name: location.name,
                description: this.occurrenceData(location),
                subtext: location.description,
                icon: dataIcons.location
            }))
        };
    }

    private occurrenceData(result: { episodes: unknown[]; source: { reference: string; }; }): string {
        return `Occurs in ${result.episodes.length} episode${result.episodes.length !== 1 ? 's' : ''} in ${result.source.reference}`;
    }
}
