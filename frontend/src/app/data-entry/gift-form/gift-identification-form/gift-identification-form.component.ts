import { Component, DestroyRef, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ApolloCache } from "@apollo/client/core";
import { ToastService } from "@services/toast.service";
import { MutationResult } from "apollo-angular";
import {
    DataEntryGiftIdentificationGQL,
    DataEntryUpdateGiftGQL,
    DataEntryUpdateGiftMutation,
} from "generated/graphql";
import {
    map,
    switchMap,
    shareReplay,
    filter,
    debounceTime,
    withLatestFrom,
    Observable,
} from "rxjs";

interface GiftIdentification {
    name: string;
    description: string;
}

type GiftIdentificationForm = {
    [key in keyof GiftIdentification]: FormControl<string>;
};

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

    public form = new FormGroup<GiftIdentificationForm>({
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
                            this.performMutation(gift, id)
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

    private performMutation(
        gift: GiftIdentification,
        id: string
    ): Observable<MutationResult<DataEntryUpdateGiftMutation>> {
        return this.giftMutation.mutate(
            {
                giftData: {
                    ...gift,
                    id,
                },
            },
            {
                update: (cache) => this.updateCache(cache, id),
            }
        );
    }

    private updateCache(cache: ApolloCache<unknown>, id: string): void {
        cache.evict({
            id: `GiftDescriptionType:${id}`,
        });
        cache.gc();
    }
}
