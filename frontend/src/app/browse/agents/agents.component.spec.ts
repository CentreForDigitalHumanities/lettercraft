import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsComponent } from './agents.component';

describe('AgentsComponent', () => {
  let component: AgentsComponent;
  let fixture: ComponentFixture<AgentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentsComponent]
    });
    fixture = TestBed.createComponent(AgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
