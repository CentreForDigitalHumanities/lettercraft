import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { SearchService } from "@services/search.service";
import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component";
import { ViewSourcesGQL, ViewSourcesPageGQL, ViewSourcesQuery } from "generated/graphql";
import { map, distinctUntilChanged, startWith, filter, switchMap, shareReplay, BehaviorSubject, combineLatest } from "rxjs";



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

    private ids$ = this.allSources$.pipe(
        filter((state) => !state.loading),
        map((state) => state.data),
        filter(data => !!data),
        map(data => data?.sources.map(src => src.id)),
        shareReplay(),
    );

    public allLoading$ = this.allSources$.pipe(
        map((state) => state.loading),
        distinctUntilChanged(),
        startWith(false)
    );

    totalSize$ = this.ids$.pipe(
        map(ids => ids?.length),
    );

    private page$ = new BehaviorSubject<number>(0);

    private pageResult$ = combineLatest([this.ids$, this.page$]).pipe(
        map(([ids, page]) => ids ? this.slicePage(ids, page) : []),
        switchMap(ids => this.pageQuery.watch({ ids }).result()),
    )

    public data$ = this.pageResult$.pipe(
        filter((state) => !state.loading),
        map((state) => state.data)
    );


    constructor(
        private query: ViewSourcesGQL,
        private searchService: SearchService,
        private pageQuery: ViewSourcesPageGQL,
    ) {}

    get page(): number { return this.page$.value }
    set page(value: number) { this.page$.next(value) }

    slicePage<T>(values: T[], page: number): T[] {
        const start = this.pageSize * (page - 1);
        const end = this.pageSize * page;
        return values .slice(start, end);
    }
}
