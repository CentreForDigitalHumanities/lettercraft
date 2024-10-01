import { NgModule } from "@angular/core";
import { LocationFormComponent } from "./location-form.component";
import { DataEntrySharedModule } from "../shared/data-entry-shared.module";
import { SharedModule } from "@shared/shared.module";
import { LocationIdentificationFormComponent } from "./location-identification-form/location-identification-form.component";
import { LocationSourceTextFormComponent } from "./location-source-text-form/location-source-text-form.component";

@NgModule({
    declarations: [
        LocationFormComponent,
        LocationIdentificationFormComponent,
        LocationSourceTextFormComponent,
    ],
    imports: [SharedModule, DataEntrySharedModule],
    exports: [LocationFormComponent],
})
export class LocationFormModule {}
