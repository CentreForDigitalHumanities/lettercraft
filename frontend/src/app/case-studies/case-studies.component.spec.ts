import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudiesComponent } from './case-studies.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('CaseStudiesComponent', () => {
    let component: CaseStudiesComponent;
    let fixture: ComponentFixture<CaseStudiesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CaseStudiesComponent],
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
