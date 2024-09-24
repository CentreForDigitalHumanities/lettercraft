import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup } from "@angular/forms";
import { ToastService } from "@services/toast.service";
import {
    DataEntryLetterSourceTextGQL,
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
    shareReplay,
    switchMap,
    withLatestFrom,
} from "rxjs";
import { FormService } from "../../shared/form.service";
import { FormStatus } from "../../shared/types";
import { MutationResult } from "apollo-angular";

interface LetterSourceText {
    designators: string[];
    book: string;
    chapter: string;
    page: string;
}

@Component({
    selector: "lc-letter-source-text-form",
    templateUrl: "./letter-source-text-form.component.html",
    styleUrls: ["./letter-source-text-form.component.scss"],
})
export class LetterSourceTextFormComponent implements OnInit, OnDestroy {
    private id$ = this.formService.id$;

    public letter$ = this.id$.pipe(
        switchMap((id) => this.letterQuery.watch({ id }).valueChanges),
        map((result) => result.data.letterDescription),
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
        private formService: FormService,
        private toastService: ToastService,
        private letterQuery: DataEntryLetterSourceTextGQL,
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
                this.form.patchValue(letter, {
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
                switchMap(([letter, id]) => this.performMutation(letter, id)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((result) => this.onMutationResult(result));
    }

    ngOnDestroy(): void {
        this.formService.detachForm(this.formName);
    }

    private performMutation(
        letterSourceText: LetterSourceText,
        id: string
    ): Observable<MutationResult<DataEntryUpdateLetterMutation>> {
        return this.updateLetter.mutate({
            letterData: {
                ...letterSourceText,
                id,
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
