import { NgModule } from "@angular/core";
import { LocationFormComponent } from "./location-form.component";
import { DataEntrySharedModule } from "../shared/data-entry-shared.module";
import { SharedModule } from "@shared/shared.module";

@NgModule({
    declarations: [LocationFormComponent],
    imports: [SharedModule, DataEntrySharedModule],
    exports: [LocationFormComponent],
})
export class LocationFormModule {}
