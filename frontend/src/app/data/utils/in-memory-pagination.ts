import { combineLatest, map, Observable, shareReplay } from "rxjs";
import { DestroyRef } from "@angular/core";
import { BasePaginationResult } from "./base-pagination-result";


export class InMemoryPageResult<T> extends BasePaginationResult<T[]> {
    override pageData$: Observable<T[]> = combineLatest([this.collection$, this.page$]).pipe(
        map(([collection, page]) => this.slicePage(collection ?? [], page)),
        shareReplay(1)
    );

    constructor(
        public collection$: Observable<T[]>,
        destroyRef: DestroyRef,
    ) {
        super(collection$, destroyRef);
    }
}
