import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationEpisodesFormComponent } from './location-episodes-form.component';
import { FormService } from '../../shared/form.service';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('LocationEpisodesFormComponent', () => {
    let component: LocationEpisodesFormComponent;
    let fixture: ComponentFixture<LocationEpisodesFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LocationEpisodesFormComponent],
            imports: [SharedTestingModule],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(LocationEpisodesFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
