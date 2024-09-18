import { Component, DestroyRef, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "@services/toast.service";
import {
    DataEntryLetterIdentificationGQL,
    DataEntryUpdateLetterGQL,
} from "generated/graphql";
import {
    debounceTime,
    filter,
    map,
    shareReplay,
    switchMap,
    withLatestFrom,
} from "rxjs/operators";

@Component({
    selector: "lc-letter-identification-form",
    templateUrl: "./letter-identification-form.component.html",
    styleUrls: ["./letter-identification-form.component.scss"],
})
export class LetterIdentificationFormComponent implements OnInit {
    public id$ = this.route.params.pipe(map((params) => params["id"]));

    public letter$ = this.id$.pipe(
        switchMap((id) => this.letterQuery.watch({ id }).valueChanges),
        map((result) => result.data.letterDescription),
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
        private letterQuery: DataEntryLetterIdentificationGQL,
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
                            this.letterMutation.mutate(
                                {
                                    letterData: {
                                        ...letter,
                                        id,
                                    },
                                },
                                {
                                    update: (cache) => {
                                        cache.evict({
                                            id: `LetterDescriptionType:${id}`,
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
                const errors = result.data?.updateLetter?.errors;
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
