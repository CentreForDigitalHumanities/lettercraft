import { Component } from '@angular/core';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { dataIcons } from '@shared/icons';
import { DataEntryAgentGQL, DataEntryAgentQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';
import { FormService } from '../shared/form.service';
import { agentIcon } from '@shared/icons-utils';

@Component({
    selector: 'lc-agent-form',
    templateUrl: './agent-form.component.html',
    styleUrls: ['./agent-form.component.scss'],
    providers: [FormService],
})
export class AgentFormComponent {
    id$: Observable<string> = this.formService.id$;
    data$: Observable<DataEntryAgentQuery>;

    dataIcons = dataIcons;
    agentIcon = agentIcon;

    status$ = this.formService.status$;

    constructor(
        private agentQuery: DataEntryAgentGQL,
        private formService: FormService,
    ) {
        this.data$ = this.id$.pipe(
            switchMap(id => this.agentQuery.watch({ id }).valueChanges),
            map(result => result.data),
        );
    }

    sourceLink(data: DataEntryAgentQuery): string[] | undefined {
        if (data.agentDescription?.source) {
            return ['/data-entry', 'sources', data.agentDescription.source.id]
        }
        return undefined;
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
