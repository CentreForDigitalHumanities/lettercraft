import { Component, OnDestroy } from "@angular/core";
import { map, Observable, Observer, Subject, switchMap, tap, withLatestFrom } from "rxjs";
import { differencyBy, formStatusSubject } from "../../shared/utils";
import { actionIcons } from "@shared/icons";
import { MutationResult } from "apollo-angular";
import { FormService } from "../../shared/form.service";
import {
    CreateEpisodeEntityLinkInput,
    DataEntryCreateEpisodeEntityLinkGQL,
    DataEntryDeleteEpisodeEntityLinkGQL,
    DataEntryDeleteEpisodeEntityLinkMutationVariables,
    DataEntryEpisodeAgentsGQL,
    DataEntryEpisodeAgentsQuery,
    Entity
} from "generated/graphql";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

const REFETCH_QUERIES = ['DataEntryEpisodeAgents'];

@Component({
    selector: "lc-episode-agents-form",
    templateUrl: "./episode-agents-form.component.html",
    styleUrls: ["./episode-agents-form.component.scss"],
})
export class EpisodeAgentsFormComponent implements OnDestroy {
    data$: Observable<DataEntryEpisodeAgentsQuery>;
    availableEntities$: Observable<{ name: string, id: string }[]>;

    addEntity$ = new Subject<string>();
    removeEntity$ = new Subject<string>();
    actionIcons = actionIcons;
    status$ = formStatusSubject();
    formName = 'agents';
    entityType = Entity.Agent;

    private mutationObserver: Partial<Observer<MutationResult>> = {
        next: this.onSuccess.bind(this),
        error: this.onError.bind(this),
    };

    constructor(
        private formService: FormService,
        private query: DataEntryEpisodeAgentsGQL,
        private addMutation: DataEntryCreateEpisodeEntityLinkGQL,
        private removeMutation: DataEntryDeleteEpisodeEntityLinkGQL,
    ) {
        this.formService.attachForm(this.formName, this.status$);
        this.data$ = this.formService.id$.pipe(
            switchMap(id => this.query.watch({ id }).valueChanges),
            map(result => result.data),
            takeUntilDestroyed(),
        );
        this.availableEntities$ = this.data$.pipe(
            map(this.availableEntities)
        );

        this.addEntity$.pipe(
            withLatestFrom(this.formService.id$),
            takeUntilDestroyed(),
        ).subscribe(([episodeID, entityID]) =>
            this.addEntity(episodeID, entityID)
        );

        this.removeEntity$.pipe(
            withLatestFrom(this.formService.id$),
            takeUntilDestroyed(),
        ).subscribe(([episodeID, entityID]) =>
            this.removeEntity(episodeID, entityID)
        );
    }

    /** name of the entity type in natural language */
    get entityName(): string {
        const names = {
            [Entity.Agent]: 'agent',
            [Entity.Gift]: 'gift',
            [Entity.Letter]: 'letter',
            [Entity.Space]: 'location',
        };
        return names[this.entityType];
    }

    get addDropdownTriggerID(): string {
        return `add-${this.entityType}-dropdown-trigger`;
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

    private availableEntities(
        data: DataEntryEpisodeAgentsQuery
    ): { name: string, id: string }[] {
        const allEntities = data.episode?.source.agents || [];
        const linkedEntities = data.episode?.agents || [];
        return differencyBy(allEntities, linkedEntities, 'id');
    }
}
