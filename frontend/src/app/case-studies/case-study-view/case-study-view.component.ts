import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {  ViewCaseStudyGQL, ViewCaseStudyQuery } from 'generated/graphql';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'lc-case-study-view',
  templateUrl: './case-study-view.component.html',
  styleUrls: ['./case-study-view.component.scss']
})
export class CaseStudyViewComponent {
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

    sanitizedContent(caseStudy: NonNullable<ViewCaseStudyQuery['caseStudy']>) {
        return this.sanitizer.bypassSecurityTrustHtml(caseStudy.content);
    }
}
