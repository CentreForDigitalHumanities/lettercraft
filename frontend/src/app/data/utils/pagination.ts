import { map, filter, switchMap, BehaviorSubject, combineLatest, Observable } from "rxjs";
import { ApolloQueryResult } from "@apollo/client/core";
import { DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Paginated } from "../shared/paginator/paginator.component";

export interface HasID { id: string }

export interface PageQueryGQL<Data> {
    watch: (variables: {ids: string[]}) =>
        { valueChanges: Observable<ApolloQueryResult<Data>> }
}

export class PageResult<Data, TransformedData = Data> implements Paginated {
    pageSize = 10;
    page$ = new BehaviorSubject<number>(1);

    totalSize$ = this.collection$.pipe(
        map(collection => collection?.length ?? 0),
    );

    private ids$ = this.collection$.pipe(
        map(data => data?.map(obj => obj.id)),
    );

    public pageData$: Observable<TransformedData> = combineLatest([this.ids$, this.page$]).pipe(
        map(([ids, page]) => this.slicePage(ids, page)),
        filter(ids => !!ids.length),
        switchMap(ids => this.pageQuery.watch({ids}).valueChanges),
        filter(result => !result.loading && !!result.data),
        map(result => this.transform(result.data))
    );

    constructor(
        public collection$: Observable<HasID[]>,
        public pageQuery: PageQueryGQL<Data>,
        destroyRef: DestroyRef,
        private transformer?: (data: Data) => TransformedData
    ) {
        // reset the page when ids are updated
        collection$.pipe(
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

    private transform(data: Data): TransformedData {
        if (this.transformer) {
            return this.transformer(data);
        }
        // Safe cast: When no transformer is provided, TransformedData defaults to Data
        return data as unknown as TransformedData;
    }
}
