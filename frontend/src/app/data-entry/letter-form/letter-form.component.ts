import { Component, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { ModalService } from "@services/modal.service";
import { ToastService } from "@services/toast.service";
import { actionIcons, dataIcons } from "@shared/icons";
import {
    DataEntryDeleteLetterGQL,
    DataEntryLetterFormGQL,
    DataEntryUpdateLetterGQL,
} from "generated/graphql";
import { filter, map, share, switchMap } from "rxjs";

@Component({
    selector: "lc-letter-form",
    templateUrl: "./letter-form.component.html",
    styleUrls: ["./letter-form.component.scss"],
})
export class LetterFormComponent {
    private id$ = this.route.params.pipe(map((params) => params["id"]));

    public letter$ = this.id$.pipe(
        switchMap((id) => this.letterQuery.watch({ id }).valueChanges),
        map((result) => result.data.letterDescription),
        share()
    );

    public breadcrumbs$ = this.letter$.pipe(
        filter((letter) => !!letter),
        map((letter) => {
            if (!letter) {
                return [];
            }
            return [
                {
                    label: "Lettercraft",
                    link: "/",
                },
                {
                    label: "Data entry",
                    link: "/data-entry",
                },
                {
                    label: letter.source.name,
                    link: `/data-entry/sources/${letter.source.id}`,
                },
                {
                    label: letter.name,
                    link: `/data-entry/letters/${letter.id}`,
                },
            ];
        })
    );

    public dataIcons = dataIcons;
    public actionIcons = actionIcons;

    constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private toastService: ToastService,
        private modalService: ModalService,
        private letterQuery: DataEntryLetterFormGQL,
        private deleteLetter: DataEntryDeleteLetterGQL
    ) {}

    public onClickDelete(letterId: string, letterName: string): void {
        this.modalService
            .openConfirmationModal({
                title: "Delete letter",
                message: `Are you sure you want to delete this letter? (${letterName})`,
            })
            .then(() => this.performDelete(letterId))
            .catch(() => {
                // Do nothing on cancel / dismissal.
            });
    }

    private performDelete(letterId: string): void {
        this.deleteLetter
            .mutate(
                {
                    id: letterId,
                },
                {
                    update: (cache) => cache.evict({ fieldName: "letter" }),
                }
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                const errors = result.data?.deleteLetter?.errors;
                if (errors && errors.length > 0) {
                    this.toastService.show({
                        body: errors.map((error) => error.messages).join("\n"),
                        type: "danger",
                        header: "Deletion failed",
                    });
                } else {
                    this.toastService.show({
                        body: "Letter deleted",
                        type: "success",
                        header: "Success",
                    });
                }
            });
    }
}
