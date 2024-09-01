import { Component, DestroyRef } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "@services/toast.service";
import {
    DataEntryGiftCategoriesGQL,
    DataEntryAllGiftCategoriesGQL,
    DataEntryUpdateGiftGQL,
} from "generated/graphql";
import { map, share, switchMap, Observable } from "rxjs";
import { MultiselectOption } from "../../shared/multiselect/multiselect.component";

@Component({
    selector: "lc-gift-categories-form",
    templateUrl: "./gift-categories-form.component.html",
    styleUrls: ["./gift-categories-form.component.scss"],
})
export class GiftCategoriesFormComponent {
    public id$ = this.route.params.pipe(
        map((params) => params["id"]),
        share()
    );

    public letter$ = this.id$.pipe(
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

    constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private toastService: ToastService,
        private giftQuery: DataEntryGiftCategoriesGQL,
        private giftCategoriesQuery: DataEntryAllGiftCategoriesGQL,
        private giftMutation: DataEntryUpdateGiftGQL
    ) {}
}
