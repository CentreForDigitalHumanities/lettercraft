import { NgModule } from '@angular/core';
import { CreateAgentComponent } from './create-agent/create-agent.component';
import { SharedModule } from '@shared/shared.module';
import { DataEntrySharedModule } from '../shared/data-entry-shared.module';
import { CreateAgentService } from './create-agent/create-agent.service';



@NgModule({
    declarations: [
        CreateAgentComponent
    ],
    imports: [
        SharedModule,
        DataEntrySharedModule,
    ],
    exports: [
        CreateAgentComponent,
    ],
    providers: [
        CreateAgentService,
    ]
})
export class CreateFormsModule { }
