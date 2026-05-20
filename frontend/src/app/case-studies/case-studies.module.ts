import { NgModule } from '@angular/core';
import { CaseStudiesListComponent } from './case-studies-list/case-studies-list.component';
import { SharedModule } from '@shared/shared.module';
import { CaseStudyViewComponent } from './case-study-view/case-study-view.component';
import { FootnotesDirective } from './case-study-view/footnotes/footnotes.directive';
import { CaseStudiesComponent } from './case-studies.component';



@NgModule({
    declarations: [
        CaseStudiesListComponent,
        CaseStudyViewComponent,
        FootnotesDirective,
        CaseStudiesComponent,
    ],
    imports: [
        SharedModule,
    ]
})
export class CaseStudiesModule { }
