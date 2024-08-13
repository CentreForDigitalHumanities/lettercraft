import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterFormComponent } from './letter-form.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('LetterFormComponent', () => {
    let component: LetterFormComponent;
    let fixture: ComponentFixture<LetterFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LetterFormComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(LetterFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
