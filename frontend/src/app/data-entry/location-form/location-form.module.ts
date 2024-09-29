import { NgModule } from "@angular/core";
import { LocationFormComponent } from "./location-form.component";
import { DataEntrySharedModule } from "../shared/data-entry-shared.module";
import { SharedModule } from "@shared/shared.module";
import { LocationIdentificationFormComponent } from "./location-identification-form/location-identification-form.component";
import { LocationSourceTextFormComponent } from "./location-source-text-form/location-source-text-form.component";
import { LocationSubspaceFormComponent } from './location-subspace-form/location-subspace-form.component';

@NgModule({
    declarations: [
        LocationFormComponent,
        LocationIdentificationFormComponent,
        LocationSourceTextFormComponent,
        LocationSubspaceFormComponent,
    ],
    imports: [SharedModule, DataEntrySharedModule],
    exports: [LocationFormComponent],
})
export class LocationFormModule {}
