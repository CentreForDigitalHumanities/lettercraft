import { Component } from '@angular/core';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { ViewSourcesGQL, ViewSourcesQuery } from 'generated/graphql';
import { map, Observable } from 'rxjs';

@Component({
    selector: 'lc-data-overview',
    templateUrl: './data-overview.component.html',
    styleUrls: ['./data-overview.component.scss'],
})
export class DataOverviewComponent {
    breadcrumbs: Breadcrumb[] = [
        { link: '/', label: 'Lettercraft' },
        { link: '/data', label: 'Browse data' },
    ];

    data$: Observable<ViewSourcesQuery>;

    constructor(
        private query: ViewSourcesGQL
    ) {
        this.data$ = query.watch().valueChanges.pipe(
            map(result => result.data)
        );
    }
}
