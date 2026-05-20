import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AgentViewComponent } from './agent-view/agent-view.component';
import { SourceViewComponent } from './source-view/source-view.component';
import { EpisodeViewComponent } from './episode-view/episode-view.component';
import { LocationViewComponent } from './location-view/location-view.component';
import { LetterViewComponent } from './letter-view/letter-view.component';
import { GiftViewComponent } from './gift-view/gift-view.component';
import { EpisodeLinksComponent } from './shared/episode-links/episode-links.component';
import { ObjectPageHeaderComponent } from './shared/object-page-header/object-page-header.component';
import { EpisodePreviewComponent } from './source-view/episode-preview/episode-preview.component';
import { PaginatorComponent } from './shared/paginator/paginator.component';
import { BrowseComponent } from './browse/browse.component';
import { BrowseListItemComponent } from './browse/search-item/browse-list-item.component';
import { BrowseLabelSelectComponent } from './browse/browse-label-select/browse-label-select.component';
import { DownloadComponent } from './download/download.component';

@NgModule({
    declarations: [
        AgentViewComponent,
        SourceViewComponent,
        EpisodeViewComponent,
        LocationViewComponent,
        LetterViewComponent,
        GiftViewComponent,
        EpisodeLinksComponent,
        ObjectPageHeaderComponent,
        EpisodePreviewComponent,
        PaginatorComponent,
        BrowseComponent,
        BrowseLabelSelectComponent,
        BrowseListItemComponent,
        DownloadComponent,
    ],
    imports: [
        SharedModule,
    ],
    exports: [
        AgentViewComponent,
        SourceViewComponent,
        EpisodeViewComponent,
    ]
})
export class DataModule { }
