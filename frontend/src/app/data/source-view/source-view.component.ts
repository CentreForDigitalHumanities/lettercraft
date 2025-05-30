import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { actionIcons, dataIcons } from '@shared/icons';
import { agentIcon, locationIcon } from '@shared/icons-utils';
import { ViewSourceGQL } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';
import { sourceBreadcrumbs } from '../utils/breadcrumbs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'lc-source-view',
  templateUrl: './source-view.component.html',
  styleUrls: ['./source-view.component.scss']
})
export class SourceViewComponent implements OnInit {
    id$: Observable<string> = this.route.params.pipe(
        map(params => params['id']),
    );
    source$ = this.id$.pipe(
        switchMap((id) => this.query.watch({ id }).valueChanges),
        map((result) => result.data.source ?? null)
    );

    dataIcons = dataIcons;
    actionIcons = actionIcons;
    agentIcon = agentIcon;
    locationIcon = locationIcon;

    makeBreadcrumbs = sourceBreadcrumbs;

    constructor(
        private destroyRef: DestroyRef,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private query: ViewSourceGQL
    ) { }

    ngOnInit(): void {
        this.source$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((source) => {
                this.apiService.rerouteIfEmpty({
                    data: source,
                    targetRoute: ["/", "data", "sources"],
                    message: "Source not found.",
                });
            });
    }
}
