import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { ViewContributorGQL, ViewContributorQuery } from 'generated/graphql';
import { map, switchMap } from 'rxjs';

@Component({
    selector: 'lc-contributor',
    templateUrl: './contributor.component.html',
    styleUrls: ['./contributor.component.scss']
})
export class ContributorComponent {
    data$ = this.route.params.pipe(
        map(params => params['id']),
        switchMap(id => this.query.watch({id}).valueChanges),
        map(result => result.data),
    );

    constructor(
        private query: ViewContributorGQL,
        private route: ActivatedRoute,
    ) {}

    breadcrumbs(user: NonNullable<ViewContributorQuery['userDescription']>): Breadcrumb[] {
        return [
            { link: '/', label: 'Lettercraft' },
            { link: '/contributors', label: 'Contributors', },
            { link: '.', label: user.fullName },
        ];
    }
}
