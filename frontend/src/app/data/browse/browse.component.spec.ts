import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowseComponent } from './browse.component';
import { SearchService } from '@services/search.service';
import {
    BrowseSearchGQL, BrowseSearchQuery,
    BrowseSourcesPageGQL, BrowseEpisodesPageGQL, BrowseAgentsPageGQL,
    BrowseLettersPageGQL, BrowseGiftsPageGQL, BrowseLocationsPageGQL,
} from 'generated/graphql';
import { of } from 'rxjs';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { DataModule } from '../data.module';

const mockSearchData: BrowseSearchQuery = {
    search: {
        sources: [{ id: '1' }],
        episodes: [{ id: '2' }],
        agents: [{ id: '3' }],
        letters: [{ id: '4' }],
        gifts: [{ id: '5' }],
        locations: [{ id: '6' }],
    }
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
            }
        }));

        // Setup page query mocks

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

    describe('searchResult$ observable', () => {
        it('should call createSearch with correct parameters', () => {
            expect(mockSearchService.createSearch).toHaveBeenCalledWith(
                jasmine.any(Object),
                mockSearchQuery
            );
        });
    });

});
