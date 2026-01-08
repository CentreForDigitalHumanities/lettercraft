import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ToastService } from "@services/toast.service";
import {
    DataEntryAllLetterCategoriesGQL,
    DataEntryLetterCategoriesGQL,
    DataEntryUpdateLetterGQL,
    DataEntryUpdateLetterMutation,
} from "generated/graphql";
import {
    BehaviorSubject,
    debounceTime,
    filter,
    map,
    Observable,
    share,
    switchMap,
    withLatestFrom,
} from "rxjs";
import { MultiselectOption } from "../../shared/multiselect/multiselect.component";
import { FormStatus } from "../../shared/types";
import { FormService } from "../../shared/form.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MutationResult } from "apollo-angular";

interface LetterCategories {
    categories: string[];
}

type LetterCategoriesForm = {
    [key in keyof LetterCategories]: FormControl<string[]>;
};

@Component({
    selector: "lc-letter-categories-form",
    templateUrl: "./letter-categories-form.component.html",
    styleUrls: ["./letter-categories-form.component.scss"],
    standalone: false
})
export class LetterCategoriesFormComponent implements OnInit, OnDestroy {
    private id$ = this.formService.id$;

    public letter$ = this.id$.pipe(
        switchMap((id) => this.letterQuery.watch({ id }).valueChanges),
        map((result) => result.data.letterDescription)
    );

    public form = new FormGroup<LetterCategoriesForm>({
        categories: new FormControl<string[]>([], {
            nonNullable: true,
        }),
    });

    public letterCategories$: Observable<MultiselectOption[]> =
        this.letterCategoriesQuery.watch().valueChanges.pipe(
            map((result) => result.data.letterCategories),
            map((categories) =>
                categories.map((category) => ({
                    value: category.id,
                    label: category.label,
                    description: category.description,
                }))
            )
        );

    private formName = "categories";
    private status$ = new BehaviorSubject<FormStatus>("idle");

    constructor(
        private destroyRef: DestroyRef,
        private formService: FormService,
        private toastService: ToastService,
        private letterQuery: DataEntryLetterCategoriesGQL,
        private letterCategoriesQuery: DataEntryAllLetterCategoriesGQL,
        private updateLetter: DataEntryUpdateLetterGQL
    ) {}

    ngOnInit(): void {
        this.formService.attachForm(this.formName, this.status$);

        this.letter$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((letter) => {
                if (!letter) {
                    return;
                }
                this.form.controls.categories.setValue(
                    letter.categories.map((category) => category.id)
                );
            });

        this.form.statusChanges
            .pipe(
                filter((status) => status == "INVALID"),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => this.status$.next("invalid"));

        const validFormSubmission$ = this.letter$.pipe(
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
                switchMap(([form, id]) => this.performMutation(form, id)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((result) => this.onMutationResult(result));
    }

    ngOnDestroy(): void {
        this.formService.detachForm(this.formName);
    }

    private performMutation(
        form: LetterCategories,
        id: string
    ): Observable<MutationResult<DataEntryUpdateLetterMutation>> {
        return this.updateLetter.mutate({
            letterData: {
                id,
                categories: form.categories,
            },
        });
    }

    private onMutationResult(
        result: MutationResult<DataEntryUpdateLetterMutation>
    ): void {
        const errors = result.data?.updateLetter?.errors;
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
