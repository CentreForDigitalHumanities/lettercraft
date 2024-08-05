import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { SourcesComponent } from "./sources/sources.component";
import { GiftFormModule } from "./gift-form/gift-form.module";
import { LetterFormModule } from "./letter-form/letter-form.module";
import { LocationFormModule } from "./location-form/location-form.module";

@NgModule({
    declarations: [
        SourcesComponent,
    ],
    imports: [
        SharedModule,
        GiftFormModule,
        LetterFormModule,
        LocationFormModule,
    ],
    exports: [
        SourcesComponent,
        GiftFormModule,
        LetterFormModule,
        LocationFormModule,
    ],
})
export class DataEntryModule {}
