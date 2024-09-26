import { NgModule } from '@angular/core';
import { CreateAgentComponent } from './create-agent/create-agent.component';
import { SharedModule } from '@shared/shared.module';
import { DataEntrySharedModule } from '../shared/data-entry-shared.module';
import { CreateAgentService } from './create-agent/create-agent.service';
import { CreateGiftService } from './create-agent/create-gift.service';
import { CreateLetterService } from './create-agent/create-letter.service';
import { CreateSpaceService } from './create-agent/create-space.service';



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
        CreateGiftService,
        CreateLetterService,
        CreateSpaceService,
    ]
})
export class CreateFormsModule { }
