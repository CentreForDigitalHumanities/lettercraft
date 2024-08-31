import { Component, DestroyRef, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "@services/toast.service";
import { DataEntryAllLetterCategoriesGQL, DataEntryLetterCategoriesGQL, DataEntryUpdateLetterGQL } from "generated/graphql";
import {
    debounceTime,
    filter,
    map,
    Observable,
    share,
    switchMap,
    withLatestFrom,
} from "rxjs";
import { MultiselectOption } from "../../shared/multiselect/multiselect.component";

@Component({
    selector: "lc-letter-categories-form",
    templateUrl: "./letter-categories-form.component.html",
    styleUrls: ["./letter-categories-form.component.scss"],
})
export class LetterCategoriesFormComponent implements OnInit {
    public id$ = this.route.params.pipe(
        map((params) => params["id"]),
        share()
    );

    public letter$ = this.id$.pipe(
        switchMap((id) => this.letterQuery.watch({ id }).valueChanges),
        map((result) => result.data.letterDescription)
    );

    public form = new FormGroup({
        categories: new FormControl<string[]>([], {
            nonNullable: true,
        }),
    });

    public letterCategories$: Observable<MultiselectOption[]> =
        this.letterCategoriesQuery.watch().valueChanges.pipe(
            map((result) => result.data.letterCategories),
            map(categories => categories.map(category => ({
                value: category.id,
                label: category.label
            })))
        );

    constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private toastService: ToastService,
        private letterQuery: DataEntryLetterCategoriesGQL,
        private letterCategoriesQuery: DataEntryAllLetterCategoriesGQL,
        private letterMutation: DataEntryUpdateLetterGQL
    ) {}

    ngOnInit(): void {
        this.letter$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((letter) => {
                if (!letter) {
                    return;
                }
                const categoryIds = letter.categories.map(
                    (category) => category.id
                );
                this.form.patchValue({ categories: categoryIds });
            });

        this.form.valueChanges
            .pipe(
                map(() => this.form.getRawValue()),
                filter(() => this.form.valid),
                debounceTime(300),
                withLatestFrom(this.id$),
                switchMap(([letter, id]) =>
                    this.letterMutation.mutate({
                        letterData: {
                            ...letter,
                            id: id,
                        },
                    })
                )
            )
            .subscribe((result) => {
                const errors = result.data?.updateLetter?.errors;
                if (errors && errors.length > 0) {
                    this.toastService.show({
                        body: errors.map((error) => error.messages).join("\n"),
                        type: "danger",
                        header: "Update failed",
                    });
                }
            });
    }
}
