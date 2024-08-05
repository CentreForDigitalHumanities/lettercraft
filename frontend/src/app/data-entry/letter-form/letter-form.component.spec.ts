import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterFormComponent } from './letter-form.component';

describe('LetterFormComponent', () => {
  let component: LetterFormComponent;
  let fixture: ComponentFixture<LetterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LetterFormComponent]
    });
    fixture = TestBed.createComponent(LetterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
