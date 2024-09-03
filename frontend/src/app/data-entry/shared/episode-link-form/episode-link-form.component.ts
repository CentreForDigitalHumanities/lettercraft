import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { EntityType } from '../types';
import { combineLatest, map, Observable, shareReplay, Subject, switchMap } from 'rxjs';
import { actionIcons } from '@shared/icons';
import { EpisodeAgentQueryGQL, EpisodeAgentQueryQuery } from 'generated/graphql';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// const EPISODE_LINK_QUERIES: Record<EntityType, typeof EpisodeAgentQueryGQL> = {
//     agent: EpisodeAgentQueryGQL,
// };

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
    @Input() linkTo: 'episode' | 'entity' = 'episode';

    data$: Observable<EpisodeAgentQueryQuery | undefined>;

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
        this.data$.subscribe();
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
}
