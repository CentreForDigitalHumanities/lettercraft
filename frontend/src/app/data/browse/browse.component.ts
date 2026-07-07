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


@Component({
    selector: 'lc-browse',
    templateUrl: './browse.component.html',
    styleUrl: './browse.component.scss',
    standalone: false,
})
export class BrowseComponent {
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
