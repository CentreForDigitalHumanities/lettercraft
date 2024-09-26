import { NgModule } from '@angular/core';
import { CreateAgentComponent } from './create-entity/create-entity.component';
import { SharedModule } from '@shared/shared.module';
import { DataEntrySharedModule } from '../shared/data-entry-shared.module';
import { CreateAgentService } from './create-entity/create-agent.service';
import { CreateGiftService } from './create-entity/create-gift.service';
import { CreateLetterService } from './create-entity/create-letter.service';
import { CreateSpaceService } from './create-entity/create-space.service';
import { CreateEntityService } from './create-entity/create-entity.service';



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
        CreateEntityService,
    ]
})
export class CreateFormsModule { }
