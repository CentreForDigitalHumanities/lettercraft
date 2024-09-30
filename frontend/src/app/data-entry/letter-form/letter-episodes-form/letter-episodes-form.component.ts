import { Component, OnDestroy } from '@angular/core';
import { actionIcons } from '@shared/icons';
import { CreateEpisodeEntityLinkInput, DataEntryCreateEpisodeEntityLinkGQL, DataEntryDeleteEpisodeEntityLinkGQL, DataEntryDeleteEpisodeEntityLinkMutationVariables, DataEntryLetterEpisodesGQL, DataEntryLetterEpisodesQuery, Entity } from 'generated/graphql';
import { map, Observable, Observer, Subject, switchMap, withLatestFrom } from 'rxjs';
import { formStatusSubject } from '../../shared/utils';
import { MutationResult } from 'apollo-angular';
import { FormService } from '../../shared/form.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { differenceBy, splat } from '@shared/utils';
import { ApolloCache } from '@apollo/client/core';

@Component({
  selector: 'lc-letter-episodes-form',
  templateUrl: './letter-episodes-form.component.html',
  styleUrls: ['./letter-episodes-form.component.scss']
})
export class LetterEpisodesFormComponent implements OnDestroy {
    data$: Observable<DataEntryLetterEpisodesQuery>;
    availableEpisodes$: Observable<{ name: string, id: string }[]>;

    addEpisode$ = new Subject<string>();
    removeEpisode$ = new Subject<string>();
    actionIcons = actionIcons;
    status$ = formStatusSubject();
    formName = 'episodes';
    entityType = Entity.Letter;

    private mutationRequestObserver: Partial<Observer<MutationResult>> = {
        next: this.onSuccess.bind(this),
        error: this.onError.bind(this),
    };

    constructor(
        private formService: FormService,
        private query: DataEntryLetterEpisodesGQL,
        private addMutation: DataEntryCreateEpisodeEntityLinkGQL,
        private removeMutation: DataEntryDeleteEpisodeEntityLinkGQL,
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
        ).subscribe(splat(this.addEpisode.bind(this)));

        this.removeEpisode$.pipe(
            withLatestFrom(this.formService.id$),
            takeUntilDestroyed(),
        ).subscribe(splat(this.removeEpisode.bind(this)));
    }

    ngOnDestroy(): void {
        this.status$.complete();
        this.addEpisode$.complete();
        this.removeEpisode$.complete();
        this.formService.detachForm(this.formName);
    }

    addEpisode(episodeID: string, letterID: string): void {
        const input: CreateEpisodeEntityLinkInput = {
            entity: letterID,
            episode: episodeID,
            entityType: this.entityType,
        };
        this.status$.next('loading');
        this.addMutation.mutate({ input }, {
            update: (cache) => this.updateCache(episodeID, letterID, cache),
        }).subscribe(this.mutationRequestObserver);
    }

    removeEpisode(episodeID: string, letterID: string): void {
        const data: DataEntryDeleteEpisodeEntityLinkMutationVariables = {
            entity: letterID,
            episode: episodeID,
            entityType: this.entityType,
        };
        this.status$.next('loading');
        this.removeMutation.mutate(data, {
            update: (cache) => this.updateCache(episodeID, letterID, cache),
        }).subscribe(this.mutationRequestObserver)
    }

    onSuccess() {
        this.status$.next('saved');
    }

    onError(error: any) {
        console.error(error);
        this.status$.next('error');
    }

    private updateCache(episodeID: string, letterID: string, cache: ApolloCache<unknown>) {
        cache.evict({
            id: cache.identify({ __typename: "EpisodeType", id: episodeID }),
            fieldName: 'letters',
        });
        cache.evict({
            id: cache.identify({ __typename: "LetterDescriptionType", id: letterID }),
            fieldName: 'episodes',
        });
        cache.gc();
    }

    private availableEpisodes(
        data: DataEntryLetterEpisodesQuery
    ): { name: string, id: string }[] {
        const allEpisodes = data.letterDescription?.source.episodes || [];
        const linkedEpisodes = data.letterDescription?.episodes.map(link => link.episode) || [];
        return differenceBy(allEpisodes, linkedEpisodes, 'id');
    }
}
