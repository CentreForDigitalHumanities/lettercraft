import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudiesListComponent } from './case-studies-list.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('CaseStudiesListComponent', () => {
    let component: CaseStudiesListComponent;
    let fixture: ComponentFixture<CaseStudiesListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CaseStudiesListComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(CaseStudiesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
