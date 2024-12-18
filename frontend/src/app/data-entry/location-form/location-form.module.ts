import { NgModule } from "@angular/core";
import { LocationFormComponent } from "./location-form.component";
import { DataEntrySharedModule } from "../shared/data-entry-shared.module";
import { SharedModule } from "@shared/shared.module";
import { LocationIdentificationFormComponent } from "./location-identification-form/location-identification-form.component";
import { LocationSourceTextFormComponent } from "./location-source-text-form/location-source-text-form.component";
import { LocationEpisodesFormComponent } from './location-episodes-form/location-episodes-form.component';
import { LocationRegionsFormComponent } from './location-regions-form/location-regions-form.component';
import { LocationSettlementsFormComponent } from './location-settlements-form/location-settlements-form.component';
import { LocationStructuresFormComponent } from './location-structures-form/location-structures-form.component';



@NgModule({
    declarations: [
        LocationFormComponent,
        LocationIdentificationFormComponent,
        LocationEpisodesFormComponent,
        LocationSourceTextFormComponent,
        LocationRegionsFormComponent,
        LocationSettlementsFormComponent,
        LocationStructuresFormComponent,
    ],
    imports: [SharedModule, DataEntrySharedModule],
    exports: [LocationFormComponent],
})
export class LocationFormModule {}
