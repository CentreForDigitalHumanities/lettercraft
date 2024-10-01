import { Component, DestroyRef, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "@services/toast.service";
import {
    DataEntryLetterSourceTextGQL,
    DataEntryUpdateLetterGQL,
} from "generated/graphql";
import {
    debounceTime,
    filter,
    map,
    shareReplay,
    switchMap,
    withLatestFrom,
} from "rxjs";

@Component({
    selector: "lc-letter-source-text-form",
    templateUrl: "./letter-source-text-form.component.html",
    styleUrls: ["./letter-source-text-form.component.scss"],
})
export class LetterSourceTextFormComponent implements OnInit {
    private id$ = this.route.params.pipe(map((params) => params["id"]));

    public letter$ = this.id$.pipe(
        switchMap((id) => this.letterQuery.watch({ id }).valueChanges),
        map((result) => result.data.letterDescription),
        shareReplay(1)
    );

    public form = new FormGroup({
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

    constructor(
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private toastService: ToastService,
        private letterQuery: DataEntryLetterSourceTextGQL,
        private letterMutation: DataEntryUpdateLetterGQL
    ) {}

    ngOnInit(): void {
        this.letter$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((letter) => {
                if (!letter) {
                    return;
                }
                this.form.patchValue(letter, {
                    emitEvent: false,
                    onlySelf: true,
                });
            });

        this.letter$
            .pipe(
                switchMap(() =>
                    this.form.valueChanges.pipe(
                        map(() => this.form.getRawValue()),
                        filter(() => this.form.valid),
                        debounceTime(300),
                        withLatestFrom(this.id$),
                        switchMap(([letter, id]) =>
                            this.letterMutation.mutate({
                                letterData: {
                                    ...letter,
                                    id,
                                },
                            })
                        )
                    )
                ),
                takeUntilDestroyed(this.destroyRef)
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
