import { Component } from '@angular/core';
import { ViewCaseStudiesGQL } from 'generated/graphql';
import { map } from 'rxjs';

@Component({
  selector: 'lc-case-studies-list',
  templateUrl: './case-studies-list.component.html',
  styleUrls: ['./case-studies-list.component.scss']
})
export class CaseStudiesListComponent {
    data$ = this.query.watch().valueChanges.pipe(
        map(result => result.data),
    );

    constructor(
        private query: ViewCaseStudiesGQL
    ) {

    }
}
