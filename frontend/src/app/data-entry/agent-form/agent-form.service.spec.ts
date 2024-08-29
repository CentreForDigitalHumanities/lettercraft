import { TestBed } from '@angular/core/testing';

import { AgentFormService } from './agent-form.service';

describe('AgentFormService', () => {
  let service: AgentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
