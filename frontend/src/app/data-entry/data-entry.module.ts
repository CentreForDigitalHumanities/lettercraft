import { NgModule } from '@angular/core';
import { SourcesComponent } from './sources/sources.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
    declarations: [
        SourcesComponent
    ],
    imports: [

        SharedModule,
    ]
})
export class DataEntryModule { }
