import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowseComponent } from './browse.component';
import { SearchService } from '@services/search.service';
import { BrowseSearchGQL, BrowseSearchQuery, SearchFocus } from 'generated/graphql';
import { of } from 'rxjs';
import { dataIcons } from '@shared/icons';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { DataModule } from '../data.module';

const mockSearchData: BrowseSearchQuery = {
    search: {
        sources: [
            {
                id: '1',
                name: 'Test Source',
                descriptionText: 'Test description',
                reference: 'REF-1'
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
                }]
            }
        ],
        agents: [
            {
                id: '3',
                name: 'Test Agent',
                isGroup: false,
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
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('submitSearch', () => {
        it('should prevent default event and emit search', () => {
            const mockEvent = jasmine.createSpyObj('Event', ['preventDefault']);
            spyOn(component.startSearch$, 'next');

            component.form.controls.searchTerm.setValue('test query');
            component.form.controls.labelIds.setValue(['label1']);
            component.form.controls.searchFocus.setValue(SearchFocus.Episodes);

            component.submitSearch(mockEvent);

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(component.startSearch$.next).toHaveBeenCalledWith({
                searchTerm: 'test query',
                labelIds: ['label1'],
                searchFocus: SearchFocus.Episodes
            });
        });
    });

    describe('changeTabs', () => {
        it('should update selected type and submit search', () => {
            spyOn(component, 'submitSearch');

            component.changeTabs(SearchFocus.Agents);

            expect(component.form.controls.searchFocus.value).toBe(SearchFocus.Agents);
            expect(component.submitSearch).toHaveBeenCalled();
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
                    subtext: 'REF-1',
                    icon: dataIcons.source,
                    link: 'sources/1'
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
                    subtext: 'REF-1, book 1, chapter 2, page 10',
                    icon: dataIcons.episode,
                    link: 'episodes/2',
                    labels: ['Category1']
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
                    description: 'Occurs in 1 episode in REF-1',
                    subtext: 'Individual',
                    icon: dataIcons.person,
                    link: 'agents/3'
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
                    description: 'Occurs in 1 episodes in REF-1',
                    subtext: 'Letter',
                    icon: dataIcons.letter,
                    link: 'items/4'
                });
                expect(allItems[1]).toEqual({
                    id: '5',
                    name: 'Test Gift',
                    description: 'Occurs in 1 episodes in REF-1',
                    subtext: 'Gift',
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
                    description: 'Occurs in 1 episode in REF-1',
                    subtext: 'Location description',
                    icon: dataIcons.location,
                    link: 'locations/6'
                });
                done();
            });
        });
    });

    describe('occurrence data formatting', () => {
        it('should use plural "episodes" for multiple episodes', (done) => {
            const multiEpisodeData: BrowseSearchQuery = {
                search: {
                    ...mockSearchData.search!,
                    agents: [{
                        id: '3',
                        name: 'Test Agent',
                        isGroup: false,
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
                const agents = items.get(SearchFocus.Agents)!;
                expect(agents[0].description).toBe('Occurs in 2 episodes in REF-1');
                done();
            });
        });

        it('should use singular "episode" for one episode', (done) => {
            component.itemsByType$.subscribe(items => {
                const agents = items.get(SearchFocus.Agents)!;
                expect(agents[0].description).toBe('Occurs in 1 episode in REF-1');
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
                        isGroup: true,
                        episodes: [{ id: '2' }],
                        source: { id: '1', reference: 'REF-1' }
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
                const agents = items.get(SearchFocus.Agents)!;
                expect(agents[0].icon).toBe(dataIcons.group);
                expect(agents[0].subtext).toBe('Group');
                done();
            });
        });
    });
});
