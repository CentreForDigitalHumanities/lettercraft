import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LocationFormComponent } from './location-form.component';
import { LocationEpisodesFormComponent } from './location-episodes-form/location-episodes-form.component';



@NgModule({
    declarations: [
        LocationFormComponent,
        LocationEpisodesFormComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [
        LocationFormComponent
    ]
})
export class LocationFormModule { }
