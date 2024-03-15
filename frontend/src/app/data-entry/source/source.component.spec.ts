import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceComponent } from './source.component';

describe('SourceComponent', () => {
  let component: SourceComponent;
  let fixture: ComponentFixture<SourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SourceComponent]
    });
    fixture = TestBed.createComponent(SourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
