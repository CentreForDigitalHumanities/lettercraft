import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup, FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "@services/toast.service";
import {
    DataEntryGiftSourceTextGQL,
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
    BehaviorSubject,
    share,
} from "rxjs";
import { FormService } from "../../shared/form.service";
import { FormStatus } from "../../shared/types";
import { MutationResult } from "apollo-angular";

@Component({
    selector: "lc-gift-source-text-form",
    templateUrl: "./gift-source-text-form.component.html",
    styleUrls: ["./gift-source-text-form.component.scss"],
})
export class GiftSourceTextFormComponent implements OnInit, OnDestroy {
    private id$ = this.route.params.pipe(map((params) => params["id"]));

    public gift$ = this.id$.pipe(
        switchMap((id) => this.giftQuery.watch({ id }).valueChanges),
        map((result) => result.data.giftDescription),
        shareReplay(1)
    );

    public form = new FormGroup({
        designators: new FormControl<string[]>([], {
            nonNullable: true,
        }),
        book: new FormControl<string>("", {
            nonNullable: true,
        }),
        chapter: new FormControl<string>("", {
            nonNullable: true,
        }),
        page: new FormControl<string>("", {
            nonNullable: true,
        }),
    });

    private formName = "sourceText";
    private status$ = new BehaviorSubject<FormStatus>("idle");

    constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private formService: FormService,
        private toastService: ToastService,
        private giftQuery: DataEntryGiftSourceTextGQL,
        private giftMutation: DataEntryUpdateGiftGQL
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
                switchMap(([gift, id]) =>
                    this.giftMutation.mutate({
                        giftData: {
                            ...gift,
                            id,
                        },
                    })
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((result) => this.onMutationResult(result));
    }

    ngOnDestroy(): void {
        this.formService.detachForm(this.formName);
    }

    private onMutationResult(
        result: MutationResult<DataEntryUpdateGiftMutation>
    ): void {
        const errors = result.data?.updateGift?.errors;
        if (errors && errors.length > 0) {
            this.status$.next("error");
            this.toastService.show({
                body: errors.map((error) => error.messages).join("\n"),
                type: "danger",
                header: "Update failed",
            });
        }
        this.status$.next("saved");
    }
}
