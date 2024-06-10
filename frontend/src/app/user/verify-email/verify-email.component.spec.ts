import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmailComponent } from './verify-email.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('VerifyEmailComponent', () => {
    let component: VerifyEmailComponent;
    let fixture: ComponentFixture<VerifyEmailComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [VerifyEmailComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(VerifyEmailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
