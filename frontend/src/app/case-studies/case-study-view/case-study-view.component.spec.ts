import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudyViewComponent } from './case-study-view.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { ViewCaseStudyQuery } from 'generated/graphql';

describe('CaseStudyViewComponent', () => {
    let component: CaseStudyViewComponent;
    let fixture: ComponentFixture<CaseStudyViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CaseStudyViewComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(CaseStudyViewComponent);
        const data: ViewCaseStudyQuery['caseStudy'] = {
            id: '0',
            name: 'Test',
            date: '',
            content: 'This is a test.',
            authors: [
                { id: '0', fullName: 'Tester' },
            ],
            sources: [
                { id: '0', name: 'Testing' },
            ],
        };
        fixture.componentRef.setInput('data', data);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
