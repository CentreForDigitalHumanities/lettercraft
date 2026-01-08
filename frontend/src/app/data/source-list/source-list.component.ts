import { Component, DestroyRef } from "@angular/core";
import { FormControl } from "@angular/forms";
import { SearchService } from "@services/search.service";
import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component";
import { ViewSourcesGQL, ViewSourcesPageGQL, ViewSourcesQuery } from "generated/graphql";
import { map, distinctUntilChanged, startWith, filter, shareReplay } from "rxjs";
import { PageResult } from "../utils/pagination";


@Component({
    selector: "lc-source-list",
    templateUrl: "./source-list.component.html",
    styleUrls: ["./source-list.component.scss"],
    standalone: false
})
export class SourceListComponent {
    breadcrumbs: Breadcrumb[] = [
        { link: "/", label: "Lettercraft" },
        { link: "/data", label: "Data" },
        { link: ".", label: "Sources" },
    ];

    public searchControl = new FormControl<string>("", {
        nonNullable: true,
    });

    private searchResult$ = this.searchService.createSearch<ViewSourcesQuery>(
        this.searchControl.valueChanges,
        this.query
    );

    collection$ = this.searchResult$.pipe(
        filter((state) => !state.loading),
        map((state) => state.data),
        filter(data => !!data),
        map(data => data?.sources || []),
        shareReplay(1),
    );

    public collectionLoading$ = this.searchResult$.pipe(
        map((state) => state.loading),
        distinctUntilChanged(),
        startWith(false)
    );

    public pageResult = new PageResult(this.collection$, this.pageQuery, this.destroyRef);

    constructor(
        private query: ViewSourcesGQL,
        private searchService: SearchService,
        private pageQuery: ViewSourcesPageGQL,
        private destroyRef: DestroyRef,
    ) {}
}
