import { Component, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { actionIcons, dataIcons } from '@shared/icons';
import { agentIcon, locationIcon } from '@shared/icons-utils';
import { ViewSourceEpisodesPageGQL, ViewSourceGQL } from 'generated/graphql';
import { map, Observable, switchMap, filter } from 'rxjs';
import { sourceBreadcrumbs } from '../utils/breadcrumbs';
import { PageResult } from '../utils/pagination';

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

    episodesCollection$ = this.data$.pipe(
        filter(data => !!data.source),
        map(data => data.source?.episodes || []),
    );

    episodesPageResult = new PageResult(
        this.episodesCollection$, this.episodesPageQuery, this.destroyRef,
    );

    constructor(
        private route: ActivatedRoute,
        private query: ViewSourceGQL,
        private episodesPageQuery: ViewSourceEpisodesPageGQL,
        private destroyRef: DestroyRef,
    ) { }
}
