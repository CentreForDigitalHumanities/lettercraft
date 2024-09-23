import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStatusComponent } from './form-status.component';
import { FormService } from '../form.service';

describe('FormStatusComponent', () => {
  let component: FormStatusComponent;
  let fixture: ComponentFixture<FormStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [FormStatusComponent],
        providers: [FormService]
    });
    fixture = TestBed.createComponent(FormStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
