import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component";
import { ViewEpisodesGQL, ViewEpisodesQuery } from "generated/graphql";
import {
    debounceTime,
    distinctUntilChanged,
    map,
    merge,
    Observable,
    startWith,
    switchMap,
} from "rxjs";

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

    private searchInput$ = this.searchControl.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(300)
    );

    public data$: Observable<ViewEpisodesQuery> = this.searchInput$.pipe(
        startWith(""),
        switchMap((search) =>
            this.query
                .watch({ search })
                .valueChanges.pipe(map((result) => result.data))
        )
    );

    public loading$ = merge(
        this.searchInput$.pipe(map(() => true)),
        this.data$.pipe(map(() => false))
    );

    constructor(private query: ViewEpisodesGQL) {}
}
