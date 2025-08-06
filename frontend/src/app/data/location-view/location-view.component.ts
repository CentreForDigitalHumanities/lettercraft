import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { actionIcons, dataIcons } from '@shared/icons';
import { locationIcon } from '@shared/icons-utils';
import { ViewLocationGQL } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';
import { entityDescriptionBreadcrumbs } from '../utils/breadcrumbs';

@Component({
  selector: 'lc-location-view',
  templateUrl: './location-view.component.html',
  styleUrls: ['./location-view.component.scss']
})
export class LocationViewComponent {
    id$: Observable<string> = this.route.params.pipe(
        map(params => params['id']),
    );
    data$ = this.id$.pipe(
        switchMap(id => this.query.watch({ id }).valueChanges),
        map(result => result.data),
    );

    dataIcons = dataIcons;
    actionIcons = actionIcons;
    locationIcon = locationIcon;

    makeBreadcrumbs = entityDescriptionBreadcrumbs;

    constructor(
        private route: ActivatedRoute,
        private query: ViewLocationGQL,
    ) { }
}
