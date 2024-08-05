import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { dataIcons } from '@shared/icons';
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

}
