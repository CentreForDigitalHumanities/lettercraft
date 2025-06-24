import { Injectable } from "@angular/core";
import { ApolloQueryResult } from "@apollo/client/core";
import { Query as ApolloAngularQuery } from "apollo-angular/query";
import {
    Observable,
    of,
    concat,
    map,
    switchMap,
    catchError,
    distinctUntilChanged,
    startWith,
    debounceTime,
} from "rxjs";

export interface SearchState<T> {
    loading: boolean;
    data: T | null;
    error: string | null;
    searchTerm?: string;
}

type SearchQueryVariable = {
    search?: string | null;
};

@Injectable({
    providedIn: "root",
})
export class SearchService {
    /**
     * Creates a reactive search observable that performs a GraphQL query.
     * The query must accept a `search` variable of type `string | null`.
     * The search term is debounced by 300ms and emits a loading state
     * before the query is executed.
     *
     * This guarantees that a loading state of true is always emitted first,
     * and that it is terminated by the query result (either success or error).
     */
    public createSearch<TQuery>(
        newSearch$: Observable<string>,
        query: ApolloAngularQuery<TQuery, SearchQueryVariable>
    ): Observable<SearchState<TQuery>> {
        const debouncedInput$: Observable<string> = newSearch$.pipe(
            startWith(""),
            debounceTime(300),
            distinctUntilChanged()
        );

        return debouncedInput$.pipe(
            switchMap((searchTerm) => {
                const query$ = query
                    .watch({
                        search: searchTerm,
                    })
                    .valueChanges.pipe(
                        map((result) =>
                            this.handleApolloResult<TQuery>(result)
                        ),
                        catchError((error) =>
                            this.handleFetchError<TQuery>(error, searchTerm)
                        )
                    );

                const loadingState: SearchState<TQuery> = {
                    loading: true,
                    data: null,
                    error: null,
                };

                return concat(of(loadingState), query$);
            })
        );
    }

    private handleApolloResult<T>(
        result: ApolloQueryResult<T>
    ): SearchState<T> {
        const errorMessage = this.handleApolloError(result);
        if (errorMessage) {
            return {
                loading: false,
                data: null,
                error: errorMessage,
            };
        }
        return {
            loading: false,
            data: result.data || null,
            error: null,
        };
    }

    private handleApolloError<T>(result: ApolloQueryResult<T>): string | null {
        if (result.errors && result.errors.length > 0) {
            return result.errors.map((e) => e.message).join(", ");
        } else if (result.error) {
            return result.error.message;
        }
        return null;
    }

    private handleFetchError<T>(
        error: { message?: string },
        searchTerm: string
    ): Observable<SearchState<T>> {
        return of({
            loading: false,
            data: null,
            error: error.message || "An error occurred while fetching data.",
            searchTerm: searchTerm,
        });
    }
}
