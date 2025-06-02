import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { SearchService } from "@services/search.service";
import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component";
import { ViewSourcesGQL, ViewSourcesQuery } from "generated/graphql";
import { map, distinctUntilChanged, startWith, filter } from "rxjs";

@Component({
    selector: "lc-source-list",
    templateUrl: "./source-list.component.html",
    styleUrls: ["./source-list.component.scss"],
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

    private search$ = this.searchService.createSearch<ViewSourcesQuery>(
        this.searchControl.valueChanges,
        this.query
    );

    public data$ = this.search$.pipe(
        filter((state) => !state.loading),
        map((state) => state.data)
    );

    public loading$ = this.search$.pipe(
        map((state) => state.loading),
        distinctUntilChanged(),
        startWith(false)
    );

    constructor(
        private query: ViewSourcesGQL,
        private searchService: SearchService
    ) {}
}
