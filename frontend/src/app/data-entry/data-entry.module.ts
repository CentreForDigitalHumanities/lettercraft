import { NgModule } from '@angular/core';
import { SourcesComponent } from './sources/sources.component';
import { SharedModule } from '../shared/shared.module';
import { SourceComponent } from './source/source.component';
import { AgentComponent } from './agent/agent.component';
import { SpaceComponent } from './space/space.component';
import { StructureComponent } from './space/structure/structure.component';
import { StructureTreeComponent } from './space/structure/structure-tree/structure-tree.component';
import { PoliticalRegionComponent } from './space/political-region/political-region.component';



@NgModule({
    declarations: [
        SourcesComponent,
        SourceComponent,
        AgentComponent,
        SpaceComponent,
        StructureComponent,
        StructureTreeComponent,
        PoliticalRegionComponent,
    ],
    imports: [
        SharedModule,
    ]
})
export class DataEntryModule { }
