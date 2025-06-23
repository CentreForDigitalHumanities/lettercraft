import { NgModule } from '@angular/core';
import { CaseStudiesListComponent } from './case-studies-list/case-studies-list.component';
import { SharedModule } from '@shared/shared.module';



@NgModule({
    declarations: [
        CaseStudiesListComponent
    ],
    imports: [
        SharedModule,
    ]
})
export class CaseStudiesModule { }
