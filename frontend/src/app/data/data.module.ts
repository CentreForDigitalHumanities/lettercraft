import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AgentViewComponent } from './agent-view/agent-view.component';
import { DataOverviewComponent } from './data-overview/data-overview.component';



@NgModule({
    declarations: [
        AgentViewComponent,
        DataOverviewComponent,
    ],
    imports: [
        SharedModule,
    ],
    exports: [
        AgentViewComponent,
        DataOverviewComponent,
    ]
})
export class DataModule { }
