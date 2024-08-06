import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { SourcesComponent } from "./sources/sources.component";
import { SourceComponent } from "./source/source.component";
import { EpisodeFormModule } from "./episode-form/episode-form.module";
import { LabelSelectComponent } from "./label-select/label-select.component";
import { MultiselectComponent } from './shared/multiselect/multiselect.component';

@NgModule({
    declarations: [SourcesComponent, SourceComponent, LabelSelectComponent, MultiselectComponent],
    imports: [SharedModule, EpisodeFormModule],
    exports: [SourcesComponent, LabelSelectComponent, MultiselectComponent],
})
export class DataEntryModule {}
