import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentIdentificationFormComponent } from './agent-identification-form.component';
import { SharedTestingModule } from '@shared/shared-testing.module';

describe('AgentIdentificationFormComponent', () => {
    let component: AgentIdentificationFormComponent;
    let fixture: ComponentFixture<AgentIdentificationFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AgentIdentificationFormComponent],
            imports: [SharedTestingModule],
        });
        fixture = TestBed.createComponent(AgentIdentificationFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
