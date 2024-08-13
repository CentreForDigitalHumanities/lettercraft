import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LocationFormComponent } from './location-form.component';



@NgModule({
    declarations: [
        LocationFormComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [
        LocationFormComponent
    ]
})
export class LocationFormModule { }
