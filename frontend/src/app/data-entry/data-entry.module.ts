import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { SourcesComponent } from "./sources/sources.component";
import { SourceComponent } from './source/source.component';
import { EpisodePreviewComponent } from './source/episode-preview/episode-preview.component';

@NgModule({
    declarations: [SourcesComponent, SourceComponent, EpisodePreviewComponent],
    imports: [SharedModule],
    exports: [SourcesComponent],
})
export class DataEntryModule {}
