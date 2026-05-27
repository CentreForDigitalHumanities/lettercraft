import { Component } from "@angular/core";
import { dataIcons, actionIcons, statusIcons } from "@shared/icons";
import { FormGroup, FormControl } from "@angular/forms";
import {
    BrowseSearchGQL,
} from "generated/graphql";
import { Subject, startWith, mergeWith, throttleTime, asyncScheduler, map, distinctUntilChanged, shareReplay, filter } from "rxjs";
import { SearchService } from "@services/search.service";
import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component";
import _ from "underscore";
import { TabMetadata, SearchFocus } from "../browse-tabs/browse-tabs.component";


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
}
