import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
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
    BehaviorSubject,
    share,
} from "rxjs";
import { FormStatus } from "../../shared/types";
import { FormService } from "../../shared/form.service";

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
export class GiftIdentificationFormComponent implements OnInit, OnDestroy {
    private id$ = this.route.params.pipe(map((params) => params["id"]));

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

    private formName = "identification";
    private status$ = new BehaviorSubject<FormStatus>("idle");

    constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private formService: FormService,
        private toastService: ToastService,
        private giftQuery: DataEntryGiftIdentificationGQL,
        private updateGift: DataEntryUpdateGiftGQL
    ) {}

    ngOnInit(): void {
        this.formService.attachForm(this.formName, this.status$);

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

        this.form.statusChanges
            .pipe(
                filter((status) => status == "INVALID"),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => this.status$.next("invalid"));

        const validFormSubmission$ = this.gift$.pipe(
            switchMap(() =>
                this.form.valueChanges.pipe(
                    map(() => this.form.getRawValue()),
                    filter(() => this.form.valid)
                )
            ),
            debounceTime(300),
            share()
        );

        validFormSubmission$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.status$.next("loading"));

        validFormSubmission$
            .pipe(
                withLatestFrom(this.id$),
                switchMap(([gift, id]) => this.performMutation(gift, id)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((result) => this.onMutationResult(result));
    }

    ngOnDestroy(): void {
        this.formService.detachForm(this.formName);
    }

    private performMutation(
        gift: GiftIdentification,
        id: string
    ): Observable<MutationResult<DataEntryUpdateGiftMutation>> {
        return this.updateGift.mutate(
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

    private onMutationResult(
        result: MutationResult<DataEntryUpdateGiftMutation>
    ): void {
        const errors = result.data?.updateGift?.errors;
        if (errors && errors.length > 0) {
            this.status$.next("error");
            this.toastService.show({
                body: errors.map((e) => e.messages).join("\n"),
                type: "danger",
                header: "Update failed",
            });
        }
        this.status$.next("saved");
    }

    private updateCache(cache: ApolloCache<unknown>, id: string): void {
        const identified = cache.identify({
            __typename: "GiftDescriptionType",
            id,
        });
        cache.evict({ id: identified });
        cache.gc();
    }
}
