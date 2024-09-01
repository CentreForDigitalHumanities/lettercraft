import { Component, DestroyRef, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "@services/toast.service";
import {
    DataEntryGiftIdentificationGQL,
    DataEntryUpdateGiftGQL,
} from "generated/graphql";
import {
    map,
    switchMap,
    shareReplay,
    filter,
    debounceTime,
    withLatestFrom,
} from "rxjs";

@Component({
    selector: "lc-gift-identification-form",
    templateUrl: "./gift-identification-form.component.html",
    styleUrls: ["./gift-identification-form.component.scss"],
})
export class GiftIdentificationFormComponent implements OnInit {
    public id$ = this.route.params.pipe(map((params) => params["id"]));

    public gift$ = this.id$.pipe(
        switchMap((id) => this.giftQuery.watch({ id }).valueChanges),
        map((result) => result.data.giftDescription),
        shareReplay(1)
    );

    public form = new FormGroup({
        name: new FormControl("", {
            validators: [Validators.required],
            nonNullable: true,
        }),
        description: new FormControl("", {
            nonNullable: true,
        }),
    });

    constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private toastService: ToastService,
        private giftQuery: DataEntryGiftIdentificationGQL,
        private giftMutation: DataEntryUpdateGiftGQL
    ) {}

    ngOnInit(): void {
        this.gift$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((gift) => {
                if (!gift) {
                    return;
                }
                this.form.patchValue(gift, {
                    emitEvent: false,
                    onlySelf: true,
                });
            });

        this.gift$
            .pipe(
                switchMap(() =>
                    this.form.valueChanges.pipe(
                        map(() => this.form.getRawValue()),
                        filter(() => this.form.valid),
                        debounceTime(300),
                        withLatestFrom(this.id$),
                        switchMap(([gift, id]) =>
                            this.giftMutation.mutate(
                                {
                                    giftData: {
                                        ...gift,
                                        id,
                                    },
                                },
                                {
                                    update: (cache) => {
                                        cache.evict({
                                            id: `GiftDescriptionType:${id}`,
                                        });
                                        cache.gc();
                                    },
                                }
                            )
                        )
                    )
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((result) => {
                const errors = result.data?.updateGift?.errors;
                if (errors && errors.length > 0) {
                    this.toastService.show({
                        body: errors.map((e) => e.messages).join("\n"),
                        type: "danger",
                        header: "Update failed",
                    });
                }
            });
    }
}
