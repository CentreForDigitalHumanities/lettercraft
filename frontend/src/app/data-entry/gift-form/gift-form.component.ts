import { Component, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { ApolloCache } from "@apollo/client/core";
import { ModalService } from "@services/modal.service";
import { ToastService } from "@services/toast.service";
import { actionIcons, dataIcons } from "@shared/icons";
import {
    DataEntryDeleteGiftGQL,
    DataEntryGiftFormGQL,
    DataEntryGiftFormQuery,
} from "generated/graphql";
import { filter, map, share, switchMap } from "rxjs";
import { FormService } from "../shared/form.service";

type QueriedGift = NonNullable<DataEntryGiftFormQuery["giftDescription"]>;


@Component({
    selector: "lc-gift-form",
    templateUrl: "./gift-form.component.html",
    styleUrls: ["./gift-form.component.scss"],
    providers: [FormService],
})
export class GiftFormComponent {
    private id$ = this.formService.id$;

    public status$ = this.formService.status$;

    public gift$ = this.id$.pipe(
        switchMap((id) => this.giftQuery.watch({ id }).valueChanges),
        map((result) => result.data.giftDescription),
        share()
    );

    public breadcrumbs$ = this.gift$.pipe(
        filter((gift) => !!gift),
        map((gift) => {
            if (!gift) {
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
                    label: gift.source.name,
                    link: `/data-entry/sources/${gift.source.id}`,
                },
                {
                    label: gift.name,
                    link: `/data-entry/gifts/${gift.id}`,
                },
            ];
        })
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
        private giftQuery: DataEntryGiftFormGQL,
        private deleteGift: DataEntryDeleteGiftGQL
    ) {}

    public onClickDelete(gift: QueriedGift): void {
        this.modalService
            .openConfirmationModal({
                title: "Delete gift",
                message: `Are you sure you want to delete this gift? (${gift.name})`,
            })
            .then(() => this.performDelete(gift.id, gift.source.id))
            .catch(() => {
                // Do nothing on cancel / dismissal.
            });
    }

    private performDelete(giftId: string, sourceId: string): void {
        this.deletingInProgress = true;
        this.deleteGift
            .mutate(
                {
                    id: giftId,
                },
                {
                    update: (cache) => this.updateCache(cache, giftId),
                }
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                this.deletingInProgress = false;
                const errors = result.data?.deleteGift?.errors;
                if (errors && errors.length > 0) {
                    this.toastService.show({
                        body: errors.map((error) => error.messages).join("\n"),
                        type: "danger",
                        header: "Deletion failed",
                    });
                } else {
                    this.toastService.show({
                        body: "Gift deleted",
                        type: "success",
                        header: "Success",
                    });
                }
                this.router.navigate([`/data-entry/sources/${sourceId}`]);
            });
    }

    private updateCache(cache: ApolloCache<unknown>, giftId: string): void {
        const identified = cache.identify({
            __typename: "GiftDescriptionType",
            id: giftId,
        });
        cache.evict({ id: identified });
        cache.gc();
    }
}
