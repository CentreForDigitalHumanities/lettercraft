import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { actionIcons, dataIcons } from '@shared/icons';
import { agentIcon, locationIcon } from '@shared/icons-utils';
import { ViewSourceGQL } from 'generated/graphql';
import { map, Observable, switchMap, filter } from 'rxjs';
import { sourceBreadcrumbs } from '../utils/breadcrumbs';
import { transformEpisode } from '../browse/search-item/browse-list-item';
import { TabData } from '../browse-tabs/browse-tabs.component';

@Component({
    selector: 'lc-source-view',
    templateUrl: './source-view.component.html',
    styleUrls: ['./source-view.component.scss'],
    standalone: false
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
    transformEpisode = transformEpisode;

    tabData$: Observable<TabData> = this.data$.pipe(
        map(data => data.source),
        filter(source => !!source),
    );

    constructor(
        private route: ActivatedRoute,
        private query: ViewSourceGQL,
    ) { }
}
