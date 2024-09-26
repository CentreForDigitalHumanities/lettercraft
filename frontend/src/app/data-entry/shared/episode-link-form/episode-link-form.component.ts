import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { SelectOptions } from '../types';
import { debounceTime, distinctUntilChanged, map, Observable, shareReplay, skip, Subject, switchMap, tap, withLatestFrom } from 'rxjs';
import { actionIcons } from '@shared/icons';
import {
    SourceMention,
    DataEntryEpisodeEntityLinkGQL,
    Entity,
    DataEntryEpisodeEntityLinkQuery,
    DataEntryUpdateEpisodeEntityLinkGQL,
    DataEntryUpdateEpisodeEntityLinkMutation,
    DataEntryUpdateEpisodeEntityLinkMutationVariables,
    UpdateEpisodeEntityLinkInput
} from 'generated/graphql';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { entityTypeNames, formStatusSubject, sourceMentionSelectOptions } from '../utils';
import _ from 'underscore';
import { MutationResult } from 'apollo-angular';
import { FormService } from '../form.service';


type LinkTo = 'episode' | 'entity';
let nextID = 0;

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
        designators: new FormControl<string[]>([], { nonNullable: true }),
        note: new FormControl<string>('', { nonNullable: true }),
    });

    sourceMentionOptions: SelectOptions<SourceMention> = sourceMentionSelectOptions();

    private link$ = new Subject<UpdateEpisodeEntityLinkInput>();
    private status$ = formStatusSubject();
    private id = `episode-link-${nextID++}`;

    actionIcons = actionIcons;

    constructor(
        query: DataEntryEpisodeEntityLinkGQL,
        private updateMutation: DataEntryUpdateEpisodeEntityLinkGQL,
        private formService: FormService,
    ) {
        this.formService.attachForm(this.id, this.status$);

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

    get sourceMentionInputID() {
        return this.id + '-source-mention-input';
    }

    get notesInputID() {
        return this.id + '-notes-input';
    }

    get entityName(): string {
        return entityTypeNames[this.entityType];
    }

    get linkedObjectName(): string {
        return this.linkTo == 'episode' ? 'episode' : this.entityName;
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
        this.formService.detachForm(this.id);
    }

    formUrl(linkTo: LinkTo, entityType: Entity): string {
        if (linkTo == 'episode') {
            return 'episodes';
        }
        const routes = {
            [Entity.Agent]: 'agents',
            [Entity.Gift]: 'gifts',
            [Entity.Letter]: 'letters',
            [Entity.Space]: 'locations',
        };
        return routes[entityType];
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
            designators: data?.episodeEntityLink?.designators || [],
            note: data?.episodeEntityLink?.note || '',
        });
    }

    private toMutationInput(
        [values, link]: [typeof this.form.value, UpdateEpisodeEntityLinkInput]
    ): DataEntryUpdateEpisodeEntityLinkMutationVariables {
        return { input: { ...link, ...values } };
    }

    private makeMutation(mutationInput: DataEntryUpdateEpisodeEntityLinkMutationVariables) {
        return this.updateMutation.mutate(mutationInput, {
            errorPolicy: 'all',
            refetchQueries: [
                'DataEntryEpisodeEntity',
            ],
        })
    }

    private onMutationResult(result: MutationResult<DataEntryUpdateEpisodeEntityLinkMutation>) {
        if (result.errors?.length) {
            console.error(result.errors);
            this.status$.next('error');
        } else if (result.data?.updateEpisodeEntityLink?.errors?.length) {
            console.error(result.data.updateEpisodeEntityLink.errors);
            this.status$.next('error');
        } else {
            this.status$.next('saved');
        }
    }
}
