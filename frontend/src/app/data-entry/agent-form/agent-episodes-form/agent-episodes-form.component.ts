import { Component } from '@angular/core';
import { FormService } from '../../shared/form.service';
import { DataEntryAgentEpisodesGQL, DataEntryAgentEpisodesQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lc-agent-episodes-form',
  templateUrl: './agent-episodes-form.component.html',
  styleUrls: ['./agent-episodes-form.component.scss']
})
export class AgentEpisodesFormComponent {
    data$: Observable<DataEntryAgentEpisodesQuery>;

    constructor(
        private formService: FormService,
        private query: DataEntryAgentEpisodesGQL,
    ) {
        this.data$ = this.formService.id$.pipe(
            switchMap(id => this.query.watch({ id }).valueChanges),
            map(result => result.data),
            takeUntilDestroyed(),
        );
    }
}
