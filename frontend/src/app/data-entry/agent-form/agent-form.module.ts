import { NgModule } from '@angular/core';
import { AgentFormComponent } from './agent-form.component';
import { SharedModule } from '@shared/shared.module';
import { AgentIdentificationFormComponent } from './agent-identification-form/agent-identification-form.component';
import { AgentDescriptionFormComponent } from './agent-description-form/agent-description-form.component';
import { DataEntrySharedModule } from "../shared/data-entry-shared.module";
import { DeleteAgentComponent } from './delete-agent/delete-agent.component';
import { AgentEpisodesFormComponent } from './agent-episodes-form/agent-episodes-form.component';
import { AgentHistoricalPersonFormComponent } from './agent-historical-person-form/agent-historical-person-form.component';


@NgModule({
    declarations: [
        AgentFormComponent,
        AgentIdentificationFormComponent,
        AgentDescriptionFormComponent,
        DeleteAgentComponent,
        AgentEpisodesFormComponent,
        AgentHistoricalPersonFormComponent,
    ],
    imports: [
        SharedModule,
        DataEntrySharedModule
    ],
    exports: [
        AgentFormComponent,
    ]
})
export class AgentFormModule { }
