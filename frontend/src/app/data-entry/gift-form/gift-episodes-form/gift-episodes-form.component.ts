import { Component, OnDestroy } from '@angular/core';
import { actionIcons } from '@shared/icons';
import { CreateEpisodeEntityLinkInput, DataEntryCreateEpisodeEntityLinkGQL, DataEntryDeleteEpisodeEntityLinkGQL, DataEntryDeleteEpisodeEntityLinkMutationVariables, DataEntryGiftEpisodesGQL, DataEntryGiftEpisodesQuery, Entity } from 'generated/graphql';
import { map, Observable, Observer, Subject, switchMap, withLatestFrom } from 'rxjs';
import { formStatusSubject } from '../../shared/utils';
import { MutationResult } from 'apollo-angular';
import { ApolloCache } from '@apollo/client/core';
import { FormService } from '../../shared/form.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { differenceBy, splat } from '@shared/utils';

@Component({
    selector: 'lc-gift-episodes-form',
    templateUrl: './gift-episodes-form.component.html',
    styleUrls: ['./gift-episodes-form.component.scss'],
    standalone: false
})
export class GiftEpisodesFormComponent implements OnDestroy {
    data$: Observable<DataEntryGiftEpisodesQuery>;
    availableEpisodes$: Observable<{ name: string, id: string }[]>;

    addEpisode$ = new Subject<string>();
    removeEpisode$ = new Subject<string>();
    actionIcons = actionIcons;
    status$ = formStatusSubject();
    formName = 'episodes';
    entityType = Entity.Gift;

    private mutationRequestObserver: Partial<Observer<MutationResult>> = {
        next: this.onSuccess.bind(this),
        error: this.onError.bind(this),
    };

    constructor(
        private formService: FormService,
        private query: DataEntryGiftEpisodesGQL,
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

    addEpisode(episodeID: string, giftID: string): void {
        const input: CreateEpisodeEntityLinkInput = {
            entity: giftID,
            episode: episodeID,
            entityType: this.entityType,
        };
        this.status$.next('loading');
        this.addMutation.mutate({ input }, {
            update: (cache) => this.updateCache(episodeID, giftID, cache),
        }).subscribe(this.mutationRequestObserver);
    }

    removeEpisode(episodeID: string, giftID: string): void {
        const data: DataEntryDeleteEpisodeEntityLinkMutationVariables = {
            entity: giftID,
            episode: episodeID,
            entityType: this.entityType,
        };
        this.status$.next('loading');
        this.removeMutation.mutate(data, {
            update: (cache) => this.updateCache(episodeID, giftID, cache),
        }).subscribe(this.mutationRequestObserver)
    }

    onSuccess() {
        this.status$.next('saved');
    }

    onError(error: any) {
        console.error(error);
        this.status$.next('error');
    }

    private updateCache(episodeID: string, giftID: string, cache: ApolloCache<unknown>) {
        cache.evict({
            id: cache.identify({ __typename: "EpisodeType", id: episodeID }),
            fieldName: 'gifts'
        });
        cache.evict({
            id: cache.identify({ __typename: "GiftDescriptionType", id: giftID }),
            fieldName: 'episodes'
        });
        cache.gc();
    }

    private availableEpisodes(
        data: DataEntryGiftEpisodesQuery
    ): { name: string, id: string }[] {
        const allEpisodes = data.giftDescription?.source.episodes || [];
        const linkedEpisodes = data.giftDescription?.episodes.map(link => link.episode) || [];
        return differenceBy(allEpisodes, linkedEpisodes, 'id');
    }
}
