import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EpisodeIdentificationFormComponent } from "./episode-identification-form/episode-identification-form.component";
import { EpisodeSourceTextFormComponent } from "./episode-source-text-form/episode-source-text-form.component";
import { EpisodeContentsFormComponent } from "./episode-contents-form/episode-contents-form.component";
import { EpisodeEntitiesFormComponent } from "./episode-entities-form/episode-entities-form.component";
import { SharedModule } from "@shared/shared.module";
import { EpisodeFormComponent } from "./episode-form.component";
import { DataEntrySharedModule } from "../shared/data-entry-shared.module";
import { NewEpisodeFormComponent } from "./new-episode-form/new-episode-form.component";
import { CreateFormsModule } from "../create-forms/create-forms.module";

@NgModule({
    declarations: [
        EpisodeFormComponent,
        EpisodeIdentificationFormComponent,
        EpisodeSourceTextFormComponent,
        EpisodeContentsFormComponent,
        EpisodeEntitiesFormComponent,
        NewEpisodeFormComponent,
    ],
    imports: [CommonModule, SharedModule, DataEntrySharedModule, CreateFormsModule,],
    exports: [NewEpisodeFormComponent, EpisodeFormComponent],
})
export class EpisodeFormModule {}
