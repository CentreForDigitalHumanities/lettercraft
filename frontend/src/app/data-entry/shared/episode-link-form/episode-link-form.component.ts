import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { EntityType, SelectOptions } from '../types';
import { combineLatest, debounceTime, distinctUntilChanged, map, Observable, shareReplay, skip, Subject, switchMap, withLatestFrom } from 'rxjs';
import { actionIcons } from '@shared/icons';
import {
    DataEntryUpdateEpisodeAgentGQL, DataEntryUpdateEpisodeAgentMutationVariables,
    DataEntryEpisodeAgentGQL, DataEntryEpisodeAgentQuery, SourceMention,
    DataEntryUpdateEpisodeMutation
} from 'generated/graphql';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { sourceMentionSelectOptions } from '../utils';
import _ from 'underscore';
import { MutationResult } from 'apollo-angular';


type LinkTo = 'episode' | 'agent';

@Component({
    selector: 'lc-episode-link-form',
    templateUrl: './episode-link-form.component.html',
    styleUrls: ['./episode-link-form.component.scss']
})
export class EpisodeLinkFormComponent implements OnChanges, OnDestroy {
    /** ID of the connection object (e.g. EpisodeAgent) */
    @Input({ required: true }) id!: string;

    /** Type of entity (agent, letter, etc.) */
    @Input({ required: true }) entityType!: EntityType;

    /** Describes the direction of the link in the document.
     *
     * The header will show the model that is being linked *to*; the model being linked
     * *from* should be clear from the context.
     */
    @Input() linkTo: LinkTo = 'episode';


    data$: Observable<DataEntryEpisodeAgentQuery | undefined>;
    form = new FormGroup({
        sourceMention: new FormControl<SourceMention>(SourceMention.Direct),
        note: new FormControl<string>('', { nonNullable: true }),
    });

    sourceMentionOptions: SelectOptions<SourceMention> = sourceMentionSelectOptions();

    private entityQueries: Record<EntityType, DataEntryEpisodeAgentGQL>;
    private query$ = new Subject<DataEntryEpisodeAgentGQL>();
    private id$ = new Subject<string>;

    actionIcons = actionIcons;

    constructor(
        private agentQuery: DataEntryEpisodeAgentGQL,
        private agentMutation: DataEntryUpdateEpisodeAgentGQL,
    ) {
        this.entityQueries = {
            agent: agentQuery,
        };
        this.data$ = combineLatest([this.query$, this.id$]).pipe(
            switchMap(([query, id]) => query.watch({ id }).valueChanges),
            map(result => result.data),
            shareReplay(1),
            takeUntilDestroyed(),
        );
        this.data$.subscribe(this.updateFormValues.bind(this));
        this.form.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(_.isEqual),
            skip(1),
            // tap(() => this.status$.next('loading')),
            withLatestFrom(this.id$),
            map(this.toMutationInput),
            switchMap(this.makeMutation.bind(this)),
            takeUntilDestroyed(),
        ).subscribe(this.onMutationResult);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['entityType']) {
            this.query$.next(this.entityQueries[this.entityType]);
        }
        if (changes['id']) {
            this.id$.next(this.id);
        }
    }

    ngOnDestroy(): void {
        this.query$.complete();
        this.id$.complete();
    }

    formUrl(linkTo: LinkTo, entityType: EntityType): string {
        if (linkTo == 'episode') {
            return 'episodes';
        }
        return 'agents';
    }

    linkedObject(linkTo: LinkTo, data: DataEntryEpisodeAgentQuery) {
        if (linkTo === 'episode') {
            return data.episodeAgentLink?.episode;
        } else {
            return data.episodeAgentLink?.agent;
        }
    }

    private updateFormValues(data?: DataEntryEpisodeAgentQuery): void {
        this.form.setValue({
            sourceMention: data?.episodeAgentLink?.sourceMention || SourceMention.Direct,
            note: data?.episodeAgentLink?.note || '',
        });
    }

    private toMutationInput([values, id]: [typeof this.form.value, string]): DataEntryUpdateEpisodeAgentMutationVariables {
        return { input: { id, ...values } };
    }

    private makeMutation(mutationInput: DataEntryUpdateEpisodeAgentMutationVariables) {
        return this.agentMutation.mutate(mutationInput, {
            errorPolicy: 'all',
            refetchQueries: [
                'DataEntryEpisodeAgent',
            ],
        })
    }

    private onMutationResult(result: MutationResult<DataEntryUpdateEpisodeMutation>) {
        if (result.errors) {
            console.error(result.errors);
        } else if (result.data?.updateEpisode?.errors) {
            console.error(result.data.updateEpisode.errors);
        }
    }
}
