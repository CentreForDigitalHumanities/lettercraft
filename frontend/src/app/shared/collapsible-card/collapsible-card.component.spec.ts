import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleCardComponent } from './collapsible-card.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('CollapsibleCardComponent', () => {
    let component: CollapsibleCardComponent;
    let fixture: ComponentFixture<CollapsibleCardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SharedTestingModule]
        });
        fixture = TestBed.createComponent(CollapsibleCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
