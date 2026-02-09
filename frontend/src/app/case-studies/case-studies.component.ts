import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { ViewCaseStudiesGQL, ViewCaseStudiesQuery, ViewCaseStudyGQL, ViewCaseStudyQuery } from 'generated/graphql';
import { combineLatest, map, of, shareReplay, startWith, switchMap } from 'rxjs';

@Component({
    selector: 'lc-case-studies',
    standalone: false,
    templateUrl: './case-studies.component.html',
    styleUrl: './case-studies.component.scss'
})
export class CaseStudiesComponent {
    listData$ = this.listQuery.watch().valueChanges.pipe(
        map(result => result.data),
        shareReplay(1),
    );

    private routeID$ = this.route.params.pipe(map(params => params['id']));

    activeID$ = combineLatest([this.routeID$, this.listData$]).pipe(
        map(([routeID, data]) => this.resolveID(routeID, data)),
    );

    viewData$ = this.activeID$.pipe(
        switchMap(id => {
            if (id) {
                return this.viewQuery.watch({id}).valueChanges.pipe(
                    map(result => result.data?.caseStudy),
                );
            }
            return of(undefined);
        }),
        shareReplay(1),
    );

    breadcrumbs$ = this.viewData$.pipe(
        startWith(undefined),
        map(this.makeBreadcrumbs.bind(this)),
    );

    constructor(
        private route: ActivatedRoute,
        private listQuery: ViewCaseStudiesGQL,
        private viewQuery: ViewCaseStudyGQL,
    ) {}

    private resolveID(routeID: string, data: ViewCaseStudiesQuery): string | undefined {
        if (routeID) {
            return routeID;
        } else {
            return data.caseStudies.at(0)?.id
        }
    }

    private makeBreadcrumbs(
        caseStudy: ViewCaseStudyQuery['caseStudy'] | undefined
    ): Breadcrumb[] {
        return [
            { label: 'Lettercraft', link: '/' },
            { label: 'Case studies', link: '/case-studies' },
            { label: caseStudy?.name || '...', link: '.' },
        ];
    }
}
