import { Component } from '@angular/core';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { ViewContributorsGQL } from 'generated/graphql';
import { map } from 'rxjs';

@Component({
  selector: 'lc-contributors-list',
  templateUrl: './contributors-list.component.html',
  styleUrls: ['./contributors-list.component.scss']
})
export class ContributorsListComponent {
    breadcrumbs: Breadcrumb[] = [
        { link: '/', label: 'Lettercraft' },
        { link: '.', label: 'Contributors' },
    ];

    data$ = this.query.fetch().pipe(
        map(result => result.data.contributorRoles),
    );

    constructor(
        private query: ViewContributorsGQL,
    ) {}
}
