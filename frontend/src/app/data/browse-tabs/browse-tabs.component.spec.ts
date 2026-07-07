import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseTabsComponent, SearchFocus, TabData } from './browse-tabs.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { PaginatorComponent } from '../shared/paginator/paginator.component';
import { BrowseListItemComponent } from '../browse/search-item/browse-list-item.component';


describe('BrowseTabsComponent', () => {
    let component: BrowseTabsComponent;
    let fixture: ComponentFixture<BrowseTabsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BrowseTabsComponent, PaginatorComponent, BrowseListItemComponent],
            imports: [SharedTestingModule],
        })
            .compileComponents();

        fixture = TestBed.createComponent(BrowseTabsComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('hideSource', true);
        let data: TabData = {
            episodes: [{id: '1'}, {id: '2'}],
            agents: [{id: '1'}],
            letters: [],
            gifts: [],
            locations: [],
        };
        fixture.componentRef.setInput('data', data);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('counts signal', () => {
        it('should transform search results into counts map', () => {
            const counts = component.counts();
            expect(counts.get(SearchFocus.Sources)).toBe(undefined);
            expect(counts.get(SearchFocus.Episodes)).toBe(2);
            expect(counts.get(SearchFocus.Agents)).toBe(1);
            expect(counts.get(SearchFocus.Letters)).toBe(0);
            expect(counts.get(SearchFocus.Gifts)).toBe(0);
            expect(counts.get(SearchFocus.Locations)).toBe(0);
        });
    });
});
