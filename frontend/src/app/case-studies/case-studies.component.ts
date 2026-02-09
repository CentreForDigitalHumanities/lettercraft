import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewCaseStudiesGQL } from 'generated/graphql';
import { map } from 'rxjs';

@Component({
    selector: 'lc-case-studies',
    standalone: false,
    templateUrl: './case-studies.component.html',
    styleUrl: './case-studies.component.scss'
})
export class CaseStudiesComponent {
    data$ = this.listQuery.watch().valueChanges.pipe(
        map(result => result.data),
    );

    private routeID$ = this.route.params.pipe(map(params => params['id']));

    constructor(
        private route: ActivatedRoute,
        private listQuery: ViewCaseStudiesGQL,
    ) {}

}
