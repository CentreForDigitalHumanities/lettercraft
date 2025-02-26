import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterViewComponent } from './letter-view.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('LetterViewComponent', () => {
    let component: LetterViewComponent;
    let fixture: ComponentFixture<LetterViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LetterViewComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(LetterViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
