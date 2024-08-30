import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentEpisodesFormComponent } from './agent-episodes-form.component';

describe('AgentEpisodesFormComponent', () => {
  let component: AgentEpisodesFormComponent;
  let fixture: ComponentFixture<AgentEpisodesFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentEpisodesFormComponent]
    });
    fixture = TestBed.createComponent(AgentEpisodesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
