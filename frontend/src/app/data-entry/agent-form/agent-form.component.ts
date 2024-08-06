import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
}
