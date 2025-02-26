import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectPageHeaderComponent } from './object-page-header.component';

describe('ObjectPageHeaderComponent', () => {
  let component: ObjectPageHeaderComponent;
  let fixture: ComponentFixture<ObjectPageHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ObjectPageHeaderComponent]
    });
    fixture = TestBed.createComponent(ObjectPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
