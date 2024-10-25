import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import {
    Component,
    computed,
    DestroyRef,
    OnInit,
    TemplateRef,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "@services/toast.service";
import { actionIcons, dataIcons } from "@shared/icons";
import { MutationResult } from "apollo-angular";
import {
    DataEntrySourceDetailGQL,
    DataEntrySourceDetailQuery,
    DataEntryUpdateEpisodeMutation,
    DataEntryUpdateEpisodeOrderGQL,
    EpisodeType,
} from "generated/graphql";
import { map, shareReplay, switchMap } from "rxjs";

type QueriedEpisode = DataEntrySourceDetailQuery["source"]["episodes"][number];

@Component({
    selector: "lc-source",
    templateUrl: "./source.component.html",
    styleUrls: ["./source.component.scss"],
})
export class SourceComponent implements OnInit {
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

    public episodes: QueriedEpisode[] = [];

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

    ngOnInit(): void {
        this.source$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((source) => {
                // We need to create a local copy of the episodes because we will be reordering them.
                this.episodes = structuredClone(source.episodes);
            });
    }

    public drop(event: CdkDragDrop<QueriedEpisode[]>): void {
        moveItemInArray(this.episodes, event.previousIndex, event.currentIndex);
        this.reorder(this.episodes);
    }

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

    private reorder(episodes: QueriedEpisode[]): void {
        episodes.forEach((episode, index) => {
            episode.rank = index;
        });
        this.performOrderMutation(episodes);
    }

    private performOrderMutation(episodes: QueriedEpisode[]): void {
        this.updateEpisodeOrder
            .mutate(
                {
                    episodeOrderData: episodes.map(({ id, rank }) => ({
                        id,
                        rank,
                    })),
                },
                {
                    update: (cache) => cache.evict({ fieldName: "source" }),
                }
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => this.onOrderMutationResult(result));
    }

    private onOrderMutationResult(
        result: MutationResult<DataEntryUpdateEpisodeMutation>
    ): void {
        const graphQLErrors = result.errors;
        const mutationErrors = result.data?.updateEpisode?.errors;

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
