import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { dataIcons } from '@shared/icons';
import { DataEntryAgentGQL, DataEntryAgentQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'lc-agent-form',
  templateUrl: './agent-form.component.html',
  styleUrls: ['./agent-form.component.scss']
})
export class AgentFormComponent {
    id$: Observable<string>;
    data$: Observable<DataEntryAgentQuery>;

    dataIcons = dataIcons;

    constructor(private route: ActivatedRoute, private agentQuery: DataEntryAgentGQL) {
        this.id$ = this.route.params.pipe(
            map(params => params['id']),
        );
        this.data$ = this.id$.pipe(
            switchMap(id => this.agentQuery.watch({ id }).valueChanges),
            map(result => result.data),
        );
    }

    getBreadcrumbs(data: DataEntryAgentQuery): Breadcrumb[] {
        if (data.agentDescription) {
            return [
                { link: '/', label: 'Lettercraft' },
                { link: '/data-entry', label: 'Data entry' },
                {
                    link: `/data-entry/sources/${data.agentDescription.source.id}`,
                    label: data.agentDescription.source.name
                },
                {
                    link: `/data-entry/agents/${data.agentDescription.id}`,
                    label: data.agentDescription.name
                },
            ];
        } else {
            return [
                { link: '/', label: 'Lettercraft' },
                { link: '/data-entry', label: 'Data entry' },
                { link: '', label: 'Agent not found' }
            ]
        }
    }
}
