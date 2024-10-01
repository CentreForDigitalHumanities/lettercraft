import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDescriptionFormComponent } from './agent-description-form.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { DataEntrySharedModule } from '../../shared/data-entry-shared.module';
import { FormService } from '../../shared/form.service';

describe('AgentDescriptionFormComponent', () => {
    let component: AgentDescriptionFormComponent;
    let fixture: ComponentFixture<AgentDescriptionFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AgentDescriptionFormComponent],
            imports: [SharedTestingModule, DataEntrySharedModule,],
            providers: [FormService],
        });
        fixture = TestBed.createComponent(AgentDescriptionFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
