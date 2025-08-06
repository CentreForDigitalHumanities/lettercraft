import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { combineLatest, map, Observable, Observer, startWith, Subject, switchMap, tap, withLatestFrom, shareReplay } from "rxjs";
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
import { FormControl } from "@angular/forms";

type EntityPropertyName = 'agents' | 'gifts' | 'letters' | 'spaces';
type EntityTypeName = 'AgentDescriptionType' | 'GiftDescriptionType' | 'LetterDescriptionType' | 'SpaceDescriptionType';

let nextID = 0;

interface EntityItem {
    __typename?: string;
    id: string;
    name: string;
}

@Component({
    selector: "lc-episode-entities-form",
    templateUrl: "./episode-entities-form.component.html",
    styleUrls: ["./episode-entities-form.component.scss"],
})
export class EpisodeEntitiesFormComponent implements OnChanges, OnDestroy {
    @Input() entityType!: Entity;

    data$: Observable<DataEntryEpisodeEntitiesQuery>;

    linkedEntities$: Observable<EntityItem[]>;
    availableEntities$: Observable<EntityItem[]>;

    searchControl = new FormControl<string>("", {
        nonNullable: true
    });
    entitySearch$ = this.searchControl.valueChanges.pipe(
        startWith(""),
        shareReplay(1),
    );

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
        this.availableEntities$ = combineLatest([this.data$, this.entitySearch$]).pipe(
            map(([data, search]) => this.availableEntities(data, search))
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
    get entityListPath(): EntityPropertyName {
        const keys: Record<Entity, EntityPropertyName> = {
            [Entity.Agent]: 'agents',
            [Entity.Gift]: 'gifts',
            [Entity.Letter]: 'letters',
            [Entity.Space]: 'spaces',
        };
        return keys[this.entityType];
    }

    get entityTypeName(): EntityTypeName {
        const types: Record<Entity, EntityTypeName> = {
            [Entity.Agent]: 'AgentDescriptionType',
            [Entity.Gift]: 'GiftDescriptionType',
            [Entity.Letter]: 'LetterDescriptionType',
            [Entity.Space]: 'SpaceDescriptionType',
        };
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
        ).subscribe(this.mutationRequestObserver);
    }

    onSuccess() {
        this.status$.next('saved');
    }

    onError(error: unknown) {
        console.error(error);
        this.toastService.show({
            header: `Adding ${this.entityName} failed`,
            body: `Could not add ${this.entityName}`,
            type: 'danger',
        });
        this.status$.next('error');
    }

    private linkedEntities(data: DataEntryEpisodeEntitiesQuery): EntityItem[] {
        return data.episode?.[this.entityListPath].map(link => link.entity) || [];
    }

    private availableEntities(
        data: DataEntryEpisodeEntitiesQuery,
        searchValue = ""
    ): EntityItem[] {
        const allEntities: EntityItem[] = data.episode?.source[this.entityListPath] || [];
        const linkedEntities = this.linkedEntities(data);
        const unlinkedEntities = differenceBy(allEntities, linkedEntities, 'id');

        const foundEntities = searchValue
            ? unlinkedEntities.filter(entity => entity.name.toLowerCase().includes(searchValue.toLowerCase()))
            : unlinkedEntities;

        return foundEntities.sort((a, b) => a.name.localeCompare(b.name));
    }

    private updateCacheOnAddRemove(episodeID: string, entityID: string, cache: ApolloCache<unknown>) {
        cache.evict({
            id: cache.identify({
                __typename: "EpisodeType",
                id: episodeID,
            }),
            fieldName: this.entityListPath,
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
