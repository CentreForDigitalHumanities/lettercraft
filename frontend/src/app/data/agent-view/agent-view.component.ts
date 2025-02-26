import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { actionIcons, dataIcons } from '@shared/icons';
import { agentIcon } from '@shared/icons-utils';
import { Certainty, SourceMention, ViewAgentGQL, ViewAgentQuery } from 'generated/graphql';
import { Observable, map, switchMap } from 'rxjs';

@Component({
  selector: 'lc-agent-view',
  templateUrl: './agent-view.component.html',
  styleUrls: ['./agent-view.component.scss']
})
export class AgentViewComponent {
    id$: Observable<string> = this.route.params.pipe(
        map(params => params['id']),
    );
    data$: Observable<ViewAgentQuery>;

    agentIcon = agentIcon;
    dataIcons = dataIcons;
    actionIcons = actionIcons;

    Certainty = Certainty;
    SourceMention = SourceMention;

    constructor(
        private route: ActivatedRoute,
        private query: ViewAgentGQL,
    ) {
        this.data$ = this.id$.pipe(
            switchMap(id => this.query.watch({ id }).valueChanges),
            map(result => result.data),
        );
    }

    makeBreadcrumbs(data: ViewAgentQuery): Breadcrumb[] {
        if (data.agentDescription) {
            return [
                {
                    label: 'Lettercraft',
                    link: '/',
                },
                {
                    label: 'Data',
                    link: '/data',
                },
                {
                    label: data.agentDescription.source.name,
                    link: `/data/sources/${data.agentDescription.source.id}`,
                },
                {
                    label: `${data.agentDescription.name} (${data.agentDescription.source.name})`,
                    link: `/data/agents/${data.agentDescription.id}`,
                }
            ]
        } else {
            return [];
        }
    }
}
