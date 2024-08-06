import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { dataIcons } from '@shared/icons';
import { DataEntryGiftGQL, DataEntryGiftQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';

@Component({
    selector: 'lc-gift-form',
    templateUrl: './gift-form.component.html',
    styleUrls: ['./gift-form.component.scss']
})
export class GiftFormComponent {
    id$: Observable<string>;
    data$: Observable<DataEntryGiftQuery>;

    dataIcons = dataIcons;

    constructor(private route: ActivatedRoute, private giftQuery: DataEntryGiftGQL) {
        this.id$ = this.route.params.pipe(
            map(params => params['id']),
        );
        this.data$ = this.id$.pipe(
            switchMap(id => this.giftQuery.watch({ id }).valueChanges),
            map(result => result.data),
        );
    }

    getBreadcrumbs(data: DataEntryGiftQuery): Breadcrumb[] {
        if (data.giftDescription) {
            return [
                { link: '/', label: 'Lettercraft' },
                { link: '/data-entry', label: 'Data entry' },
                {
                    link: `/data-entry/sources/${data.giftDescription.source.id}`,
                    label: data.giftDescription.source.name
                },
                {
                    link: `/data-entry/gifts/${data.giftDescription.id}`,
                    label: data.giftDescription.name
                },
            ];
        } else {
            return [
                { link: '/', label: 'Lettercraft' },
                { link: '/data-entry', label: 'Data entry' },
                { link: '', label: 'Gift not found' }
            ]
        }
    }
}
