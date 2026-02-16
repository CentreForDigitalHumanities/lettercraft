import { ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed } from '@angular/core/testing';
import { BrowseComponent } from './browse.component';
import { SearchService } from '@services/search.service';
import { BrowseSearchGQL, BrowseSearchQuery, SearchFocus } from 'generated/graphql';
import { of } from 'rxjs';
import { dataIcons } from '@shared/icons';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { DataModule } from '../data.module';
import { EntityListItem } from './search-item/browse-list-item.component';

const mockSearchData: BrowseSearchQuery = {
    search: {
        sources: [
            {
                id: '1',
                name: 'Test Source',
                descriptionText: 'Test description',
                reference: 'REF-1',
                episodes: [{ id: '2' }],
            }
        ],
        episodes: [
            {
                id: '2',
                name: 'Test Episode',
                summary: 'Test summary',
                source: {
                    id: '1',
                    reference: 'REF-1'
                },
                book: "1",
                chapter: "2",
                page: "10",
                categories: [{
                    id: 'cat1',
                    name: 'Category1'
                }],
                agents: [{ id: 'ea1', agent: { id: '3', name: 'Agent 1', isGroup: false, identified: true } }],
                letters: [{ id: 'el1', letter: { id: '4', name: 'Letter 1' } }],
                gifts: [{ id: 'eg1', gift: { id: '5', name: 'Gift 1' } }],
                spaces: [{ id: 'es1', space: { id: '6', name: 'Location 1', hasIdentifiableFeatures: false } }],
            }
        ],
        agents: [
            {
                id: '3',
                name: 'Test Agent',
                description: 'Agent description',
                isGroup: false,
                identified: true,
                episodes: [{ id: '2' }],
                source: {
                    id: '1',
                    reference: 'REF-1'
                }
            }
        ],
        letters: [
            {
                id: '4',
                name: 'Test Letter',
                description: 'Letter description',
                episodes: [{ id: '2' }],
                source: {
                    id: '1',
                    reference: 'REF-1'
                }
            }
        ],
        gifts: [
            {
                id: '5',
                name: 'Test Gift',
                description: 'Gift description',
                episodes: [{ id: '2' }],
                source: {
                    id: '1',
                    reference: 'REF-1'
                }
            }
        ],
        locations: [
            {
                id: '6',
                name: 'Test Location',
                description: 'Location description',
                hasIdentifiableFeatures: false,
                episodes: [{ id: '2' }],
                source: {
                    id: '1',
                    reference: 'REF-1'
                }
            }
        ],
        sourceCount: 1,
        episodeCount: 1,
        agentCount: 1,
        letterCount: 1,
        giftCount: 1,
        locationCount: 1
    }
};


