import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftFormComponent } from './gift-form.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('GiftFormComponent', () => {
    let component: GiftFormComponent;
    let fixture: ComponentFixture<GiftFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GiftFormComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(GiftFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
