import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentIdentificationFormComponent } from './agent-identification-form.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { FormService } from '../../shared/form.service';

describe('AgentIdentificationFormComponent', () => {
    let component: AgentIdentificationFormComponent;
    let fixture: ComponentFixture<AgentIdentificationFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AgentIdentificationFormComponent],
            providers: [FormService],
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
