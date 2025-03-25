import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AgentViewComponent } from './agent-view/agent-view.component';
import { DataOverviewComponent } from './data-overview/data-overview.component';
import { SourceViewComponent } from './source-view/source-view.component';
import { EpisodeViewComponent } from './episode-view/episode-view.component';
import { LocationViewComponent } from './location-view/location-view.component';
import { LetterViewComponent } from './letter-view/letter-view.component';
import { GiftViewComponent } from './gift-view/gift-view.component';
import { EpisodeLinksComponent } from './shared/episode-links/episode-links.component';
import { ObjectPageHeaderComponent } from './shared/object-page-header/object-page-header.component';
import { EpisodePreviewComponent } from './source-view/episode-preview/episode-preview.component';



@NgModule({
    declarations: [
        AgentViewComponent,
        DataOverviewComponent,
        SourceViewComponent,
        EpisodeViewComponent,
        LocationViewComponent,
        LetterViewComponent,
        GiftViewComponent,
        EpisodeLinksComponent,
        ObjectPageHeaderComponent,
        EpisodePreviewComponent,
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
