import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudyViewComponent } from './case-study-view.component';

describe('CaseStudyViewComponent', () => {
  let component: CaseStudyViewComponent;
  let fixture: ComponentFixture<CaseStudyViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaseStudyViewComponent]
    });
    fixture = TestBed.createComponent(CaseStudyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
