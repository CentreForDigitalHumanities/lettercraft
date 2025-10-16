import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudyViewComponent } from './case-study-view.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('CaseStudyViewComponent', () => {
    let component: CaseStudyViewComponent;
    let fixture: ComponentFixture<CaseStudyViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CaseStudyViewComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(CaseStudyViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
