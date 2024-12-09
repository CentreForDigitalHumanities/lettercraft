import { Component, computed, DestroyRef, TemplateRef } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "@services/toast.service";
import { actionIcons, dataIcons } from "@shared/icons";
import {
    DataEntrySourceDetailGQL,
    DataEntrySourceDetailQuery,
    DataEntryUpdateEpisodeOrderGQL,
    DataEntryUpdateEpisodeOrderMutation,
    EpisodeType,
} from "generated/graphql";
import { map, shareReplay, switchMap } from "rxjs";
import { MutationResult } from "apollo-angular";
import { moveItemInArray } from "@shared/utils";
import { OrderChange } from "@shared/order-button-group/order-button-group.component";

type QueriedEpisode = DataEntrySourceDetailQuery["source"]["episodes"][number];

@Component({
    selector: "lc-source",
    templateUrl: "./source.component.html",
    styleUrls: ["./source.component.scss"],
})
export class SourceComponent {
    public breadcrumbs = computed(() => [
        {
            label: "Lettercraft",
            link: "/",
        },
        {
            label: "Data entry",
            link: "/data-entry",
        },
        {
            label: this.sourceTitle(),
            link: "/data-entry/sources/" + this.route.snapshot.params["id"],
        },
    ]);

    public source$ = this.route.params.pipe(
        map((params) => params["id"]),
        switchMap((id) => this.sourceDetailQuery.watch({ id }).valueChanges),
        map((result) => result.data.source),
        shareReplay(1)
    );

    public sourceTitle = toSignal(
        this.source$.pipe(map((source) => source.name)),
        { initialValue: "" }
    );

    public dataIcons = dataIcons;
    public actionIcons = actionIcons;

    public modal: NgbModalRef | null = null;
    public mutationInProgress = false;

    constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private toastService: ToastService,
        private sourceDetailQuery: DataEntrySourceDetailGQL,
        private updateEpisodeOrder: DataEntryUpdateEpisodeOrderGQL
    ) {}

    public openNewEpisodeModal(newEpisodeModal: TemplateRef<unknown>): void {
        this.modal = this.modalService.open(newEpisodeModal);
    }

    public closeModal(): void {
        if (this.modal) {
            this.modal.close();
        }
    }

    public closeAndNavigate(episodeId: string | null): void {
        this.mutationInProgress = false;
        this.closeModal();
        if (episodeId) {
            this.router.navigate(["/data-entry/episodes", episodeId]);
        }
    }

    public identify(_index: number, item: Pick<EpisodeType, "id">): string {
        return item.id;
    }

    public reorderEpisodes(
        episodes: QueriedEpisode[],
        episodeId: string,
        change: OrderChange
    ): void {
        const episodeIds = episodes.map((episode) => episode.id);
        const currentIndex = episodeIds.indexOf(episodeId);

        const indexNotFound = currentIndex === -1;
        const indexAtBoundary =
            (change === "up" && currentIndex <= 0) ||
            (change === "down" && currentIndex >= episodeIds.length - 1);

        // Don't mutate if the order change is invalid.
        if (indexNotFound || indexAtBoundary) {
            return;
        }

        const newIndex = change === "up" ? currentIndex - 1 : currentIndex + 1;
        const newOrder = moveItemInArray(episodeIds, currentIndex, newIndex);

        this.updateEpisodeOrder
            .mutate(
                {
                    episodeIds: newOrder,
                },
                {
                    update: (cache) => cache.evict({ fieldName: "source" }),
                }
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                this.onOrderMutationResult(result);
            });
    }

    private onOrderMutationResult(
        result: MutationResult<DataEntryUpdateEpisodeOrderMutation>
    ): void {
        const graphQLErrors = result.errors;
        const mutationErrors = result.data?.updateEpisodeOrder?.errors;

        if (graphQLErrors?.length) {
            const messages = graphQLErrors.map((error) => error.message);
            this.toastService.show({
                type: "danger",
                header: "Failed to save episode order",
                body: messages.join("\n\n"),
            });
        } else if (mutationErrors?.length) {
            const messages = mutationErrors.map(
                (error) => `${error.field}: ${error.messages.join("\n")}`
            );
            this.toastService.show({
                type: "danger",
                header: "Failed to save episode order",
                body: messages.join("\n\n"),
            });
        }
    }
}
