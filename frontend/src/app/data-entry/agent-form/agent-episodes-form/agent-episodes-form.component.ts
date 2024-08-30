import { Component } from '@angular/core';
import { FormService } from '../../shared/form.service';
import { DataEntryAgentEpisodesGQL, DataEntryAgentEpisodesQuery } from 'generated/graphql';
import { map, Observable, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { actionIcons } from '@shared/icons';

@Component({
  selector: 'lc-agent-episodes-form',
  templateUrl: './agent-episodes-form.component.html',
  styleUrls: ['./agent-episodes-form.component.scss']
})
export class AgentEpisodesFormComponent {
    data$: Observable<DataEntryAgentEpisodesQuery>;
    availableEpisodes$: Observable<{ name: string, id: string }[]>;

    actionIcons = actionIcons;

    constructor(
        private formService: FormService,
        private query: DataEntryAgentEpisodesGQL,
    ) {
        this.data$ = this.formService.id$.pipe(
            switchMap(id => this.query.watch({ id }).valueChanges),
            map(result => result.data),
            takeUntilDestroyed(),
        );
        this.availableEpisodes$ = this.data$.pipe(
            map(this.availableEpisodes)
        );
    }

    private availableEpisodes(
        data: DataEntryAgentEpisodesQuery
    ): { name: string, id: string }[] {
        const allEpisodes = data.agentDescription?.source.episodes || [];
        const linkedEpisodeIDs = data.agentDescription?.episodes.map(ep => ep.id) || [];
        return allEpisodes.filter(episode => !linkedEpisodeIDs.includes(episode.id));
    }
}
