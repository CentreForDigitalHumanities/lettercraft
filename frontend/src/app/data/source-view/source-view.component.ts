import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { actionIcons, dataIcons } from '@shared/icons';
import { agentIcon, locationIcon } from '@shared/icons-utils';
import { ViewSourceGQL } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';
import { NOT_FOUND_BREADCRUMBS, sourceBreadcrumbs } from '../utils/breadcrumbs';

@Component({
  selector: 'lc-source-view',
  templateUrl: './source-view.component.html',
  styleUrls: ['./source-view.component.scss']
})
export class SourceViewComponent {
    id$: Observable<string> = this.route.params.pipe(
        map(params => params['id']),
    );
    data$ = this.id$.pipe(
        switchMap((id) => this.query.watch({ id }).valueChanges),
        map((result) => result.data)
    );

    dataIcons = dataIcons;
    actionIcons = actionIcons;
    agentIcon = agentIcon;
    locationIcon = locationIcon;

    makeBreadcrumbs = sourceBreadcrumbs;
    notFoundBreadcrumbs = NOT_FOUND_BREADCRUMBS;

    constructor(
        private route: ActivatedRoute,
        private query: ViewSourceGQL
    ) { }
}
