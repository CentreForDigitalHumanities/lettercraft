import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentAltComponent } from './agent-alt.component';

describe('AgentAltComponent', () => {
  let component: AgentAltComponent;
  let fixture: ComponentFixture<AgentAltComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentAltComponent]
    });
    fixture = TestBed.createComponent(AgentAltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
