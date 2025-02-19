import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { dataIcons } from '@shared/icons';
import { agentIcon, locationIcon } from '@shared/icons-utils';
import { ViewSourceGQL, ViewSourceQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'lc-source-view',
  templateUrl: './source-view.component.html',
  styleUrls: ['./source-view.component.scss']
})
export class SourceViewComponent {
    id$: Observable<string> = this.route.params.pipe(
        map(params => params['id']),
    );
    data$: Observable<ViewSourceQuery>

    dataIcons = dataIcons;
    agentIcon = agentIcon;
    locationIcon = locationIcon;

    constructor(
        private route: ActivatedRoute,
        private query: ViewSourceGQL,
    ) {
        this.data$ = this.id$.pipe(
            switchMap(id => this.query.watch({ id }).valueChanges),
            map(result => result.data),
        );
    }

    makeBreadcrumbs(data: ViewSourceQuery): Breadcrumb[] {
        return [
            { link: '/', label: 'Lettercraft' },
            { link: '/data', label: 'Data' },
            { link: '/data/sources', label: 'Sources' },
            { link: '.', label: data.source.name },
        ]
    }
}
