import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LocationFormComponent } from './location-form.component';
import { LocationEpisodesFormComponent } from './location-episodes-form/location-episodes-form.component';
import { DataEntrySharedModule } from '../shared/data-entry-shared.module';



@NgModule({
    declarations: [
        LocationFormComponent,
        LocationEpisodesFormComponent
    ],
    imports: [
        SharedModule,
        DataEntrySharedModule,
    ],
    exports: [
        LocationFormComponent
    ]
})
export class LocationFormModule { }
