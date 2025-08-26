import { Component } from "@angular/core";
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
})
export class SourceListComponent {
    pageSize = 10;

    breadcrumbs: Breadcrumb[] = [
        { link: "/", label: "Lettercraft" },
        { link: "/data", label: "Data" },
        { link: ".", label: "Sources" },
    ];

    public searchControl = new FormControl<string>("", {
        nonNullable: true,
    });

    private allSources$ = this.searchService.createSearch<ViewSourcesQuery>(
        this.searchControl.valueChanges,
        this.query
    );

    ids$ = this.allSources$.pipe(
        filter((state) => !state.loading),
        map((state) => state.data),
        filter(data => !!data),
        map(data => data?.sources || []),
        shareReplay(),
    );

    public allLoading$ = this.allSources$.pipe(
        map((state) => state.loading),
        distinctUntilChanged(),
        startWith(false)
    );

    public pageResult = new PageResult(
        this.ids$,
        ids => this.pageQuery.watch({ ids }).valueChanges,
    );

    constructor(
        private query: ViewSourcesGQL,
        private searchService: SearchService,
        private pageQuery: ViewSourcesPageGQL,
    ) {}
}
