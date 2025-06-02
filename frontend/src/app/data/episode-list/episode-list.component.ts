import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { SearchService } from "@services/search.service";
import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component";
import { ViewEpisodesGQL, ViewEpisodesQuery } from "generated/graphql";
import { distinctUntilChanged, filter, map, startWith } from "rxjs";

@Component({
    selector: "lc-episode-list",
    templateUrl: "./episode-list.component.html",
    styleUrls: ["./episode-list.component.scss"],
})
export class EpisodeListComponent {
    breadcrumbs: Breadcrumb[] = [
        { link: "/", label: "Lettercraft" },
        { link: "/data", label: "Data" },
        { link: ".", label: "Episodes" },
    ];

    public searchControl = new FormControl<string>("", {
        nonNullable: true,
    });

    private search$ = this.searchService.createSearch<ViewEpisodesQuery>(
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
        private query: ViewEpisodesGQL,
        private searchService: SearchService
    ) {}
}
