import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewCaseStudyGQL } from 'generated/graphql';
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
    ) {
    }
}
