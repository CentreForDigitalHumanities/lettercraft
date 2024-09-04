import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsibleCardComponent } from './collapsible-card.component';

describe('CollapsibleCardComponent', () => {
  let component: CollapsibleCardComponent;
  let fixture: ComponentFixture<CollapsibleCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollapsibleCardComponent]
    });
    fixture = TestBed.createComponent(CollapsibleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
