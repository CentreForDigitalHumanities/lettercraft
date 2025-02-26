import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AgentViewComponent } from './agent-view/agent-view.component';
import { DataOverviewComponent } from './data-overview/data-overview.component';
import { SourceViewComponent } from './source-view/source-view.component';
import { EpisodeViewComponent } from './episode-view/episode-view.component';
import { LocationViewComponent } from './location-view/location-view.component';



@NgModule({
    declarations: [
        AgentViewComponent,
        DataOverviewComponent,
        SourceViewComponent,
        EpisodeViewComponent,
        LocationViewComponent,
    ],
    imports: [
        SharedModule,
    ],
    exports: [
        AgentViewComponent,
        DataOverviewComponent,
        SourceViewComponent,
        EpisodeViewComponent,
    ]
})
export class DataModule { }
