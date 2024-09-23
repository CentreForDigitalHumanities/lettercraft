import { last, map, Observable, startWith } from "rxjs";
import _ from "underscore";

/**
 * Operator to check whether a request is still loading. It will signal `true` at
 * the start, and `false` when the input observable completes.
 */
export const isLoading = <T>(result$: Observable<T>): Observable<boolean> =>
    result$.pipe(
        last(),
        map(_.constant(false)),
        startWith(true),
    );
