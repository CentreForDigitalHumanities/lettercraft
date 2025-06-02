import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { actionIcons, dataIcons } from '@shared/icons';
import { agentIcon } from '@shared/icons-utils';
import {
    Certainty,
    Gender,
    SourceMention,
    ViewAgentGQL,
    ViewAgentQuery,
} from 'generated/graphql';
import { Observable, map, switchMap } from 'rxjs';
import { entityDescriptionBreadcrumbs } from '../utils/breadcrumbs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'lc-agent-view',
  templateUrl: './agent-view.component.html',
  styleUrls: ['./agent-view.component.scss']
})
export class AgentViewComponent implements OnInit {
    id$: Observable<string> = this.route.params.pipe(
        map(params => params['id']),
    );
    data$ = this.id$.pipe(
        switchMap((id) => this.query.watch({ id }).valueChanges),
        map((result) => result.data)
    );

    agentIcon = agentIcon;
    dataIcons = dataIcons;
    actionIcons = actionIcons;

    Certainty = Certainty;
    SourceMention = SourceMention;
    Gender = Gender;

    constructor(
        private destroyRef: DestroyRef,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private query: ViewAgentGQL
    ) {}

    ngOnInit(): void {
        this.data$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
                this.apiService.rerouteIfEmpty({
                    data: data.agentDescription,
                    targetRoute: ["/data"],
                    message: "Agent not found",
                });
            });
    }

    makeBreadcrumbs(data: ViewAgentQuery): Breadcrumb[] {
        return data.agentDescription
            ? entityDescriptionBreadcrumbs(data.agentDescription)
            : [
                  { link: "/", label: "Lettercraft" },
                  { link: "/data", label: "Data" },
                  { link: ".", label: "Not found" },
              ];
    }
}
