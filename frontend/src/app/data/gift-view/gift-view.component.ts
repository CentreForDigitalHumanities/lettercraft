import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { actionIcons, dataIcons } from '@shared/icons';
import { ViewGiftGQL, ViewGiftQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'lc-gift-view',
  templateUrl: './gift-view.component.html',
  styleUrls: ['./gift-view.component.scss']
})
export class GiftViewComponent {
    id$: Observable<string> = this.route.params.pipe(
        map(params => params['id']),
    );
    data$: Observable<ViewGiftQuery>;

    dataIcons = dataIcons;
    actionIcons = actionIcons;

    constructor(
        private route: ActivatedRoute,
        private query: ViewGiftGQL,
    ) {
        this.data$ = this.id$.pipe(
            switchMap(id => this.query.watch({ id }).valueChanges),
            map(result => result.data),
        );
    }

    makeBreadcrumbs(data: ViewGiftQuery): Breadcrumb[] {
        if (data.giftDescription) {
            return [
                { label: 'Lettercraft', link: '/', },
                { label: 'Data', link: '/data', },
                {
                    label: data.giftDescription.source.name,
                    link: `/data/sources/${data.giftDescription.source.id}`,
                },
                {
                    label: `${data.giftDescription.name}`,
                    link: `/data/agents/${data.giftDescription.id}`,
                }
            ]
        } else {
            return [];
        }
    }
}
