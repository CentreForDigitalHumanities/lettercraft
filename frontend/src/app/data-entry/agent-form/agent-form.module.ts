import { NgModule } from '@angular/core';
import { AgentFormComponent } from './agent-form.component';
import { SharedModule } from '@shared/shared.module';
import { AgentIdentificationFormComponent } from './agent-identification-form/agent-identification-form.component';



@NgModule({
    declarations: [
        AgentFormComponent,
        AgentIdentificationFormComponent,
    ],
    imports: [
        SharedModule,
    ],
    exports: [
        AgentFormComponent,
    ]
})
export class AgentFormModule { }
