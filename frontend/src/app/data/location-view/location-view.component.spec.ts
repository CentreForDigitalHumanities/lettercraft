import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationViewComponent } from './location-view.component';
import { SharedModule } from '@shared/shared.module';

describe('LocationViewComponent', () => {
    let component: LocationViewComponent;
    let fixture: ComponentFixture<LocationViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LocationViewComponent],
            imports: [SharedModule],
        });
        fixture = TestBed.createComponent(LocationViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
