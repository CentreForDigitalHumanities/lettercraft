import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { dataIcons } from '@shared/icons';
import { locationIcon } from '@shared/icons-utils';
import { DataEntrySpaceDescriptionGQL, DataEntrySpaceDescriptionQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';

@Component({
    selector: 'lc-location-form',
    templateUrl: './location-form.component.html',
    styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent {
    id$: Observable<string>;
    data$: Observable<DataEntrySpaceDescriptionQuery>;

    dataIcons = dataIcons;
    locationIcon = locationIcon;

    constructor(
        private route: ActivatedRoute, private spaceQuery: DataEntrySpaceDescriptionGQL
    ) {
        this.id$ = this.route.params.pipe(
            map(params => params['id']),
        );
        this.data$ = this.id$.pipe(
            switchMap(id => this.spaceQuery.watch({ id }).valueChanges),
            map(result => result.data),
        );
    }

    getBreadcrumbs(data: DataEntrySpaceDescriptionQuery): Breadcrumb[] {
        if (data.spaceDescription) {
            return [
                { link: '/', label: 'Lettercraft' },
                { link: '/data-entry', label: 'Data entry' },
                {
                    link: `/data-entry/sources/${data.spaceDescription.source.id}`,
                    label: data.spaceDescription.source.name
                },
                {
                    link: `/data-entry/locations/${data.spaceDescription.id}`,
                    label: data.spaceDescription.name
                },
            ];
        } else {
            return [
                { link: '/', label: 'Lettercraft' },
                { link: '/data-entry', label: 'Data entry' },
                { link: '', label: 'Location not found' }
            ]
        }
    }
}
