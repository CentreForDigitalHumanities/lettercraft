import { NgModule } from '@angular/core';
import { CaseStudiesListComponent } from './case-studies-list/case-studies-list.component';
import { SharedModule } from '@shared/shared.module';
import { CaseStudyViewComponent } from './case-study-view/case-study-view.component';
import { FootnotesDirective } from './case-study-view/footnotes/footnotes.directive';



@NgModule({
    declarations: [
        CaseStudiesListComponent,
        CaseStudyViewComponent,
        FootnotesDirective,
    ],
    imports: [
        SharedModule,
    ]
})
export class CaseStudiesModule { }
