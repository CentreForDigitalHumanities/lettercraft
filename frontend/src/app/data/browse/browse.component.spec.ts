import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowseComponent } from './browse.component';
import { SearchService } from '@services/search.service';
import {
    BrowseSearchGQL, BrowseSearchQuery, SearchFocus,
    BrowseSourcesPageGQL, BrowseEpisodesPageGQL, BrowseAgentsPageGQL,
    BrowseLettersPageGQL, BrowseGiftsPageGQL, BrowseLocationsPageGQL,
    BrowseSourcesPageQuery, BrowseEpisodesPageQuery, BrowseAgentsPageQuery,
    BrowseLettersPageQuery, BrowseGiftsPageQuery, BrowseLocationsPageQuery
} from 'generated/graphql';
import { of } from 'rxjs';
import { dataIcons } from '@shared/icons';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { DataModule } from '../data.module';
import { EntityListItem } from './search-item/browse-list-item.component';

const mockSearchData: BrowseSearchQuery = {
    search: {
        sources: [{ id: '1' }],
        episodes: [{ id: '2' }],
        agents: [{ id: '3' }],
        letters: [{ id: '4' }],
        gifts: [{ id: '5' }],
        locations: [{ id: '6' }],
        sourceCount: 1,
        episodeCount: 1,
        agentCount: 1,
        letterCount: 1,
        giftCount: 1,
        locationCount: 1
    }
};


const mockSourcesPageData: BrowseSourcesPageQuery = {
    sources: [
        {
            id: '1',
            name: 'Test Source',
            descriptionText: 'Test description',
            reference: 'REF-1',
            episodes: [{ id: '2' }],
        }
    ]
};

const mockEpisodesPageData: BrowseEpisodesPageQuery = {
    episodes: [
        {
            id: '2',
            name: 'Test Episode',
            summary: 'Test summary',
            book: "1",
            chapter: "2",
            page: "10",
            source: {
                id: '1',
                name: 'REF-1'
            },
            categories: [{
                id: 'cat1',
                name: 'Category1'
            }],
            agents: [{ id: 'ea1', agent: { id: '3', name: 'Agent 1', isGroup: false, identified: true } }],
            letters: [{ id: 'el1', letter: { id: '4', name: 'Letter 1' } }],
            gifts: [{ id: 'eg1', gift: { id: '5', name: 'Gift 1' } }],
            spaces: [{ id: 'es1', space: { id: '6', name: 'Location 1', hasIdentifiableFeatures: false } }],
        }
    ]
};

const mockAgentsPageData: BrowseAgentsPageQuery = {
    agentDescriptions: [
        {
            id: '3',
            name: 'Test Agent',
            description: 'Agent description',
            isGroup: false,
            identified: true,
            episodes: [{ id: '2' }],
            source: {
                id: '1',
                name: 'REF-1'
            }
        }
    ]
};

const mockLettersPageData: BrowseLettersPageQuery = {
    letterDescriptions: [
        {
            id: '4',
            name: 'Test Letter',
            description: 'Letter description',
            episodes: [{ id: '2' }],
            source: {
                id: '1',
                name: 'REF-1'
            }
        }
    ]
};

const mockGiftsPageData: BrowseGiftsPageQuery = {
    giftDescriptions: [
        {
            id: '5',
            name: 'Test Gift',
            description: 'Gift description',
            episodes: [{ id: '2' }],
            source: {
                id: '1',
                name: 'REF-1'
            }
        }
    ]
};

const mockLocationsPageData: BrowseLocationsPageQuery = {
    spaceDescriptions: [
        {
            id: '6',
            name: 'Test Location',
            description: 'Location description',
            hasIdentifiableFeatures: false,
            episodes: [{ id: '2' }],
            source: {
                id: '1',
                name: 'REF-1'
            }
        }
    ]
};


