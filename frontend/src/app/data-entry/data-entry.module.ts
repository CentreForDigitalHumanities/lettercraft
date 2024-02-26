import { NgModule } from '@angular/core';
import { SourcesComponent } from './sources/sources.component';
import { SharedModule } from '../shared/shared.module';
import { SourceComponent } from './source/source.component';



@NgModule({
    declarations: [
        SourcesComponent,
        SourceComponent
    ],
    imports: [
        SharedModule,
    ]
})
export class DataEntryModule { }
