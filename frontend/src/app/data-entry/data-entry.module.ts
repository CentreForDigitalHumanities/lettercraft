import { NgModule } from '@angular/core';
import { SourcesComponent } from './sources/sources.component';
import { SharedModule } from '../shared/shared.module';
import { SourceComponent } from './source/source.component';
import { AgentComponent } from './agent/agent.component';



@NgModule({
    declarations: [
        SourcesComponent,
        SourceComponent,
        AgentComponent
    ],
    imports: [
        SharedModule,
    ]
})
export class DataEntryModule { }
