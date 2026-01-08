import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePictureFieldComponent } from './profile-picture-field.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('ProfilePictureFieldComponent', () => {
    let component: ProfilePictureFieldComponent;
    let fixture: ComponentFixture<ProfilePictureFieldComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ProfilePictureFieldComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(ProfilePictureFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
