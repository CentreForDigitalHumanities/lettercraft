import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterEpisodesFormComponent } from './letter-episodes-form.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('LetterEpisodesFormComponent', () => {
    let component: LetterEpisodesFormComponent;
    let fixture: ComponentFixture<LetterEpisodesFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LetterEpisodesFormComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(LetterEpisodesFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
