import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudiesListComponent } from './case-studies-list.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { ViewCaseStudiesQuery } from 'generated/graphql';

describe('CaseStudiesListComponent', () => {
    let component: CaseStudiesListComponent;
    let fixture: ComponentFixture<CaseStudiesListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CaseStudiesListComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(CaseStudiesListComponent);
        const data: ViewCaseStudiesQuery['caseStudies'][number][] = [
            {
                id: '0',
                name: 'Test',
                date: '',
                authors: [
                    { id: '0', fullName: 'Tester' }
                ],
            }
        ];
        fixture.componentRef.setInput('data', data);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
