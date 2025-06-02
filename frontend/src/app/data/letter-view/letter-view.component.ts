import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { actionIcons, dataIcons } from '@shared/icons';
import { ViewLetterGQL, ViewLetterQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';
import { entityDescriptionBreadcrumbs } from '../utils/breadcrumbs';
import { ApiService } from '@services/api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lc-letter-view',
  templateUrl: './letter-view.component.html',
  styleUrls: ['./letter-view.component.scss']
})
export class LetterViewComponent implements OnInit{
    id$: Observable<string> = this.route.params.pipe(
        map(params => params['id']),
    );
    data$ = this.id$.pipe(
        switchMap(id => this.query.watch({ id }).valueChanges),
        map(result => result.data),
    );

    dataIcons = dataIcons;
    actionIcons = actionIcons;

    constructor(
        private destroyRef: DestroyRef,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private query: ViewLetterGQL
    ) {}

    ngOnInit(): void {
        this.data$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
                this.apiService.rerouteIfEmpty({
                    data: data.letterDescription,
                    targetRoute: ["/data"],
                    message: "Letter not found",
                });
            });
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
