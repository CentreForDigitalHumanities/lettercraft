import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { SourcesComponent } from "./sources/sources.component";
import { SourceComponent } from "./source/source.component";
import { EpisodeFormModule } from "./episode-form/episode-form.module";
import { LabelSelectComponent } from "./label-select/label-select.component";

@NgModule({
    declarations: [SourcesComponent, SourceComponent, LabelSelectComponent],
    imports: [SharedModule, EpisodeFormModule],
    exports: [SourcesComponent, LabelSelectComponent],
})
export class DataEntryModule {}
