import { TestBed } from "@angular/core/testing";
import { SearchService, SearchState } from "./search.service";
import { Subject, throwError } from "rxjs";
import { ApolloQueryResult } from "@apollo/client/core";
import { Query as ApolloAngularQuery } from "apollo-angular/query";
import { BrowseSearchQuery, BrowseSearchQueryVariables, SearchFocus } from "generated/graphql";
import { QueryRef } from "apollo-angular";

describe("SearchService", () => {
    let service: SearchService;
    let mockQuery: jasmine.SpyObj<ApolloAngularQuery<BrowseSearchQuery, BrowseSearchQueryVariables>>;
    let mockQueryRef: jasmine.SpyObj<QueryRef<BrowseSearchQuery, BrowseSearchQueryVariables>>;

    beforeEach(() => {
        // Create mock QueryRef
        mockQueryRef = jasmine.createSpyObj('QueryRef', [], {
            valueChanges: new Subject<ApolloQueryResult<BrowseSearchQuery>>()
        });

        // Create mock Query
        mockQuery = jasmine.createSpyObj('ApolloAngularQuery', ['watch']);
        mockQuery.watch.and.returnValue(mockQueryRef);

        TestBed.configureTestingModule({});
        service = TestBed.inject(SearchService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    describe('createSearch', () => {
        it('should emit loading state first, then success state', (done) => {
            const searchInput: BrowseSearchQueryVariables = {
                searchTerm: 'test',
                labelIds: [],
                searchFocus: SearchFocus.Sources
            };

            const mockData: BrowseSearchQuery = {
                search: {
                    sources: [],
                    episodes: [],
                    agents: [],
                    letters: [],
                    gifts: [],
                    locations: [],
                    sourceCount: 0,
                    episodeCount: 0,
                    agentCount: 0,
                    letterCount: 0,
                    giftCount: 0,
                    locationCount: 0
                }
            };

            const result: ApolloQueryResult<BrowseSearchQuery> = {
                data: mockData,
                loading: false,
                networkStatus: 7
            };

            const newSearch$ = new Subject<BrowseSearchQueryVariables>();
            const search$ = service.createSearch(newSearch$, mockQuery);

            const states: SearchState<BrowseSearchQuery>[] = [];
            search$.subscribe(state => {
                states.push(state);

                if (states.length === 2) {
                    // First emission should be loading
                    expect(states[0].loading).toBe(true);
                    expect(states[0].data).toBe(null);
                    expect(states[0].error).toBe(null);
                    expect(states[0].searchInput).toEqual(searchInput);

                    // Second emission should be success
                    expect(states[1].loading).toBe(false);
                    expect(states[1].data).toEqual(mockData);
                    expect(states[1].error).toBe(null);
                    expect(states[1].searchInput).toEqual(searchInput);

                    done();
                }
            });

            newSearch$.next(searchInput);
            (mockQueryRef.valueChanges as Subject<ApolloQueryResult<BrowseSearchQuery>>).next(result);
        });

        it('should handle GraphQL errors in result', (done) => {
            const searchInput: BrowseSearchQueryVariables = {
                searchTerm: 'test',
                labelIds: [],
                searchFocus: SearchFocus.Sources
            };

            const result: ApolloQueryResult<BrowseSearchQuery> = {
                data: {} as BrowseSearchQuery,
                loading: false,
                networkStatus: 7,
                errors: [{ message: 'GraphQL Error 1' }, { message: 'GraphQL Error 2' }]
            };

            const newSearch$ = new Subject<BrowseSearchQueryVariables>();
            const search$ = service.createSearch(newSearch$, mockQuery);

            const states: SearchState<BrowseSearchQuery>[] = [];
            search$.subscribe(state => {
                states.push(state);

                if (states.length === 2) {
                    // Second emission should be error
                    expect(states[1].loading).toBe(false);
                    expect(states[1].data).toBe(null);
                    expect(states[1].error).toBe('GraphQL Error 1, GraphQL Error 2');
                    expect(states[1].searchInput).toEqual(searchInput);

                    done();
                }
            });

            newSearch$.next(searchInput);
            (mockQueryRef.valueChanges as Subject<ApolloQueryResult<BrowseSearchQuery>>).next(result);
        });

        it('should handle error object in result', (done) => {
            const searchInput: BrowseSearchQueryVariables = {
                searchTerm: 'test',
                labelIds: [],
                searchFocus: SearchFocus.Sources
            };

            const result: ApolloQueryResult<BrowseSearchQuery> = {
                data: {} as BrowseSearchQuery,
                loading: false,
                networkStatus: 7,
                error: { message: 'Network Error' } as any
            };

            const newSearch$ = new Subject<BrowseSearchQueryVariables>();
            const search$ = service.createSearch(newSearch$, mockQuery);

            const states: SearchState<BrowseSearchQuery>[] = [];
            search$.subscribe(state => {
                states.push(state);

                if (states.length === 2) {
                    expect(states[1].loading).toBe(false);
                    expect(states[1].data).toBe(null);
                    expect(states[1].error).toBe('Network Error');
                    expect(states[1].searchInput).toEqual(searchInput);

                    done();
                }
            });

            newSearch$.next(searchInput);
            (mockQueryRef.valueChanges as Subject<ApolloQueryResult<BrowseSearchQuery>>).next(result);
        });

        it('should handle fetch errors', (done) => {
            const searchInput: BrowseSearchQueryVariables = {
                searchTerm: 'test',
                labelIds: [],
                searchFocus: SearchFocus.Sources
            };

            const mockQueryRefWithError = jasmine.createSpyObj('QueryRef', [], {
                valueChanges: throwError(() => ({ message: 'Fetch failed' }))
            });

            mockQuery.watch.and.returnValue(mockQueryRefWithError);

            const newSearch$ = new Subject<BrowseSearchQueryVariables>();
            const search$ = service.createSearch(newSearch$, mockQuery);

            const states: SearchState<BrowseSearchQuery>[] = [];
            search$.subscribe(state => {
                states.push(state);

                if (states.length === 2) {
                    expect(states[1].loading).toBe(false);
                    expect(states[1].data).toBe(null);
                    expect(states[1].error).toBe('Fetch failed');
                    expect(states[1].searchInput).toEqual(searchInput);

                    done();
                }
            });

            newSearch$.next(searchInput);
        });

        it('should handle fetch errors without message', (done) => {
            const searchInput: BrowseSearchQueryVariables = {
                searchTerm: 'test',
                labelIds: [],
                searchFocus: SearchFocus.Sources
            };

            const mockQueryRefWithError = jasmine.createSpyObj('QueryRef', [], {
                valueChanges: throwError(() => ({}))
            });

            mockQuery.watch.and.returnValue(mockQueryRefWithError);

            const newSearch$ = new Subject<BrowseSearchQueryVariables>();
            const search$ = service.createSearch(newSearch$, mockQuery);

            const states: SearchState<BrowseSearchQuery>[] = [];
            search$.subscribe(state => {
                states.push(state);

                if (states.length === 2) {
                    expect(states[1].loading).toBe(false);
                    expect(states[1].data).toBe(null);
                    expect(states[1].error).toBe('An error occurred while fetching data.');
                    expect(states[1].searchInput).toEqual(searchInput);

                    done();
                }
            });

            newSearch$.next(searchInput);
        });

        it('should handle multiple search requests sequentially', (done) => {
            const searchInput1: BrowseSearchQueryVariables = {
                searchTerm: 'first',
                labelIds: [],
                searchFocus: SearchFocus.Sources
            };

            const searchInput2: BrowseSearchQueryVariables = {
                searchTerm: 'second',
                labelIds: [],
                searchFocus: SearchFocus.Episodes
            };

            const mockData: BrowseSearchQuery = {
                search: {
                    sources: [],
                    episodes: [],
                    agents: [],
                    letters: [],
                    gifts: [],
                    locations: [],
                    sourceCount: 0,
                    episodeCount: 0,
                    agentCount: 0,
                    letterCount: 0,
                    giftCount: 0,
                    locationCount: 0
                }
            };

            const result: ApolloQueryResult<BrowseSearchQuery> = {
                data: mockData,
                loading: false,
                networkStatus: 7
            };

            const newSearch$ = new Subject<BrowseSearchQueryVariables>();
            const search$ = service.createSearch(newSearch$, mockQuery);

            let emissionCount = 0;
            search$.subscribe(state => {
                emissionCount++;

                // First search: loading
                if (emissionCount === 1) {
                    expect(state.loading).toBe(true);
                    expect(state.searchInput).toEqual(searchInput1);
                }
                // First search: success
                else if (emissionCount === 2) {
                    expect(state.loading).toBe(false);
                    expect(state.searchInput).toEqual(searchInput1);
                }
                // Second search: loading
                else if (emissionCount === 3) {
                    expect(state.loading).toBe(true);
                    expect(state.searchInput).toEqual(searchInput2);
                }
                // Second search: success
                else if (emissionCount === 4) {
                    expect(state.loading).toBe(false);
                    expect(state.searchInput).toEqual(searchInput2);
                    done();
                }
            });

            newSearch$.next(searchInput1);
            (mockQueryRef.valueChanges as Subject<ApolloQueryResult<BrowseSearchQuery>>).next(result);
            newSearch$.next(searchInput2);
            (mockQueryRef.valueChanges as Subject<ApolloQueryResult<BrowseSearchQuery>>).next(result);
        });
    });
});