describe('BrowseComponent', () => {
    let component: BrowseComponent;
    let fixture: ComponentFixture<BrowseComponent>;
    let mockSearchService: jasmine.SpyObj<SearchService>;
    let mockSearchQuery: jasmine.SpyObj<BrowseSearchGQL>;
    let mockSourcesPageQuery: jasmine.SpyObj<BrowseSourcesPageGQL>;
    let mockEpisodesPageQuery: jasmine.SpyObj<BrowseEpisodesPageGQL>;
    let mockAgentsPageQuery: jasmine.SpyObj<BrowseAgentsPageGQL>;
    let mockLettersPageQuery: jasmine.SpyObj<BrowseLettersPageGQL>;
    let mockGiftsPageQuery: jasmine.SpyObj<BrowseGiftsPageGQL>;
    let mockLocationsPageQuery: jasmine.SpyObj<BrowseLocationsPageGQL>;
    let element: HTMLElement;

    beforeEach(async () => {
        mockSearchService = jasmine.createSpyObj('SearchService', ['createSearch']);
        mockSearchQuery = jasmine.createSpyObj('BrowseSearchGQL', ['watch']);
        mockSourcesPageQuery = jasmine.createSpyObj('BrowseSourcesPageGQL', ['watch']);
        mockEpisodesPageQuery = jasmine.createSpyObj('BrowseEpisodesPageGQL', ['watch']);
        mockAgentsPageQuery = jasmine.createSpyObj('BrowseAgentsPageGQL', ['watch']);
        mockLettersPageQuery = jasmine.createSpyObj('BrowseLettersPageGQL', ['watch']);
        mockGiftsPageQuery = jasmine.createSpyObj('BrowseGiftsPageGQL', ['watch']);
        mockLocationsPageQuery = jasmine.createSpyObj('BrowseLocationsPageGQL', ['watch']);

        await TestBed.configureTestingModule({
            imports: [DataModule, SharedTestingModule, NgbNavModule],
            providers: [
                { provide: SearchService, useValue: mockSearchService },
                { provide: BrowseSearchGQL, useValue: mockSearchQuery },
                { provide: BrowseSourcesPageGQL, useValue: mockSourcesPageQuery },
                { provide: BrowseEpisodesPageGQL, useValue: mockEpisodesPageQuery },
                { provide: BrowseAgentsPageGQL, useValue: mockAgentsPageQuery },
                { provide: BrowseLettersPageGQL, useValue: mockLettersPageQuery },
                { provide: BrowseGiftsPageGQL, useValue: mockGiftsPageQuery },
                { provide: BrowseLocationsPageGQL, useValue: mockLocationsPageQuery }
            ]
        }).compileComponents();

        // Setup default mock behavior
        mockSearchService.createSearch.and.returnValue(of({
            loading: false,
            data: mockSearchData,
            error: null,
            searchInput: {
                searchTerm: '',
                labelIds: [],
                searchFocus: SearchFocus.Sources
            }
        }));

        // Setup page query mocks
        mockSourcesPageQuery.watch.and.returnValue({ valueChanges: of({ loading: false, data: mockSourcesPageData, error: undefined } as any) } as any);
        mockEpisodesPageQuery.watch.and.returnValue({ valueChanges: of({ loading: false, data: mockEpisodesPageData, error: undefined } as any) } as any);
        mockAgentsPageQuery.watch.and.returnValue({ valueChanges: of({ loading: false, data: mockAgentsPageData, error: undefined } as any) } as any);
        mockLettersPageQuery.watch.and.returnValue({ valueChanges: of({ loading: false, data: mockLettersPageData, error: undefined } as any) } as any);
        mockGiftsPageQuery.watch.and.returnValue({ valueChanges: of({ loading: false, data: mockGiftsPageData, error: undefined } as any) } as any);
        mockLocationsPageQuery.watch.and.returnValue({ valueChanges: of({ loading: false, data: mockLocationsPageData, error: undefined } as any) } as any);

        fixture = TestBed.createComponent(BrowseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        element = fixture.debugElement.nativeElement as HTMLElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('search form', () => {
        let form: HTMLElement;

        beforeEach(() => {
            form = element.getElementsByClassName('search-form').item(0) as HTMLElement;
        });

        it('should prevent default event and emit search', () => {
            const event = new Event('submit');
            spyOn(event, 'preventDefault');

            spyOn(component.formSubmit$, 'next');

            form.dispatchEvent(event);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(component.formSubmit$.next).toHaveBeenCalled();
        });

        it('should bind to form values', () => {
            const input = form.getElementsByTagName('input').item(0) as HTMLInputElement;
            input.value = 'test';
            input.dispatchEvent(new Event('input'));

            expect(component.form.value.searchTerm).toBe('test');
        });
    });

    describe('changeTabs', () => {
        it('should update selected type', () => {
            component.changeTabs(SearchFocus.Agents);
            expect(component.form.controls.searchFocus.value).toBe(SearchFocus.Agents);
        });
    });

    describe('searchResult$ observable', () => {
        it('should call createSearch with correct parameters', () => {
            expect(mockSearchService.createSearch).toHaveBeenCalledWith(
                jasmine.any(Object),
                mockSearchQuery
            );
        });
    });

    describe('counts$ observable', () => {
        it('should transform search results into counts map', (done) => {
            component.counts$.subscribe(counts => {
                expect(counts.get(SearchFocus.Sources)).toBe(1);
                expect(counts.get(SearchFocus.Episodes)).toBe(1);
                expect(counts.get(SearchFocus.Agents)).toBe(1);
                expect(counts.get(SearchFocus.Letters)).toBe(1);
                expect(counts.get(SearchFocus.Gifts)).toBe(1);
                expect(counts.get(SearchFocus.Locations)).toBe(1);
                done();
            });
        });
    });

    describe('pageResultsByType', () => {
        it('should transform sources correctly', (done) => {
            const sourcesPageResult = component.pageResultsByType.get(SearchFocus.Sources)!;
            sourcesPageResult.pageData$.subscribe(sources => {
                expect(sources.length).toBe(1);
                expect(sources[0]).toEqual({
                    id: '1',
                    name: 'Test Source',
                    description: 'Test description',
                    type: 'source',
                    icon: dataIcons.source,
                    link: 'sources/1',
                    numOfEpisodes: 1,
                });
                done();
            });
        });

        it('should transform episodes correctly', (done) => {
            const episodesPageResult = component.pageResultsByType.get(SearchFocus.Episodes)!;
            episodesPageResult.pageData$.subscribe(episodes => {
                expect(episodes.length).toBe(1);
                expect(episodes[0]).toEqual({
                    id: '2',
                    name: 'Test Episode',
                    description: 'Test summary',
                    type: 'episode',
                    icon: dataIcons.episode,
                    link: 'episodes/2',
                    labels: ['Category1'],
                    source: {
                        id: '1',
                        name: 'REF-1'
                    },
                    agents: [{
                        id: '3',
                        name: 'Agent 1',
                        icon: dataIcons.personIdentified,
                        link: 'agents/3'
                    }],
                    letters: [{
                        id: '4',
                        name: 'Letter 1',
                        icon: dataIcons.letter,
                        link: 'letters/4'
                    }],
                    gifts: [{
                        id: '5',
                        name: 'Gift 1',
                        icon: dataIcons.gift,
                        link: 'gifts/5'
                    }],
                    spaces: [{
                        id: '6',
                        name: 'Location 1',
                        icon: dataIcons.location,
                        link: 'locations/6'
                    }],
                    sourceLocation: {
                        book: "1",
                        chapter: "2",
                        page: "10"
                    }
                });
                done();
            });
        });

        it('should transform agents correctly', (done) => {
            const agentsPageResult = component.pageResultsByType.get(SearchFocus.Agents)!;
            agentsPageResult.pageData$.subscribe(agents => {
                expect(agents.length).toBe(1);
                expect(agents[0]).toEqual({
                    id: '3',
                    name: 'Test Agent',
                    description: 'Agent description',
                    type: 'entity',
                    icon: dataIcons.personIdentified,
                    link: 'agents/3',
                    numOfEpisodes: 1,
                    source: {
                        name: 'REF-1',
                        id: '1'
                    }
                });
                done();
            });
        });

        it('should transform letters correctly', (done) => {
            const lettersPageResult = component.pageResultsByType.get(SearchFocus.Letters)!;
            lettersPageResult.pageData$.subscribe(letters => {
                expect(letters.length).toBe(1);
                expect(letters[0]).toEqual({
                    id: '4',
                    name: 'Test Letter',
                    description: 'Letter description',
                    type: 'entity',
                    numOfEpisodes: 1,
                    source: {
                        name: 'REF-1',
                        id: '1'
                    },
                    icon: dataIcons.letter,
                    link: 'letters/4'
                });
                done();
            });
        });

        it('should transform gifts correctly', (done) => {
            const giftsPageResult = component.pageResultsByType.get(SearchFocus.Gifts)!;
            giftsPageResult.pageData$.subscribe(gifts => {
                expect(gifts.length).toBe(1);
                expect(gifts[0]).toEqual({
                    id: '5',
                    name: 'Test Gift',
                    description: 'Gift description',
                    type: 'entity',
                    numOfEpisodes: 1,
                    source: {
                        name: 'REF-1',
                        id: '1'
                    },
                    icon: dataIcons.gift,
                    link: 'gifts/5'
                });
                done();
            });
        });


        it('should transform locations correctly', (done) => {
            const locationsPageResult = component.pageResultsByType.get(SearchFocus.Locations)!;
            locationsPageResult.pageData$.subscribe(locations => {
                expect(locations.length).toBe(1);
                expect(locations[0]).toEqual({
                    id: '6',
                    name: 'Test Location',
                    description: 'Location description',
                    type: 'entity',
                    numOfEpisodes: 1,
                    source: {
                        name: 'REF-1',
                        id: '1'
                    },
                    icon: dataIcons.location,
                    link: 'locations/6'
                });
                done();
            });
        });
    });

    describe('occurrence data', () => {
        it('should create occurrence data for entities with multiple episodes', (done) => {
            const multiEpisodeAgentData: BrowseAgentsPageQuery = {
                agentDescriptions: [{
                    id: '3',
                    name: 'Test Agent',
                    description: 'Agent description',
                    isGroup: false,
                    identified: true,
                    episodes: [{ id: '1' }, { id: '2' }],
                    source: { id: '1', name: 'REF-1' }
                }]
            };

            mockAgentsPageQuery.watch.and.returnValue({
                valueChanges: of({ loading: false, data: multiEpisodeAgentData, error: undefined } as any)
            } as any);

            // Recreate component to apply new mock
            fixture = TestBed.createComponent(BrowseComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const agentsPageResult = component.pageResultsByType.get(SearchFocus.Agents)!;
            agentsPageResult.pageData$.subscribe(agents => {
                const entityAgents = agents as EntityListItem[];
                expect(entityAgents[0].numOfEpisodes).toBe(2);
                expect(entityAgents[0].source.name).toBe('REF-1');
                expect(entityAgents[0].source.id).toBe('1');
                done();
            });
        });

        it('should create occurrence data for entities with one episode', (done) => {
            const agentsPageResult = component.pageResultsByType.get(SearchFocus.Agents)!;
            agentsPageResult.pageData$.subscribe(agents => {
                const entityAgents = agents as EntityListItem[];
                expect(entityAgents[0].numOfEpisodes).toBe(1);
                expect(entityAgents[0].source.name).toBe('REF-1');
                expect(entityAgents[0].source.id).toBe('1');
                done();
            });
        });
    });

    describe('group vs individual agents', () => {
        it('should use group icon for group agents', (done) => {
            const groupAgentData: BrowseAgentsPageQuery = {
                agentDescriptions: [{
                    id: '3',
                    name: 'Test Group',
                    description: 'Group description',
                    isGroup: true,
                    identified: false,
                    episodes: [{ id: '2' }],
                    source: { id: '1', name: 'REF-1' },
                }]
            };

            mockAgentsPageQuery.watch.and.returnValue({
                valueChanges: of({ loading: false, data: groupAgentData, error: undefined } as any)
            } as any);

            fixture = TestBed.createComponent(BrowseComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            const agentsPageResult = component.pageResultsByType.get(SearchFocus.Agents)!;
            agentsPageResult.pageData$.subscribe(agents => {
                const entityAgents = agents as EntityListItem[];
                expect(entityAgents[0].icon).toBe(dataIcons.group);
                expect(entityAgents[0].numOfEpisodes).toBe(1);
                done();
            });
        });
    });
});
