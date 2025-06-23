import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { actionIcons, dataIcons } from '@shared/icons';
import { ViewLetterGQL } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';
import { entityDescriptionBreadcrumbs, NOT_FOUND_BREADCRUMBS } from '../utils/breadcrumbs';

@Component({
  selector: 'lc-letter-view',
  templateUrl: './letter-view.component.html',
  styleUrls: ['./letter-view.component.scss']
})
export class LetterViewComponent {
    id$: Observable<string> = this.route.params.pipe(
        map(params => params['id']),
    );
    data$ = this.id$.pipe(
        switchMap(id => this.query.watch({ id }).valueChanges),
        map(result => result.data),
    );

    dataIcons = dataIcons;
    actionIcons = actionIcons;

    makeBreadcrumbs = entityDescriptionBreadcrumbs;
    notFoundBreadcrumbs = NOT_FOUND_BREADCRUMBS;

    constructor(
        private route: ActivatedRoute,
        private query: ViewLetterGQL,
    ) {}
}
