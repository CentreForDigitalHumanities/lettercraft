import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgentComponent } from './create-agent.component';

describe('CreateAgentComponent', () => {
  let component: CreateAgentComponent;
  let fixture: ComponentFixture<CreateAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAgentComponent]
    });
    fixture = TestBed.createComponent(CreateAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
