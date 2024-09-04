import { Component, OnDestroy } from "@angular/core";
import { map, Observable, Observer, Subject, switchMap, tap, withLatestFrom } from "rxjs";
import { differencyBy, formStatusSubject } from "../../shared/utils";
import { actionIcons } from "@shared/icons";
import { MutationResult } from "apollo-angular";
import { FormService } from "../../shared/form.service";
import {
    CreateEpisodeAgentInput, DataEntryCreateAgentEpisodeMutationGQL,
    DataEntryDeleteAgentEpisodeMutationGQL, DataEntryEpisodeAgentsGQL,
    DataEntryEpisodeAgentsQuery
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
    availableAgents$: Observable<{ name: string, id: string }[]>;

    addAgent$ = new Subject<string>();
    removeAgent$ = new Subject<string>();
    actionIcons = actionIcons;
    status$ = formStatusSubject();
    formName = 'agents';

    private mutationObserver: Partial<Observer<MutationResult>> = {
        next: this.onSuccess.bind(this),
        error: this.onError.bind(this),
    };

    constructor(
        private formService: FormService,
        private query: DataEntryEpisodeAgentsGQL,
        private addMutation: DataEntryCreateAgentEpisodeMutationGQL,
        private removeMutation: DataEntryDeleteAgentEpisodeMutationGQL,
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
        const data: CreateEpisodeAgentInput = {
            agent: agentID,
            episode: episodeID,
        };
        this.addMutation.mutate({ data }, {
            refetchQueries: REFETCH_QUERIES,
        }).pipe(
            tap(() => this.status$.next('loading'))
        ).subscribe(this.mutationObserver);
    }

    removeAgent(agentID: string, episodeID: string): void {
        const data = {
            agent: agentID,
            episode: episodeID,
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

    private availableAgents(
        data: DataEntryEpisodeAgentsQuery
    ): { name: string, id: string }[] {
        const allAgents = data.episode?.source.agents || [];
        const linkedAgents = data.episode?.agents || [];
        return differencyBy(allAgents, linkedAgents, 'id');
    }
}
