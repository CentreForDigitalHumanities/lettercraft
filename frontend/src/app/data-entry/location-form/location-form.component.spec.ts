import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationFormComponent } from './location-form.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('LocationFormComponent', () => {
    let component: LocationFormComponent;
    let fixture: ComponentFixture<LocationFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LocationFormComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(LocationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
