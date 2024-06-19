import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectAltComponent } from './object-alt.component';

describe('ObjectAltComponent', () => {
  let component: ObjectAltComponent;
  let fixture: ComponentFixture<ObjectAltComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ObjectAltComponent]
    });
    fixture = TestBed.createComponent(ObjectAltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
