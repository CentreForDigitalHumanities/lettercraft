import { Component, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { ApolloCache } from "@apollo/client/core";
import { ModalService } from "@services/modal.service";
import { ToastService } from "@services/toast.service";
import { actionIcons, dataIcons } from "@shared/icons";
import {
    DataEntryDeleteLetterGQL,
    DataEntryLetterFormGQL,
    DataEntryLetterFormQuery,
} from "generated/graphql";
import { map, share, switchMap } from "rxjs";
import { FormService } from "../shared/form.service";
import { Breadcrumb } from "@shared/breadcrumb/breadcrumb.component";

type QueriedLetter = NonNullable<DataEntryLetterFormQuery["letterDescription"]>;

@Component({
    selector: "lc-letter-form",
    templateUrl: "./letter-form.component.html",
    styleUrls: ["./letter-form.component.scss"],
    providers: [FormService],
})
export class LetterFormComponent {
    public id$ = this.formService.id$;

    public status$ = this.formService.status$;

    public data$ = this.id$.pipe(
        switchMap((id) => this.letterQuery.watch({ id }).valueChanges),
        map((result) => result.data),
        share()
    );

    public dataIcons = dataIcons;
    public actionIcons = actionIcons;
    public deletingInProgress = false;

    constructor(
        private destroyRef: DestroyRef,
        private router: Router,
        private formService: FormService,
        private toastService: ToastService,
        private modalService: ModalService,
        private letterQuery: DataEntryLetterFormGQL,
        private deleteLetter: DataEntryDeleteLetterGQL
    ) {}

    public getBreadcrumbs(data: DataEntryLetterFormQuery): Breadcrumb[] {
        if (!data.letterDescription) {
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
                label: data.letterDescription.source.name,
                link: `/data-entry/sources/${data.letterDescription.source.id}`,
            },
            {
                label: data.letterDescription.name,
                link: `/data-entry/letters/${data.letterDescription.id}`,
            },
        ];
    }

    public onClickDelete(letter: QueriedLetter): void {
        this.modalService
            .openConfirmationModal({
                title: "Delete letter",
                message: `Are you sure you want to delete this letter? (${letter.name})`,
            })
            .then(() => this.performDelete(letter.id, letter.source.id))
            .catch(() => {
                // Do nothing on cancel / dismissal.
            });
    }

    private performDelete(letterId: string, sourceId: string): void {
        this.deletingInProgress = true;
        this.deleteLetter
            .mutate(
                {
                    id: letterId,
                },
                {
                    update: (cache) => this.updateCache(cache, letterId),
                }
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                this.deletingInProgress = false;
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
                this.router.navigate([`/data-entry/sources/${sourceId}`]);
            });
    }

    private updateCache(cache: ApolloCache<unknown>, letterId: string): void {
        const identified = cache.identify({
            __typename: "LetterDescriptionType",
            id: letterId,
        });
        cache.evict({ id: identified });
        cache.gc();
    }
}
