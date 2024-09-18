import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentFormComponent } from './agent-form.component';
import { SharedTestingModule } from '@shared/shared-testing.module';
import { AgentDescriptionFormComponent } from './agent-description-form/agent-description-form.component';
import { AgentIdentificationFormComponent } from './agent-identification-form/agent-identification-form.component';
import { DataEntrySharedModule } from '../shared/data-entry-shared.module';
import { FormService } from '../shared/form.service';

describe('AgentFormComponent', () => {
    let component: AgentFormComponent;
    let fixture: ComponentFixture<AgentFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AgentFormComponent,
                AgentIdentificationFormComponent,
                AgentDescriptionFormComponent,
            ],
            imports: [
                SharedTestingModule,
                DataEntrySharedModule,
            ],
            providers: [
                FormService,
            ]
        });
        fixture = TestBed.createComponent(AgentFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
