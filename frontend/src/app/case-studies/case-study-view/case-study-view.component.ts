import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { dataIcons } from '@shared/icons';
import { ViewCaseStudyQuery } from 'generated/graphql';

type CaseStudy = NonNullable<ViewCaseStudyQuery['caseStudy']>;

@Component({
    selector: 'lc-case-study-view',
    templateUrl: './case-study-view.component.html',
    styleUrls: ['./case-study-view.component.scss'],
    standalone: false
})
export class CaseStudyViewComponent implements OnChanges {
    dataIcons = dataIcons;

    data = input.required<ViewCaseStudyQuery['caseStudy']>();

    constructor(
        private sanitizer: DomSanitizer,
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data'] && changes['data'].previousValue &&
            changes['data'].currentValue.id !== changes['data'].previousValue.id
        ) {
            this.focusOnTitle();
        }
    }

    sanitizedContent(caseStudy: CaseStudy) {
        return this.sanitizer.bypassSecurityTrustHtml(caseStudy.content);
    }

    private focusOnTitle() {
        setTimeout(() => {
            document.getElementById('case-study-title')?.focus();
        });
    }
}
