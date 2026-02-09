import { Component, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { dataIcons } from '@shared/icons';
import {  ViewCaseStudyGQL, ViewCaseStudyQuery } from 'generated/graphql';
import { map, switchMap } from 'rxjs';

type CaseStudy = NonNullable<ViewCaseStudyQuery['caseStudy']>;

@Component({
    selector: 'lc-case-study-view',
    templateUrl: './case-study-view.component.html',
    styleUrls: ['./case-study-view.component.scss'],
    standalone: false
})
export class CaseStudyViewComponent {
    dataIcons = dataIcons;

    data = input.required<ViewCaseStudyQuery['caseStudy']>();

    constructor(
        private sanitizer: DomSanitizer,
    ) {
    }

    sanitizedContent(caseStudy: CaseStudy) {
        return this.sanitizer.bypassSecurityTrustHtml(caseStudy.content);
    }

}
