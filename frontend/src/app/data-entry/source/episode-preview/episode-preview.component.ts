import {
    Component,
    DestroyRef,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ModalService } from "@services/modal.service";
import { ToastService } from "@services/toast.service";
import { dataIcons } from "@shared/icons";
import { agentIcon, locationIcon } from "@shared/icons-utils";
import { OrderChange } from "@shared/order-button-group/order-button-group.component";
import {
    DataEntryDeleteEpisodeGQL,
    DataEntrySourceDetailQuery,
} from "generated/graphql";

type QueriedEpisode = NonNullable<
    DataEntrySourceDetailQuery["source"]
>["episodes"][0];
@Component({
    selector: "lc-episode-preview",
    templateUrl: "./episode-preview.component.html",
    styleUrls: ["./episode-preview.component.scss"],
})
export class EpisodePreviewComponent {
    @Input({ required: true }) public episode!: QueriedEpisode;
    @Input() public isLast = false;
    @Input() public isFirst = false;
    @Output() public changeEpisodeOrder = new EventEmitter<OrderChange>();

    public dataIcons = dataIcons;

    agentIcon = agentIcon;
    locationIcon = locationIcon;

    constructor(
        private destroyRef: DestroyRef,
        private toastService: ToastService,
        private modalService: ModalService,
        private deleteEpisode: DataEntryDeleteEpisodeGQL
    ) {}

    public onClickDelete(episodeId: string): void {
        this.modalService
            .openConfirmationModal({
                title: "Delete episode",
                message: `Are you sure you want to delete this episode? (${this.episode.name})`,
            })
            .then(() => {
                this.performDelete(episodeId);
            })
            .catch(() => {
                // Do nothing on cancel / dismissal.
            });
    }

    private performDelete(episodeId: string): void {
        this.deleteEpisode
            .mutate(
                { id: episodeId },
                {
                    update: (cache) => cache.evict({ fieldName: "source" }),
                }
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                const errors = result.data?.deleteEpisode?.errors;
                if (errors && errors.length > 0) {
                    this.toastService.show({
                        body: errors.map((error) => error.messages).join("\n"),
                        type: "danger",
                        header: "Deletion failed",
                    });
                } else {
                    this.toastService.show({
                        body: "Episode deleted",
                        type: "success",
                        header: "Success",
                    });
                }
            });
    }
}
