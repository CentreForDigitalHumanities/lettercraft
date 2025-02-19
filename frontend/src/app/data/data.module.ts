import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AgentViewComponent } from './agent-view/agent-view.component';



@NgModule({
    declarations: [
        AgentViewComponent,
    ],
    imports: [
        SharedModule,
    ],
    exports: [
        AgentViewComponent,
    ]
})
export class DataModule { }
