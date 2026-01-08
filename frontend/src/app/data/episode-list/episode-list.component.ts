import { Component, DestroyRef } from "@angular/core";
import { FormControl } from "@angular/forms";
import { SearchService } from "@services/search.service";
import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component";
import { ViewEpisodesGQL, ViewEpisodesPageGQL, ViewEpisodesQuery } from "generated/graphql";
import { distinctUntilChanged, filter, map, shareReplay, startWith, tap } from "rxjs";
import { PageResult } from "../utils/pagination";

@Component({
    selector: "lc-episode-list",
    templateUrl: "./episode-list.component.html",
    styleUrls: ["./episode-list.component.scss"],
    standalone: false
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

    private searchResult$ = this.searchService.createSearch<ViewEpisodesQuery>(
        this.searchControl.valueChanges,
        this.query
    );

    public collectionData$ = this.searchResult$.pipe(
        filter((state) => !state.loading),
        map((state) => state.data),
        shareReplay(1),
    );

    public loading$ = this.searchResult$.pipe(
        map((state) => state.loading),
        distinctUntilChanged(),
        startWith(false)
    );

    private collection$ = this.collectionData$.pipe(
        filter(data => !!data),
        map(data => data?.episodes || []),
    );

    public pageResult = new PageResult(this.collection$, this.pageQuery, this.destroyRef);

    constructor(
        private query: ViewEpisodesGQL,
        private pageQuery: ViewEpisodesPageGQL,
        private searchService: SearchService,
        private destroyRef: DestroyRef,
    ) {}
}
