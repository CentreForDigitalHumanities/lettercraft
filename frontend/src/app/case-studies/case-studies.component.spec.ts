import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudiesComponent } from './case-studies.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { CaseStudiesListComponent } from './case-studies-list/case-studies-list.component';
import { CaseStudyViewComponent } from './case-study-view/case-study-view.component';

describe('CaseStudiesComponent', () => {
    let component: CaseStudiesComponent;
    let fixture: ComponentFixture<CaseStudiesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                CaseStudiesComponent, CaseStudiesListComponent, CaseStudyViewComponent
            ],
            imports: [SharedTestingModule],
        })
            .compileComponents();

        fixture = TestBed.createComponent(CaseStudiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
