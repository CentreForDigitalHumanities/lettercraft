import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "@services/toast.service";
import {
    DataEntryGiftCategoriesGQL,
    DataEntryAllGiftCategoriesGQL,
    DataEntryUpdateGiftGQL,
    DataEntryUpdateGiftMutation,
} from "generated/graphql";
import {
    map,
    share,
    switchMap,
    Observable,
    BehaviorSubject,
    filter,
    debounceTime,
    withLatestFrom,
} from "rxjs";
import { MultiselectOption } from "../../shared/multiselect/multiselect.component";
import { FormStatus } from "../../shared/types";
import { FormService } from "../../shared/form.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MutationResult } from "apollo-angular";

@Component({
    selector: "lc-gift-categories-form",
    templateUrl: "./gift-categories-form.component.html",
    styleUrls: ["./gift-categories-form.component.scss"],
})
export class GiftCategoriesFormComponent implements OnInit, OnDestroy {
    private id$ = this.route.params.pipe(
        map((params) => params["id"]),
        share()
    );

    public gift$ = this.id$.pipe(
        switchMap((id) => this.giftQuery.watch({ id }).valueChanges),
        map((result) => result.data.giftDescription)
    );

    public form = new FormGroup({
        categorisations: new FormControl<string[]>([], {
            nonNullable: true,
        }),
    });

    public giftCategories$: Observable<MultiselectOption[]> =
        this.giftCategoriesQuery.watch().valueChanges.pipe(
            map((result) => result.data.letterCategories),
            map((categories) =>
                categories.map((category) => ({
                    value: category.id,
                    label: category.label,
                }))
            )
        );

    private formName = "categories";
    private status$ = new BehaviorSubject<FormStatus>("idle");

    constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private formService: FormService,
        private toastService: ToastService,
        private giftQuery: DataEntryGiftCategoriesGQL,
        private giftCategoriesQuery: DataEntryAllGiftCategoriesGQL,
        private updateGift: DataEntryUpdateGiftGQL
    ) {}

    ngOnInit(): void {
        this.formService.attachForm(this.formName, this.status$);

        this.gift$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((letter) => {
                if (!letter) {
                    return;
                }
                // TODO: patch form with gift data.
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
                switchMap(([letter, id]) => this.performMutation(letter, id)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((result) => this.onMutationResult(result));
    }

    ngOnDestroy(): void {
        this.formService.detachForm(this.formName);
    }

    private performMutation(
        giftCategories: unknown,
        id: string
    ): Observable<MutationResult<DataEntryUpdateGiftMutation>> {
        return this.updateGift.mutate({
            giftData: {
                // ...Add letterCategory data here
                id,
            },
        });
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
