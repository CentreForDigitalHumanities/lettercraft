import { Component, input } from '@angular/core';
import { ViewCaseStudiesQuery } from 'generated/graphql';

type CaseStudy = ViewCaseStudiesQuery['caseStudies'][number];

@Component({
    selector: 'lc-case-studies-list',
    templateUrl: './case-studies-list.component.html',
    styleUrls: ['./case-studies-list.component.scss'],
    standalone: false
})
export class CaseStudiesListComponent {
    data = input.required<CaseStudy[]>()

    authorNames(item: CaseStudy): string {
        const names = item.authors.map(author => author.fullName);
        const formatter = new Intl.ListFormat('en', {style: 'long', type: 'conjunction'});
        return formatter.format(names);
    }
}
