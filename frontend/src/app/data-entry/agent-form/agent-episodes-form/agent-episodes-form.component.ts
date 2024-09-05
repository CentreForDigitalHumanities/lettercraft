import { Component, OnDestroy } from '@angular/core';
import { FormService } from '../../shared/form.service';
import {
    CreateEpisodeAgentInput, DataEntryAgentEpisodesGQL, DataEntryAgentEpisodesQuery,
    DataEntryCreateAgentEpisodeMutationGQL,
    DataEntryDeleteAgentEpisodeMutationGQL,
    DataEntryDeleteAgentEpisodeMutationMutationVariables,
    Entity,
} from 'generated/graphql';
import { BehaviorSubject, map, Observable, Observer, Subject, switchMap, tap, withLatestFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { actionIcons } from '@shared/icons';
import { FormStatus } from '../../shared/types';
import { MutationResult } from 'apollo-angular';
import { differencyBy } from '../../shared/utils';

const REFETCH_QUERIES = ['DataEntryAgentEpisodes'];

@Component({
  selector: 'lc-agent-episodes-form',
  templateUrl: './agent-episodes-form.component.html',
  styleUrls: ['./agent-episodes-form.component.scss']
})
export class AgentEpisodesFormComponent implements OnDestroy {
    data$: Observable<DataEntryAgentEpisodesQuery>;
    availableEpisodes$: Observable<{ name: string, id: string }[]>;

    addEpisode$ = new Subject<string>();
    removeEpisode$ = new Subject<string>();
    actionIcons = actionIcons;
    status$ = new BehaviorSubject<FormStatus>('idle');
    formName = 'episodes';
    entityType = Entity.Agent;

    private mutationObserver: Partial<Observer<MutationResult>> = {
        next: this.onSuccess.bind(this),
        error: this.onError.bind(this),
    };

    constructor(
        private formService: FormService,
        private query: DataEntryAgentEpisodesGQL,
        private addMutation: DataEntryCreateAgentEpisodeMutationGQL,
        private removeMutation: DataEntryDeleteAgentEpisodeMutationGQL,
    ) {
        this.formService.attachForm(this.formName, this.status$);
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

        this.removeEpisode$.pipe(
            withLatestFrom(this.formService.id$),
            takeUntilDestroyed(),
        ).subscribe(([episodeID, agentID]) =>
            this.removeEpisode(episodeID, agentID)
        );
    }

    ngOnDestroy(): void {
        this.status$.complete();
        this.addEpisode$.complete();
        this.removeEpisode$.complete();
        this.formService.detachForm(this.formName);
    }

    addEpisode(episodeID: string, agentID: string): void {
        const data: CreateEpisodeAgentInput = {
            agent: agentID,
            episode: episodeID,
        };
        this.addMutation.mutate({ data }, {
            refetchQueries: REFETCH_QUERIES,
        }).pipe(
            tap(() => this.status$.next('loading'))
        ).subscribe(this.mutationObserver);
    }

    removeEpisode(episodeID: string, agentID: string): void {
        const data: DataEntryDeleteAgentEpisodeMutationMutationVariables = {
            agent: agentID,
            episode: episodeID,
        };
        this.removeMutation.mutate(data, { refetchQueries: REFETCH_QUERIES }).pipe(
            tap(() => this.status$.next('loading'))
        ).subscribe(this.mutationObserver)
    }

    onSuccess() {
        this.status$.next('saved');
    }

    onError(error: any) {
        console.error(error);
        this.status$.next('error');
    }

    private availableEpisodes(
        data: DataEntryAgentEpisodesQuery
    ): { name: string, id: string }[] {
        const allEpisodes = data.agentDescription?.source.episodes || [];
        const linkedEpisodes = data.agentDescription?.episodes || [];
        return differencyBy(allEpisodes, linkedEpisodes, 'id');
    }
}
