import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseLabelSelectComponent } from './browse-label-select.component';

describe('BrowseLabelSelectComponent', () => {
    let component: BrowseLabelSelectComponent;
    let fixture: ComponentFixture<BrowseLabelSelectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrowseLabelSelectComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BrowseLabelSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
