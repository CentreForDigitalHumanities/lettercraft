import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentComponent } from './agent.component';
import { SharedTestingModule } from '../../shared/shared-testing.module';

describe('AgentComponent', () => {
    let component: AgentComponent;
    let fixture: ComponentFixture<AgentComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AgentComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(AgentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
