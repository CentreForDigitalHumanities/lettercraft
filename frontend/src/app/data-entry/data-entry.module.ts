import { NgModule } from '@angular/core';
import { SourcesComponent } from './sources/sources.component';
import { SharedModule } from '../shared/shared.module';
import { SourceComponent } from './source/source.component';
import { AgentComponent } from './agent/agent.component';
import { SpaceComponent } from './space/space.component';
import { StructureComponent } from './space/structure/structure.component';
import { StructureTreeComponent } from './space/structure/structure-tree/structure-tree.component';
import { PoliticalRegionComponent } from './space/political-region/political-region.component';
import { ObjectComponent } from './object/object.component';
import { EventComponent } from './event/event.component';
import { SourceAltComponent } from './source-alt/source-alt.component';
import { EpisodeAltComponent } from './episode-alt/episode-alt.component';
import { AgentAltComponent } from './agent-alt/agent-alt.component';
import { LocationComponent } from './location/location.component';



@NgModule({
    declarations: [
        SourcesComponent,
        SourceComponent,
        AgentComponent,
        SpaceComponent,
        StructureComponent,
        StructureTreeComponent,
        PoliticalRegionComponent,
        ObjectComponent,
        EventComponent,
        SourceAltComponent,
        EpisodeAltComponent,
        AgentAltComponent,
        LocationComponent,
    ],
    exports: [
        SourcesComponent,
        SourceComponent,
        SourceAltComponent,
        AgentComponent,
        SpaceComponent,
        ObjectComponent,
        EventComponent,
        AgentAltComponent,
        LocationComponent,
    ],
    imports: [
        SharedModule,
    ]
})
export class DataEntryModule { }
