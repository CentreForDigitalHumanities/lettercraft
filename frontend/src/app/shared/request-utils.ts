import { catchError, last, map, of, OperatorFunction, pipe, startWith } from "rxjs";
import _ from "underscore";

/**
 * Operator to check whether a request is still loading. It will signal `true` at
 * the start, and `false` when the input observable completes.
 */
export const isLoading = (): OperatorFunction<any, boolean> =>
    pipe(
        catchError(() => of(undefined)),
        last(),
        map(_.constant(false)),
        startWith(true),
    );
