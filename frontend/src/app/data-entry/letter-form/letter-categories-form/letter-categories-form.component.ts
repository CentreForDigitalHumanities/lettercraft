import { Component, DestroyRef } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "@services/toast.service";
import {
    DataEntryAllLetterCategoriesGQL,
    DataEntryLetterCategoriesGQL,
    DataEntryUpdateLetterGQL,
} from "generated/graphql";
import { map, Observable, share, switchMap } from "rxjs";
import { MultiselectOption } from "../../shared/multiselect/multiselect.component";

@Component({
    selector: "lc-letter-categories-form",
    templateUrl: "./letter-categories-form.component.html",
    styleUrls: ["./letter-categories-form.component.scss"],
})
export class LetterCategoriesFormComponent {
    public id$ = this.route.params.pipe(
        map((params) => params["id"]),
        share()
    );

    public letter$ = this.id$.pipe(
        switchMap((id) => this.letterQuery.watch({ id }).valueChanges),
        map((result) => result.data.letterDescription)
    );

    public form = new FormGroup({
        categorisations: new FormControl<string[]>([], {
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
                }))
            )
        );

    constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private toastService: ToastService,
        private letterQuery: DataEntryLetterCategoriesGQL,
        private letterCategoriesQuery: DataEntryAllLetterCategoriesGQL,
        private letterMutation: DataEntryUpdateLetterGQL
    ) {}
}
