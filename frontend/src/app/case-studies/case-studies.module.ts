import { NgModule } from '@angular/core';
import { CaseStudiesListComponent } from './case-studies-list/case-studies-list.component';
import { SharedModule } from '@shared/shared.module';
import { CaseStudyViewComponent } from './case-study-view/case-study-view.component';



@NgModule({
    declarations: [
        CaseStudiesListComponent,
        CaseStudyViewComponent
    ],
    imports: [
        SharedModule,
    ]
})
export class CaseStudiesModule { }
