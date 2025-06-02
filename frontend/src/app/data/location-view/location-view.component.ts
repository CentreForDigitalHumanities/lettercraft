import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { actionIcons, dataIcons } from '@shared/icons';
import { locationIcon } from '@shared/icons-utils';
import { ViewLocationGQL, ViewLocationQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';
import { entityDescriptionBreadcrumbs } from '../utils/breadcrumbs';
import { ApiService } from '@services/api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lc-location-view',
  templateUrl: './location-view.component.html',
  styleUrls: ['./location-view.component.scss']
})
export class LocationViewComponent implements OnInit {
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

    constructor(
        private destroyRef: DestroyRef,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private query: ViewLocationGQL
    ) { }

    ngOnInit(): void {
        this.data$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
                this.apiService.rerouteIfEmpty({
                    data: data.spaceDescription,
                    targetRoute: ["/data"],
                    message: "Location not found",
                });
            });
    }

    makeBreadcrumbs(data: ViewLocationQuery): Breadcrumb[] {
        if (data.spaceDescription) {
            return entityDescriptionBreadcrumbs(data.spaceDescription);
        } else {
            return [
                { link: '/', label: 'Lettercraft' },
                { link: '/data', label: 'Data' },
                { link: '.', label: 'Not found' },
            ];
        }
    }
}
