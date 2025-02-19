import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AgentViewComponent } from './agent-view/agent-view.component';
import { DataOverviewComponent } from './data-overview/data-overview.component';
import { SourceViewComponent } from './source-view/source-view.component';



@NgModule({
    declarations: [
        AgentViewComponent,
        DataOverviewComponent,
        SourceViewComponent,
    ],
    imports: [
        SharedModule,
    ],
    exports: [
        AgentViewComponent,
        DataOverviewComponent,
        SourceViewComponent,
    ]
})
export class DataModule { }
