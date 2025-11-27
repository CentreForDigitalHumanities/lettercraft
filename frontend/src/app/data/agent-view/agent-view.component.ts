import { Component } from '@angular/core';
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

@Component({
    selector: 'lc-agent-view',
    templateUrl: './agent-view.component.html',
    styleUrls: ['./agent-view.component.scss'],
    standalone: false
})
export class AgentViewComponent {
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
        private route: ActivatedRoute,
        private query: ViewAgentGQL
    ) {}

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
