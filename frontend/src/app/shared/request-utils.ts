import { last, map, Observable, startWith } from "rxjs";
import _ from "underscore";

export const isLoading = (result$: Observable<any>) =>
    result$.pipe(
        last(),
        map(_.constant(false)),
        startWith(true),
    );
