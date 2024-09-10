import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EpisodeIdentificationFormComponent } from "./episode-identification-form/episode-identification-form.component";
import { EpisodeSourceTextFormComponent } from "./episode-source-text-form/episode-source-text-form.component";
import { EpisodeContentsFormComponent } from "./episode-contents-form/episode-contents-form.component";
import { EpisodeAgentsFormComponent } from "./episode-agents-form/episode-agents-form.component";
import { EpisodeLocationsFormComponent } from "./episode-locations-form/episode-locations-form.component";
import { EpisodeObjectsFormComponent } from "./episode-objects-form/episode-objects-form.component";
import { SharedModule } from "@shared/shared.module";
import { EpisodeFormComponent } from "./episode-form.component";
import { DataEntrySharedModule } from "../shared/data-entry-shared.module";
import { NewEpisodeFormComponent } from "./new-episode-form/new-episode-form.component";
import { NewAgentFormComponent } from './new-agent-form/new-agent-form.component';

@NgModule({
    declarations: [
        EpisodeFormComponent,
        EpisodeIdentificationFormComponent,
        EpisodeSourceTextFormComponent,
        EpisodeContentsFormComponent,
        EpisodeAgentsFormComponent,
        EpisodeLocationsFormComponent,
        EpisodeObjectsFormComponent,
        NewEpisodeFormComponent,
        NewAgentFormComponent,
    ],
    imports: [CommonModule, SharedModule, DataEntrySharedModule],
    exports: [NewEpisodeFormComponent],
})
export class EpisodeFormModule {}
