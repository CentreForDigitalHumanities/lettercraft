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
import { EpisodeListComponent } from './episode-list/episode-list.component';
import { SourceListComponent } from './source-list/source-list.component';
import { PaginatorComponent } from './shared/paginator/paginator.component';
import { LabelSelectComponent } from './omnibrowse/label-select/label-select.component';
import { OmnibrowseComponent } from './omnibrowse/omnibrowse.component';
import { SearchBarComponent } from './omnibrowse/search-bar/search-bar.component';
import { BrowseListItemComponent } from './omnibrowse/search-item/browse-list-item.component';



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
        SourceListComponent,
        EpisodeListComponent,
        SearchBarComponent,
        PaginatorComponent,
        OmnibrowseComponent,
        LabelSelectComponent,
        BrowseListItemComponent,
    ],
    imports: [
        SharedModule,
    ],
    exports: [
        AgentViewComponent,
        DataOverviewComponent,
        SourceViewComponent,
        EpisodeViewComponent,
    ],
})
export class DataModule { }
