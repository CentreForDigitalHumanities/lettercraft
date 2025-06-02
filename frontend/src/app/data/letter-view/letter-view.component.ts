import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { actionIcons, dataIcons } from '@shared/icons';
import { ViewLetterGQL, ViewLetterQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';
import { entityDescriptionBreadcrumbs } from '../utils/breadcrumbs';

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
        return data.letterDescription
            ? entityDescriptionBreadcrumbs(data.letterDescription)
            : [
                  { link: "/", label: "Lettercraft" },
                  { link: "/data", label: "Data" },
                  { link: ".", label: "Not found" },
              ];
    }
}
