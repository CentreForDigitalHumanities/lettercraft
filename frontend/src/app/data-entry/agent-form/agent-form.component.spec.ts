import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentFormComponent } from './agent-form.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('AgentFormComponent', () => {
    let component: AgentFormComponent;
    let fixture: ComponentFixture<AgentFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AgentFormComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(AgentFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
