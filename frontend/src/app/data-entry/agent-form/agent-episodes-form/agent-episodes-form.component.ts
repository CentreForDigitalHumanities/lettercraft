import { Component, OnDestroy } from '@angular/core';
import { FormService } from '../../shared/form.service';
import {
    CreateEpisodeAgentInput, DataEntryAgentEpisodesGQL, DataEntryAgentEpisodesQuery,
    DataEntryCreateAgentEpisodeMutationGQL,
} from 'generated/graphql';
import { map, Observable, Subject, switchMap, tap, withLatestFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { actionIcons } from '@shared/icons';
import { FormStatus } from '../../shared/types';

@Component({
  selector: 'lc-agent-episodes-form',
  templateUrl: './agent-episodes-form.component.html',
  styleUrls: ['./agent-episodes-form.component.scss']
})
export class AgentEpisodesFormComponent implements OnDestroy {
    data$: Observable<DataEntryAgentEpisodesQuery>;
    availableEpisodes$: Observable<{ name: string, id: string }[]>;

    addEpisode$ = new Subject<string>();
    actionIcons = actionIcons;
    status$ = new Subject<FormStatus>();
    formName = 'episodes';

    constructor(
        private formService: FormService,
        private query: DataEntryAgentEpisodesGQL,
        private addMutation: DataEntryCreateAgentEpisodeMutationGQL,
    ) {
        this.formService.attachForm(this.formName, this.status$);
        this.status$.next('idle');
        this.data$ = this.formService.id$.pipe(
            switchMap(id => this.query.watch({ id }).valueChanges),
            map(result => result.data),
            takeUntilDestroyed(),
        );
        this.availableEpisodes$ = this.data$.pipe(
            map(this.availableEpisodes)
        );
        this.addEpisode$.pipe(
            withLatestFrom(this.formService.id$),
            takeUntilDestroyed(),
        ).subscribe(([episodeID, agentID]) =>
            this.addEpisode(episodeID, agentID)
        );
    }

    ngOnDestroy(): void {
        this.status$.complete();
        this.addEpisode$.complete();
        this.formService.detachForm(this.formName);
    }

    addEpisode(episodeID: string, agentID: string): void {
        const data: CreateEpisodeAgentInput = {
            agent: agentID,
            episode: episodeID,
        };
        this.addMutation.mutate({ data }, {
            refetchQueries: ['DataEntryAgentEpisodes'],
        }).pipe(
            tap(() => this.status$.next('loading'))
        ).subscribe({
            next: () => this.status$.next('saved'),
            error: (err) => {
                console.error(err);
                this.status$.next('error');
            }
        });
    }

    private availableEpisodes(
        data: DataEntryAgentEpisodesQuery
    ): { name: string, id: string }[] {
        const allEpisodes = data.agentDescription?.source.episodes || [];
        const linkedEpisodeIDs = data.agentDescription?.episodes.map(ep => ep.episode.id) || [];
        return allEpisodes.filter(episode => !linkedEpisodeIDs.includes(episode.id));
    }
}
