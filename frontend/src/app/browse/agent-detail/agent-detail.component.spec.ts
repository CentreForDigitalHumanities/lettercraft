import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDetailComponent } from './agent-detail.component';

describe('AgentDetailComponent', () => {
  let component: AgentDetailComponent;
  let fixture: ComponentFixture<AgentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentDetailComponent]
    });
    fixture = TestBed.createComponent(AgentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
