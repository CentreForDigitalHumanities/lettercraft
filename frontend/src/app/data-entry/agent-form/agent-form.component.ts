import { Component, DestroyRef, OnInit } from '@angular/core';
import { Breadcrumb } from '@shared/breadcrumb/breadcrumb.component';
import { actionIcons, dataIcons } from '@shared/icons';
import { DataEntryAgentGQL, DataEntryAgentQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';
import { FormService } from '../shared/form.service';
import { agentIcon } from '@shared/icons-utils';
import { ApiService } from '@services/api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'lc-agent-form',
    templateUrl: './agent-form.component.html',
    styleUrls: ['./agent-form.component.scss'],
    providers: [FormService],
})
export class AgentFormComponent implements OnInit {
    id$: Observable<string> = this.formService.id$;
    data$: Observable<DataEntryAgentQuery>;

    dataIcons = dataIcons;
    actionIcons = actionIcons;
    agentIcon = agentIcon;

    status$ = this.formService.status$;

    constructor(
        private destroyRef: DestroyRef,
        private apiService: ApiService,
        private agentQuery: DataEntryAgentGQL,
        private formService: FormService,
    ) {
        this.data$ = this.id$.pipe(
            switchMap(id => this.agentQuery.watch({ id }).valueChanges),
            map(result => result.data),
        );
    }

    ngOnInit(): void {
        this.data$.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(data => {
            this.apiService.rerouteIfEmpty({
                data: data.agentDescription,
                targetRoute: ["/data-entry"],
                message: "Agent not found",
            });
        });
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
