import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { map, Observable, Observer, Subject, switchMap, tap, withLatestFrom } from "rxjs";
import { entityTypeNames, formStatusSubject } from "../../shared/utils";
import { actionIcons } from "@shared/icons";
import { MutationResult } from "apollo-angular";
import { FormService } from "../../shared/form.service";
import {
    CreateEpisodeEntityLinkInput,
    DataEntryCreateEpisodeEntityLinkGQL,
    DataEntryDeleteEpisodeEntityLinkGQL,
    DataEntryDeleteEpisodeEntityLinkMutationVariables,
    DataEntryEpisodeEntitiesGQL,
    DataEntryEpisodeEntitiesQuery,
    Entity
} from "generated/graphql";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { splat, differenceBy } from "@shared/utils";
import { ToastService } from "@services/toast.service";
import { ApolloCache } from "@apollo/client/core";

type EntityPropertyName = 'agents' | 'gifts' | 'letters' | 'spaces';
type EntityTypeName = 'AgentDescriptionType' | 'GiftDescriptionType' | 'LetterDescriptionType' | 'SpaceDescriptionType';

let nextID = 0;

@Component({
    selector: "lc-episode-entities-form",
    templateUrl: "./episode-entities-form.component.html",
    styleUrls: ["./episode-entities-form.component.scss"],
})
export class EpisodeEntitiesFormComponent implements OnChanges, OnDestroy {
    @Input() entityType!: Entity;

    data$: Observable<DataEntryEpisodeEntitiesQuery>;

    linkedEntities$: Observable<{ id: string, name: string }[]>;
    availableEntities$: Observable<{ name: string, id: string }[]>;

    addEntity$ = new Subject<string>();
    removeEntity$ = new Subject<string>();
    createEntity$ = new Subject<void>();

    actionIcons = actionIcons;
    status$ = formStatusSubject();
    id = `episode-entities-${nextID++}`;

    private mutationRequestObserver: Partial<Observer<MutationResult>> = {
        next: this.onSuccess.bind(this),
        error: this.onError.bind(this),
    };

    constructor(
        private formService: FormService,
        private query: DataEntryEpisodeEntitiesGQL,
        private addMutation: DataEntryCreateEpisodeEntityLinkGQL,
        private removeMutation: DataEntryDeleteEpisodeEntityLinkGQL,
        private toastService: ToastService,
    ) {
        this.data$ = this.formService.id$.pipe(
            switchMap(id => this.query.watch({ id }).valueChanges),
            map(result => result.data),
            takeUntilDestroyed(),
        );
        this.availableEntities$ = this.data$.pipe(
            map(this.availableEntities.bind(this))
        );
        this.linkedEntities$ = this.data$.pipe(
            map(this.linkedEntities.bind(this))
        );

        this.addEntity$.pipe(
            withLatestFrom(this.formService.id$),
            takeUntilDestroyed(),
        ).subscribe(splat(this.addEntity.bind(this)));

        this.removeEntity$.pipe(
            withLatestFrom(this.formService.id$),
            takeUntilDestroyed(),
        ).subscribe(splat(this.removeEntity.bind(this)));
    }

    get dropdownToggleID() {
        return this.id + '-dropdown-toggle';
    }

    /** name of the entity type in natural language */
    get entityName(): string {
        return entityTypeNames[this.entityType];
    }

    /** property used for the entity relationship in graphQL data */
    get entityProperty(): EntityPropertyName {
        const keys: Record<Entity, EntityPropertyName> = {
            [Entity.Agent]: 'agents',
            [Entity.Gift]: 'gifts',
            [Entity.Letter]: 'letters',
            [Entity.Space]: 'spaces',
        }
        return keys[this.entityType]
    }

    get entityTypeName(): EntityTypeName {
        const types: Record<Entity, EntityTypeName> = {
            [Entity.Agent]: 'AgentDescriptionType',
            [Entity.Gift]: 'GiftDescriptionType',
            [Entity.Letter]: 'LetterDescriptionType',
            [Entity.Space]: 'SpaceDescriptionType',
        }
        return types[this.entityType];
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['entityType']) {

            this.formService.attachForm(this.id, this.status$);
        }
    }

    ngOnDestroy(): void {
        this.status$.complete();
        this.addEntity$.complete();
        this.removeEntity$.complete();
        this.formService.detachForm(this.id);
    }

    addEntity(entityID: string, episodeID: string): void {
        this.status$.next('loading');
        const input: CreateEpisodeEntityLinkInput = {
            entity: entityID,
            episode: episodeID,
            entityType: this.entityType,
        };
        this.addMutation.mutate({ input }, {
            update: cache => this.updateCacheOnAddRemove(episodeID, entityID, cache),
        }).pipe(
            tap(() => this.status$.next('loading'))
        ).subscribe(this.mutationRequestObserver);
    }

    removeEntity(entityID: string, episodeID: string): void {
        this.status$.next('loading');
        const data: DataEntryDeleteEpisodeEntityLinkMutationVariables = {
            entity: entityID,
            episode: episodeID,
            entityType: this.entityType,
        };
        this.removeMutation.mutate(data, {
            update: cache => this.updateCacheOnAddRemove(episodeID, entityID, cache)
        }).pipe(
        ).subscribe(this.mutationRequestObserver)
    }

    onSuccess() {
        this.status$.next('saved');
    }

    onError(error: any) {
        console.error(error);
        this.toastService.show({
            header: `Adding ${this.entityName} failed`,
            body: `Could not add ${this.entityName}`,
            type: 'danger',
        })
        this.status$.next('error');
    }

    private linkedEntities(data: DataEntryEpisodeEntitiesQuery): { id: string, name: string }[] {
        return data.episode?.[this.entityProperty] || [];
    }

    private availableEntities(
        data: DataEntryEpisodeEntitiesQuery
    ): { name: string, id: string }[] {
        const allEntities: {
            __typename?: string,
            name: string,
            id: string
        }[] = data.episode?.source[this.entityProperty] || [];
        const linkedEntities = this.linkedEntities(data);
        return differenceBy(allEntities, linkedEntities, 'id');
    }

    private updateCacheOnAddRemove(episodeID: string, entityID: string, cache: ApolloCache<unknown>) {
        cache.evict({
            id: cache.identify({
                __typename: "EpisodeType",
                id: episodeID,
            }),
            fieldName: this.entityProperty,
        });
        cache.evict({
            id: cache.identify({
                __typename: this.entityTypeName,
                id: entityID,
            }),
        });
        cache.gc();
    }

}
