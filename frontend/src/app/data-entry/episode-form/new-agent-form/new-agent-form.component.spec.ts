import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAgentFormComponent } from './new-agent-form.component';

describe('NewAgentFormComponent', () => {
  let component: NewAgentFormComponent;
  let fixture: ComponentFixture<NewAgentFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewAgentFormComponent]
    });
    fixture = TestBed.createComponent(NewAgentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