describe('BrowseComponent', () => {
    let component: BrowseComponent;
    let fixture: ComponentFixture<BrowseComponent>;
    let mockSearchService: jasmine.SpyObj<SearchService>;
    let mockSearchQuery: jasmine.SpyObj<BrowseSearchGQL>;
    let element: HTMLElement;

    beforeEach(async () => {
        mockSearchService = jasmine.createSpyObj('SearchService', ['createSearch']);
        mockSearchQuery = jasmine.createSpyObj('BrowseSearchGQL', ['watch']);

        await TestBed.configureTestingModule({
            imports: [DataModule, SharedTestingModule, NgbNavModule],
            providers: [
                { provide: SearchService, useValue: mockSearchService },
                { provide: BrowseSearchGQL, useValue: mockSearchQuery }
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
                // letterCount + giftCount
                expect(counts.get(SearchFocus.Items)).toBe(2);
                expect(counts.get(SearchFocus.Locations)).toBe(1);
                done();
            });
        });
    });

    describe('itemsByType$ observable', () => {
        it('should transform sources correctly', (done) => {
            component.itemsByType$.subscribe(items => {
                const sources = items.get(SearchFocus.Sources)!;
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
            component.itemsByType$.subscribe(items => {
                const episodes = items.get(SearchFocus.Episodes)!;
                expect(episodes.length).toBe(1);
                expect(episodes[0]).toEqual({
                    id: '2',
                    name: 'Test Episode',
                    description: 'Test summary',
                    type: 'episode',
                    icon: dataIcons.episode,
                    link: 'episodes/2',
                    labels: ['Category1'],
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
                        link: 'items/4'
                    }],
                    gifts: [{
                        id: '5',
                        name: 'Gift 1',
                        icon: dataIcons.gift,
                        link: 'items/5'
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
            component.itemsByType$.subscribe(items => {
                const agents = items.get(SearchFocus.Agents)!;
                expect(agents.length).toBe(1);
                expect(agents[0]).toEqual({
                    id: '3',
                    name: 'Test Agent',
                    description: 'Agent description',
                    type: 'entity',
                    icon: dataIcons.personIdentified,
                    link: 'agents/3',
                    occurrence: {
                        numOfEpisodes: 1,
                        sourceName: 'REF-1',
                        sourceLink: 'sources/1'
                    }
                });
                done();
            });
        });

        it('should transform letters and gifts into items', (done) => {
            component.itemsByType$.subscribe(items => {
                const allItems = items.get(SearchFocus.Items)!;
                expect(allItems.length).toBe(2);
                expect(allItems[0]).toEqual({
                    id: '4',
                    name: 'Test Letter',
                    description: 'Letter description',
                    type: 'entity',
                    occurrence: {
                        numOfEpisodes: 1,
                        sourceName: 'REF-1',
                        sourceLink: 'sources/1'
                    },
                    icon: dataIcons.letter,
                    link: 'items/4'
                });
                expect(allItems[1]).toEqual({
                    id: '5',
                    name: 'Test Gift',
                    description: 'Gift description',
                    type: 'entity',
                    occurrence: {
                        numOfEpisodes: 1,
                        sourceName: 'REF-1',
                        sourceLink: 'sources/1'
                    },
                    icon: dataIcons.gift,
                    link: 'items/5'
                });
                done();
            });
        });

        it('should transform locations correctly', (done) => {
            component.itemsByType$.subscribe(items => {
                const locations = items.get(SearchFocus.Locations)!;
                expect(locations.length).toBe(1);
                expect(locations[0]).toEqual({
                    id: '6',
                    name: 'Test Location',
                    description: 'Location description',
                    type: 'entity',
                    occurrence: {
                        numOfEpisodes: 1,
                        sourceName: 'REF-1',
                        sourceLink: 'sources/1'
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
            const multiEpisodeData: BrowseSearchQuery = {
                search: {
                    ...mockSearchData.search!,
                    agents: [{
                        id: '3',
                        name: 'Test Agent',
                        description: 'Agent description',
                        isGroup: false,
                        identified: true,
                        episodes: [{ id: '1' }, { id: '2' }],
                        source: { id: '1', reference: 'REF-1' }
                    }]
                }
            };

            mockSearchService.createSearch.and.returnValue(of({
                loading: false,
                data: multiEpisodeData,
                error: null,
                searchInput: {
                    searchTerm: '',
                    labelIds: [],
                    searchFocus: SearchFocus.Agents
                }
            }));

            // Recreate component to apply new mock
            fixture = TestBed.createComponent(BrowseComponent);
            component = fixture.componentInstance;

            component.itemsByType$.subscribe(items => {
                const agents = items.get(SearchFocus.Agents)! as EntityListItem[];
                expect(agents[0].occurrence.numOfEpisodes).toBe(2);
                expect(agents[0].occurrence.sourceName).toBe('REF-1');
                expect(agents[0].occurrence.sourceLink).toBe('sources/1');
                done();
            });
        });

        it('should create occurrence data for entities with one episode', (done) => {
            component.itemsByType$.subscribe(items => {
                const agents = items.get(SearchFocus.Agents)! as EntityListItem[];
                expect(agents[0].occurrence.numOfEpisodes).toBe(1);
                expect(agents[0].occurrence.sourceName).toBe('REF-1');
                expect(agents[0].occurrence.sourceLink).toBe('sources/1');
                done();
            });
        });
    });

    describe('group vs individual agents', () => {
        it('should use group icon for group agents', (done) => {
            const groupAgentData: BrowseSearchQuery = {
                search: {
                    ...mockSearchData.search!,
                    agents: [{
                        id: '3',
                        name: 'Test Group',
                        description: 'Group description',
                        isGroup: true,
                        identified: false,
                        episodes: [{ id: '2' }],
                        source: { id: '1', reference: 'REF-1' },
                    }]
                }
            };

            mockSearchService.createSearch.and.returnValue(of({
                loading: false,
                data: groupAgentData,
                error: null,
                searchInput: {
                    searchTerm: '',
                    labelIds: [],
                    searchFocus: SearchFocus.Agents
                }
            }));

            fixture = TestBed.createComponent(BrowseComponent);
            component = fixture.componentInstance;
            component.itemsByType$.subscribe(items => {
                const agents = items.get(SearchFocus.Agents)! as EntityListItem[];
                expect(agents[0].icon).toBe(dataIcons.group);
                expect(agents[0].occurrence).toEqual({
                    numOfEpisodes: 1,
                    sourceName: 'REF-1',
                    sourceLink: 'sources/1'
                });
                done();
            });
        });
    });
});
