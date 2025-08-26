import { map, filter, switchMap, BehaviorSubject, combineLatest, Observable } from "rxjs";
import { ApolloQueryResult } from "@apollo/client/core";
import { DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

interface HasID { id: string }

interface PageQueryGQL<Data> {
    watch: (variables: {ids: string[]}) =>
        { valueChanges: Observable<ApolloQueryResult<Data>> }
}

export class PageResult<Data> {

    pageSize = 10;
    page$ = new BehaviorSubject<number>(1);

    totalSize$ = this.collection$.pipe(
        map(collection => collection?.length),
    );

    private ids$ = this.collection$.pipe(
        map(data => data?.map(obj => obj.id)),
    );

    public pageData$: Observable<Data> = combineLatest([this.ids$, this.page$]).pipe(
        map(([ids, page]) => this.slicePage(ids, page)),
        filter(ids => !!ids.length),
        switchMap(ids => this.pageQuery.watch({ids}).valueChanges),
        filter(result => !result.loading && !!result.data),
        map(result => result.data),
    );

    constructor(
        public collection$: Observable<HasID[]>,
        public pageQuery: PageQueryGQL<Data>,
        destroyRef: DestroyRef,
    ) {
        // reset the page when ids are updated
        this.collection$.pipe(
            takeUntilDestroyed(destroyRef),
        ).subscribe(() => this.page$.next(1));
    }

    get page(): number { return this.page$.value }
    set page(value: number) { this.page$.next(value) }

    slicePage<T>(values: T[], page: number): T[] {
        const start = this.pageSize * (page - 1);
        const end = this.pageSize * page;
        return values.slice(start, end);
    }
}
