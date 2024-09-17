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
import { splat, differencyBy } from "@shared/utils";

const REFETCH_QUERIES = ['DataEntryEpisodeEntities'];

type EntityPropertyName = 'agents' | 'gifts' | 'letters' | 'spaces';

@Component({
    selector: "lc-episode-agents-form",
    templateUrl: "./episode-agents-form.component.html",
    styleUrls: ["./episode-agents-form.component.scss"],
})
export class EpisodeAgentsFormComponent implements OnChanges, OnDestroy {
    @Input() entityType: Entity = Entity.Agent;

    data$: Observable<DataEntryEpisodeEntitiesQuery>;

    linkedEntities$: Observable<{ id: string }[]>;
    availableEntities$: Observable<{ name: string, id: string }[]>;

    addEntity$ = new Subject<string>();
    removeEntity$ = new Subject<string>();
    actionIcons = actionIcons;
    status$ = formStatusSubject();
    formName = crypto.randomUUID();

    private mutationObserver: Partial<Observer<MutationResult>> = {
        next: this.onSuccess.bind(this),
        error: this.onError.bind(this),
    };

    constructor(
        private formService: FormService,
        private query: DataEntryEpisodeEntitiesGQL,
        private addMutation: DataEntryCreateEpisodeEntityLinkGQL,
        private removeMutation: DataEntryDeleteEpisodeEntityLinkGQL,
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

    get addDropdownTriggerID(): string {
        return `add-${this.entityType}-dropdown-trigger`;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['entityType']) {

            this.formService.attachForm(this.formName, this.status$);
        }
    }

    ngOnDestroy(): void {
        this.status$.complete();
        this.addEntity$.complete();
        this.removeEntity$.complete();
        this.formService.detachForm(this.formName);
    }

    addEntity(entityID: string, episodeID: string): void {
        const input: CreateEpisodeEntityLinkInput = {
            entity: entityID,
            episode: episodeID,
            entityType: this.entityType,
        };
        this.addMutation.mutate({ input }, {
            refetchQueries: REFETCH_QUERIES,
        }).pipe(
            tap(() => this.status$.next('loading'))
        ).subscribe(this.mutationObserver);
    }

    removeEntity(entityID: string, episodeID: string): void {
        const data: DataEntryDeleteEpisodeEntityLinkMutationVariables = {
            entity: entityID,
            episode: episodeID,
            entityType: this.entityType,
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

    private linkedEntities(data: DataEntryEpisodeEntitiesQuery): { id: string }[] {
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
        const linkedEntities = data.episode?.[this.entityProperty] || [];
        return differencyBy(allEntities, linkedEntities, 'id');
    }
}
