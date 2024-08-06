import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { SourcesComponent } from "./sources/sources.component";
import { GiftFormModule } from "./gift-form/gift-form.module";
import { LetterFormModule } from "./letter-form/letter-form.module";
import { LocationFormModule } from "./location-form/location-form.module";
import { AgentFormModule } from "./agent-form/agent-form.module";

@NgModule({
    declarations: [
        SourcesComponent,
    ],
    imports: [
        SharedModule,
        AgentFormModule,
        GiftFormModule,
        LetterFormModule,
        LocationFormModule,
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
