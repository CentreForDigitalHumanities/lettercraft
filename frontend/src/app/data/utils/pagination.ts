import { map, filter, switchMap, combineLatest, Observable } from "rxjs";
import { ApolloQueryResult } from "@apollo/client/core";
import { DestroyRef } from "@angular/core";
import { BasePaginationResult } from "./base-pagination-result";

export interface HasID { id: string }

interface PageQueryGQL<Data> {
    watch: (variables: {ids: string[]}) =>
        { valueChanges: Observable<ApolloQueryResult<Data>> }
}

export class PageResult<Data> extends BasePaginationResult<Data> {
    private ids$ = this.collection$.pipe(
        map(data => data?.map(obj => obj.id)),
    );

    override pageData$: Observable<Data> = combineLatest([this.ids$, this.page$]).pipe(
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
        super(collection$, destroyRef);
    }
}
