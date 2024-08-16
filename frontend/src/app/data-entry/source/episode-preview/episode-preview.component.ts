import { Component, DestroyRef, Input } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ModalService } from "@services/modal.service";
import { ToastService } from "@services/toast.service";
import { dataIcons } from "@shared/icons";
import {
    DataEntryDeleteEpisodeGQL,
    DataEntrySourceDetailQuery,
} from "generated/graphql";

type QueriedEpisode = NonNullable<
    DataEntrySourceDetailQuery["source"]["episodes"]
>[0];

@Component({
    selector: "lc-episode-preview",
    templateUrl: "./episode-preview.component.html",
    styleUrls: ["./episode-preview.component.scss"],
})
export class EpisodePreviewComponent {
    @Input({ required: true })
    public episode!: QueriedEpisode;
    public dataIcons = dataIcons;

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
                confirmText: "Delete",
                cancelText: "Cancel",
                message: `Are you sure you want to delete this episode? (${this.episode.name})`,
            })
            .then((result) => {
                if (result) {
                    this.performDelete(episodeId);
                }
            });
    }

    public agentIcon(agent: QueriedEpisode["agents"][0]): string {
        if (agent.isGroup) {
            return dataIcons.group;
        }
        if (agent.describes?.some((person) => person?.identifiable)) {
            return dataIcons.person;
        }
        return dataIcons.personUnknown;
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
