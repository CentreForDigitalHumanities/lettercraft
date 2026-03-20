import { BehaviorSubject, Observable, shareReplay, map } from "rxjs";
import { DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export interface PaginationResult<T> {
    pageSize: number;
    page$: BehaviorSubject<number>;
    totalSize$: Observable<number>;
    pageData$: Observable<T[] | T>;
    page: number;
}

export abstract class BasePaginationResult<T> implements PaginationResult<T> {
    pageSize = 10;
    page$ = new BehaviorSubject<number>(1);

    abstract pageData$: Observable<T>;

    totalSize$ = this.collectionToWatch$.pipe(
        map((collection) => collection?.length ?? 0),
        shareReplay(1)
    );

    constructor(
        private collectionToWatch$: Observable<unknown[]>,
        destroyRef: DestroyRef,
    ) {
        // Reset the page when collection changes.
        collectionToWatch$.pipe(
            takeUntilDestroyed(destroyRef),
        ).subscribe(() => this.page$.next(1));
    }

    get page(): number { return this.page$.value; }
    set page(value: number) { this.page$.next(value); }

    protected slicePage<U>(values: U[], page: number): U[] {
        const start = this.pageSize * (page - 1);
        const end = this.pageSize * page;
        return values.slice(start, end);
    }
}
