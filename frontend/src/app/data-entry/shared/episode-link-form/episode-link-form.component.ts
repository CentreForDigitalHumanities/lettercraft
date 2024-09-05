import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { EntityType, SelectOptions } from '../types';
import { debounceTime, distinctUntilChanged, map, Observable, shareReplay, skip, Subject, switchMap, tap, withLatestFrom } from 'rxjs';
import { actionIcons } from '@shared/icons';
import {
    DataEntryUpdateEpisodeAgentGQL, DataEntryUpdateEpisodeAgentMutationVariables,
    SourceMention,
    DataEntryUpdateEpisodeMutation,
    DataEntryEpisodeEntityLinkGQL,
    Entity,
    DataEntryEpisodeEntityLinkQuery
} from 'generated/graphql';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { formStatusSubject, sourceMentionSelectOptions } from '../utils';
import _ from 'underscore';
import { MutationResult } from 'apollo-angular';
import { FormService } from '../form.service';


type LinkTo = 'episode' | 'entity';

@Component({
    selector: 'lc-episode-link-form',
    templateUrl: './episode-link-form.component.html',
    styleUrls: ['./episode-link-form.component.scss']
})
export class EpisodeLinkFormComponent implements OnChanges, OnDestroy {
    /** ID of the connection object (e.g. EpisodeAgent) */
    @Input({ required: true }) entityID!: string;
    @Input({ required: true }) episodeID!: string;

    /** Type of entity (agent, letter, etc.) */
    @Input({ required: true }) entityType!: Entity;

    /** Describes the direction of the link in the document.
     *
     * The header will show the model that is being linked *to*; the model being linked
     * *from* should be clear from the context.
     */
    @Input() linkTo: LinkTo = 'episode';


    data$: Observable<DataEntryEpisodeEntityLinkQuery | undefined>;
    form = new FormGroup({
        sourceMention: new FormControl<SourceMention>(SourceMention.Direct),
        note: new FormControl<string>('', { nonNullable: true }),
    });

    sourceMentionOptions: SelectOptions<SourceMention> = sourceMentionSelectOptions();

    private link$ = new Subject<{ entity: string, episode: string, entityType: Entity }>();
    private status$ = formStatusSubject();
    private formName = 'episode-link-' + crypto.randomUUID();

    actionIcons = actionIcons;

    constructor(
        query: DataEntryEpisodeEntityLinkGQL,
        private agentMutation: DataEntryUpdateEpisodeAgentGQL,
        private formService: FormService,
    ) {
        this.formService.attachForm(this.formName, this.status$);

        this.data$ = this.link$.pipe(
            switchMap((link) => query.watch(link).valueChanges),
            map(result => result.data),
            shareReplay(1),
            takeUntilDestroyed(),
        );
        this.data$.subscribe(this.updateFormValues.bind(this));

        this.form.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(_.isEqual),
            skip(1),
            tap(() => this.status$.next('loading')),
            withLatestFrom(this.link$),
            map(this.toMutationInput),
            switchMap(this.makeMutation.bind(this)),
            takeUntilDestroyed(),
        ).subscribe(this.onMutationResult.bind(this));
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['entityID'] || changes['episodeID'] || changes['entityType']) {
            this.link$.next({
                entity: this.entityID,
                episode: this.episodeID,
                entityType: this.entityType,
            });
        }
    }

    ngOnDestroy(): void {
        this.link$.complete();
        this.status$.complete();
        this.formService.detachForm(this.formName);
    }

    formUrl(linkTo: LinkTo, entityType: Entity): string {
        if (linkTo == 'episode') {
            return 'episodes';
        }
        return 'agents';
    }

    linkedObject(linkTo: LinkTo, data: DataEntryEpisodeEntityLinkQuery) {
        if (linkTo === 'episode') {
            return data.episodeEntityLink?.episode;
        } else {
            return data.episodeEntityLink?.entity;
        }
    }

    private updateFormValues(data?: DataEntryEpisodeEntityLinkQuery): void {
        this.form.setValue({
            sourceMention: data?.episodeEntityLink?.sourceMention || SourceMention.Direct,
            note: data?.episodeEntityLink?.note || '',
        });
    }

    private toMutationInput(
        [values, link]: [typeof this.form.value, { entity: string, episode: string }]
    ): DataEntryUpdateEpisodeAgentMutationVariables {
        return { input: { agent: link.entity, episode: link.episode, ...values } };
    }

    private makeMutation(mutationInput: DataEntryUpdateEpisodeAgentMutationVariables) {
        return this.agentMutation.mutate(mutationInput, {
            errorPolicy: 'all',
            refetchQueries: [
                'DataEntryEpisodeEntity',
            ],
        })
    }

    private onMutationResult(result: MutationResult<DataEntryUpdateEpisodeMutation>) {
        if (result.errors) {
            console.error(result.errors);
            this.status$.next('error');
        } else if (result.data?.updateEpisode?.errors) {
            console.error(result.data.updateEpisode.errors);
            this.status$.next('error');
        } else {
            this.status$.next('saved');
        }
    }
}
