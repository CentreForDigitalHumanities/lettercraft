import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { actionIcons } from '@shared/icons';
import { locationIcon } from '@shared/icons-utils';
import { ViewLocationGQL, ViewLocationQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'lc-location-view',
  templateUrl: './location-view.component.html',
  styleUrls: ['./location-view.component.scss']
})
export class LocationViewComponent {
    id$: Observable<string> = this.route.params.pipe(
        map(params => params['id']),
    );
    data$: Observable<ViewLocationQuery>;

    actionIcons = actionIcons;
    locationIcon = locationIcon;

    constructor(
        private route: ActivatedRoute,
        private query: ViewLocationGQL,
    ) {
        this.data$ = this.id$.pipe(
            switchMap(id => this.query.watch({ id }).valueChanges),
            map(result => result.data),
        );
    }

    makeBreadcrumbs(data: ViewLocationQuery): Breadcrumb[] {
        if (data.spaceDescription) {
            return [
                { link: '/', label: 'Lettercraft' },
                { link: '/data', label: 'Data' },
                { link: `/data/sources/${data.spaceDescription.source.id}`, label: data.spaceDescription.source.name },
                { link: '.', label: data.spaceDescription.name }
            ];
        } else {
            return [
                { link: '/', label: 'Lettercraft' },
                { link: '/data', label: 'Data' },
                { link: '.', label: 'Not found' },
            ];
        }
    }
}
