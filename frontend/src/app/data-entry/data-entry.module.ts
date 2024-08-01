import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { SourcesComponent } from "./sources/sources.component";
import { SourceComponent } from "./source/source.component";
import { EpisodeFormComponent } from "./episode-form/episode-form.component";

@NgModule({
    declarations: [SourcesComponent, SourceComponent, EpisodeFormComponent],
    imports: [SharedModule],
    exports: [SourcesComponent],
})
export class DataEntryModule {}
