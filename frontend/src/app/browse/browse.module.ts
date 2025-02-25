import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SourcesComponent } from "./sources/sources.component";
import { OverviewComponent } from "./overview/overview.component";
import { EpisodesComponent } from "./episodes/episodes.component";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "@shared/shared.module";
import { EpisodeComponent } from "./episode/episode.component";
import { AgentComponent } from "./agent/agent.component";
import { LocationComponent } from "./location/location.component";
import { GiftComponent } from "./gift/gift.component";
import { LetterComponent } from "./letter/letter.component";

@NgModule({
    declarations: [
        SourcesComponent,
        OverviewComponent,
        EpisodesComponent,
        EpisodeComponent,
        AgentComponent,
        LocationComponent,
        GiftComponent,
        LetterComponent,
    ],
    imports: [CommonModule, NgbNavModule, SharedModule],
    exports: [SourcesComponent, OverviewComponent, EpisodesComponent],
})
export class BrowseModule {}
