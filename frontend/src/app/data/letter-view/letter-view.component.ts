import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { actionIcons, dataIcons } from '@shared/icons';
import { ViewLetterGQL, ViewLetterQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'lc-letter-view',
  templateUrl: './letter-view.component.html',
  styleUrls: ['./letter-view.component.scss']
})
export class LetterViewComponent {
    id$: Observable<string> = this.route.params.pipe(
        map(params => params['id']),
    );
    data$: Observable<ViewLetterQuery>;

    dataIcons = dataIcons;
    actionIcons = actionIcons;

    constructor(
        private route: ActivatedRoute,
        private query: ViewLetterGQL,
    ) {
        this.data$ = this.id$.pipe(
            switchMap(id => this.query.watch({ id }).valueChanges),
            map(result => result.data),
        );
    }

    makeBreadcrumbs(data: ViewLetterQuery): Breadcrumb[] {
        if (data.letterDescription) {
            return [
                { label: 'Lettercraft', link: '/', },
                { label: 'Data', link: '/data', },
                {
                    label: data.letterDescription.source.name,
                    link: `/data/sources/${data.letterDescription.source.id}`,
                },
                {
                    label: `${data.letterDescription.name}`,
                    link: `/data/agents/${data.letterDescription.id}`,
                }
            ]
        } else {
            return [];
        }
    }
}
