import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseTabsComponent } from './browse-tabs.component';

describe('BrowseTabsComponent', () => {
    let component: BrowseTabsComponent;
    let fixture: ComponentFixture<BrowseTabsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BrowseTabsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BrowseTabsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
