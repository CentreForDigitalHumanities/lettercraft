import { NgModule } from '@angular/core';
import { SourcesComponent } from './sources/sources.component';
import { SharedModule } from '../shared/shared.module';
import { SourceComponent } from './source/source.component';
import { AgentComponent } from './agent/agent.component';
import { SpaceComponent } from './space/space.component';
import { StructureComponent } from './space/structure/structure.component';



@NgModule({
    declarations: [
        SourcesComponent,
        SourceComponent,
        AgentComponent,
        SpaceComponent,
        StructureComponent
    ],
    imports: [
        SharedModule,
    ]
})
export class DataEntryModule { }
