import { Component } from '@angular/core';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { ViewSourcesGQL, ViewSourcesQuery } from 'generated/graphql';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'lc-source-list',
  templateUrl: './source-list.component.html',
  styleUrls: ['./source-list.component.scss']
})
export class SourceListComponent {
    breadcrumbs: Breadcrumb[] = [
        { link: '/', label: 'Lettercraft' },
        { link: '/data', label: 'Data' },
        { link: '.', label: 'Sources' },
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
