import { Component } from '@angular/core';
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
  styleUrls: ['./case-study-view.component.scss']
})
export class CaseStudyViewComponent {
    dataIcons = dataIcons;

    data$ = this.route.params.pipe(
        map(params => params['id']),
        switchMap(id => this.query.watch({id}).valueChanges),
        map(result => result.data),
    );

    constructor(
        private query: ViewCaseStudyGQL,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
    ) {
    }

    sanitizedContent(caseStudy: CaseStudy) {
        return this.sanitizer.bypassSecurityTrustHtml(caseStudy.content);
    }

    breadCrumbs(caseStudy: CaseStudy): Breadcrumb[] {
        return [
            {
                'label': 'Lettercraft',
                link: '/'
            },
            {
                'label': 'Case studies',
                link: '/case-studies',
            },
            {
                'label': caseStudy.name,
                link: '.',
            }
        ]
    }
}
