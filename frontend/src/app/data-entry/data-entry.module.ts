import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { SourcesComponent } from "./sources/sources.component";
import { GiftFormModule } from "./gift-form/gift-form.module";
import { LetterFormModule } from "./letter-form/letter-form.module";
import { LocationFormModule } from "./location-form/location-form.module";
import { AgentFormModule } from "./agent-form/agent-form.module";
import { SourceComponent } from './source/source.component';
import { EpisodePreviewComponent } from './source/episode-preview/episode-preview.component';
import { EpisodeFormModule } from "./episode-form/episode-form.module";

@NgModule({
    declarations: [
        SourcesComponent,
        SourceComponent,
        EpisodePreviewComponent,
    ],
    imports: [
        SharedModule,
        AgentFormModule,
        GiftFormModule,
        LetterFormModule,
        LocationFormModule,
        EpisodeFormModule
    ],
    exports: [
        SourcesComponent,
        AgentFormModule,
        GiftFormModule,
        LetterFormModule,
        LocationFormModule,
    ],
})
export class DataEntryModule {}
