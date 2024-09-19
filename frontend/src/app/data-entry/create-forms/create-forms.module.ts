import { NgModule } from '@angular/core';
import { CreateAgentComponent } from './create-agent/create-agent.component';
import { SharedModule } from '@shared/shared.module';
import { DataEntrySharedModule } from '../shared/data-entry-shared.module';



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
    ]
})
export class CreateFormsModule { }
