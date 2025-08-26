import { map, filter, switchMap, BehaviorSubject, combineLatest, Observable } from "rxjs";
import { ApolloQueryResult } from "@apollo/client/core";

interface HasID { id: string }

export class PageResult<PageQuery> {

    pageSize = 10;
    page$ = new BehaviorSubject<number>(1);

    totalSize$ = this.collection$.pipe(
        map(collection => collection?.length),
    );

    private ids$ = this.collection$.pipe(
        map(data => data?.map(obj => obj.id)),
    );

    public pageData$: Observable<PageQuery> = combineLatest([this.ids$, this.page$]).pipe(
        map(([ids, page]) => this.slicePage(ids, page)),
        filter(ids => !!ids.length),
        switchMap(ids => this.getPage(ids)),
        filter(result => !result.loading && !!result.data),
        map(result => result.data),
    );

    constructor(
        public collection$: Observable<HasID[]>,
        public getPage: (ids: string[]) => Observable<ApolloQueryResult<PageQuery>>,
    ) {}

    get page(): number { return this.page$.value }
    set page(value: number) { this.page$.next(value) }

    slicePage<T>(values: T[], page: number): T[] {
        const start = this.pageSize * (page - 1);
        const end = this.pageSize * page;
        return values.slice(start, end);
    }
}
