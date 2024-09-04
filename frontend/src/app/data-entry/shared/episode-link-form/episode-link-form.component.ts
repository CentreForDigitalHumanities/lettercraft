import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { EntityType, SelectOptions } from '../types';
import { combineLatest, map, Observable, shareReplay, Subject, switchMap } from 'rxjs';
import { actionIcons } from '@shared/icons';
import { EpisodeAgentQueryGQL, EpisodeAgentQueryQuery, SourceMention } from 'generated/graphql';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';


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
    @Output() delete = new EventEmitter<void>();

    collapsed = true;

    data$: Observable<EpisodeAgentQueryQuery | undefined>;
    form = new FormGroup({
        sourceMention: new FormControl<SourceMention>(SourceMention.Direct),
        note: new FormControl<string>('', { nonNullable: true }),
    });

    sourceMentionOptions: SelectOptions<SourceMention> = [
        { value: SourceMention.Direct, label: 'Directly mentioned' },
        { value: SourceMention.Implied, label: 'Implied' }
    ];

    private entityQueries: Record<EntityType, EpisodeAgentQueryGQL>;
    private query$ = new Subject<EpisodeAgentQueryGQL>();
    private id$ = new Subject<string>;

    actionIcons = actionIcons;

    constructor(
        private agentQuery: EpisodeAgentQueryGQL,
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

    linkedObject(linkTo: LinkTo, data: EpisodeAgentQueryQuery) {
        if (linkTo === 'episode') {
            return data.episodeAgentLink?.episode;
        } else {
            return data.episodeAgentLink?.agent;
        }
    }

    private updateFormValues(data?: EpisodeAgentQueryQuery): void {
        this.form.setValue({
            sourceMention: data?.episodeAgentLink?.sourceMention || SourceMention.Direct,
            note: data?.episodeAgentLink?.note || '',
        });
    }
}
