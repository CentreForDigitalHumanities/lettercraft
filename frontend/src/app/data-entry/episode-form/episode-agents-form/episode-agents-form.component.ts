import { Component, OnDestroy, TemplateRef } from "@angular/core";
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
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "@services/toast.service";

@Component({
    selector: "lc-episode-agents-form",
    templateUrl: "./episode-agents-form.component.html",
    styleUrls: ["./episode-agents-form.component.scss"],
})
export class EpisodeAgentsFormComponent implements OnDestroy {
    data$: Observable<DataEntryEpisodeAgentsQuery>;
    availableAgents$: Observable<{ name: string, id: string }[]>;

    addAgent$ = new Subject<string>();
    removeAgent$ = new Subject<string>();
    actionIcons = actionIcons;
    status$ = formStatusSubject();
    formName = 'agents';
    entityType = Entity.Agent;
    createMutationInProgress = false;

    private modal?: NgbModalRef;

    private mutationObserver: Partial<Observer<MutationResult>> = {
        next: this.onSuccess.bind(this),
        error: this.onError.bind(this),
    };

    constructor(
        private formService: FormService,
        private query: DataEntryEpisodeAgentsGQL,
        private addMutation: DataEntryCreateEpisodeEntityLinkGQL,
        private removeMutation: DataEntryDeleteEpisodeEntityLinkGQL,
        private modalService: NgbModal,
        private toastService: ToastService,
    ) {
        this.formService.attachForm(this.formName, this.status$);
        this.data$ = this.formService.id$.pipe(
            switchMap(id => this.query.watch({ id }).valueChanges),
            map(result => result.data),
            takeUntilDestroyed(),
        );
        this.availableAgents$ = this.data$.pipe(
            map(this.availableAgents)
        );

        this.addAgent$.pipe(
            withLatestFrom(this.formService.id$),
            takeUntilDestroyed(),
        ).subscribe(([episodeID, agentID]) =>
            this.addAgent(episodeID, agentID)
        );

        this.removeAgent$.pipe(
            withLatestFrom(this.formService.id$),
            takeUntilDestroyed(),
        ).subscribe(([episodeID, agentID]) =>
            this.removeAgent(episodeID, agentID)
        );
    }

    ngOnDestroy(): void {
        this.status$.complete();
        this.addAgent$.complete();
        this.removeAgent$.complete();
        this.formService.detachForm(this.formName);
    }

    addAgent(agentID: string, episodeID: string): void {
        const input: CreateEpisodeEntityLinkInput = {
            entity: agentID,
            episode: episodeID,
            entityType: Entity.Agent,
        };
        this.addMutation.mutate({ input }, {
            update: (cache) => this.updateCacheOnAddRemove(episodeID, agentID, cache),
        }).pipe(
            tap(() => this.status$.next('loading'))
        ).subscribe(this.mutationObserver);
    }

    removeAgent(agentID: string, episodeID: string): void {
        const data: DataEntryDeleteEpisodeEntityLinkMutationVariables = {
            entity: agentID,
            episode: episodeID,
            entityType: Entity.Agent,
        };
        this.removeMutation.mutate(data, {
            update: (cache) => this.updateCacheOnAddRemove(episodeID, agentID, cache),
        }).pipe(
            tap(() => this.status$.next('loading'))
        ).subscribe(this.mutationObserver)
    }

    onSuccess() {
        this.status$.next('saved');
    }

    onError(error: any) {
        console.error(error);
        this.status$.next('error');
        this.toastService.show({
            type: 'danger',
            header: 'Adding agent failed',
            body: 'Could not add agent',
        });
    }

    public openNewAgentModal(newAgentModal: TemplateRef<unknown>): void {
        this.modal = this.modalService.open(newAgentModal);
    }

    closeModal() {
        this.modal?.close();
    }

    private updateCacheOnAddRemove(episodeID: string, agentID: string, cache: any) {
        cache.evict(cache.identify({
            __typename: "EpisodeType",
            id: episodeID,
        }));
        cache.evict(cache.identify({
            __typename: "AgentDescriptionType",
            id: agentID,
        }));
        cache.gc();
    }

    private availableAgents(
        data: DataEntryEpisodeAgentsQuery
    ): { name: string, id: string }[] {
        const allAgents = data.episode?.source.agents || [];
        const linkedAgents = data.episode?.agents || [];
        return differencyBy(allAgents, linkedAgents, 'id');
    }

}
