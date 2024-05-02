import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordForgottenComponent } from './password-forgotten.component';

describe('PasswordForgottenComponent', () => {
  let component: PasswordForgottenComponent;
  let fixture: ComponentFixture<PasswordForgottenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordForgottenComponent]
    });
    fixture = TestBed.createComponent(PasswordForgottenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
