import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastService } from "@services/toast.service";
import {
    DataEntryLetterIdentificationGQL,
    DataEntryUpdateLetterGQL,
    DataEntryUpdateLetterMutation,
    LetterDescriptionType,
} from "generated/graphql";
import { BehaviorSubject, Observable } from "rxjs";
import {
    debounceTime,
    filter,
    map,
    share,
    shareReplay,
    switchMap,
    withLatestFrom,
} from "rxjs/operators";
import { FormStatus } from "../../shared/types";
import { FormService } from "../../shared/form.service";
import { ApolloCache } from "@apollo/client/core";
import { MutationResult } from "apollo-angular";

interface LetterIdentification {
    name: string;
    description: string;
}
import { listWithQuotes, nameExamples } from "../../shared/utils";

@Component({
    selector: "lc-letter-identification-form",
    templateUrl: "./letter-identification-form.component.html",
    styleUrls: ["./letter-identification-form.component.scss"],
    standalone: false
})
export class LetterIdentificationFormComponent implements OnInit, OnDestroy {
    public id$ = this.formService.id$;

    public letter$ = this.id$.pipe(
        switchMap((id) => this.letterQuery.watch({ id }).valueChanges),
        map((result) => result.data.letterDescription),
        shareReplay(1)
    );

    public form = new FormGroup({
        name: new FormControl("", {
            validators: [Validators.required],
            nonNullable: true,
            updateOn: "blur",
        }),
        description: new FormControl("", {
            nonNullable: true,
            updateOn: "blur",
        }),
    });

    public nameExamples = listWithQuotes(nameExamples["letter"]);

    private formName = "identification";
    private status$ = new BehaviorSubject<FormStatus>("idle");

    constructor(
        private destroyRef: DestroyRef,
        private formService: FormService,
        private toastService: ToastService,
        private letterQuery: DataEntryLetterIdentificationGQL,
        private updateLetter: DataEntryUpdateLetterGQL
    ) {}

    ngOnInit(): void {
        this.formService.attachForm(this.formName, this.status$);

        this.letter$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(this.updateFormData.bind(this));

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
                    filter(() => this.form.valid),
                    debounceTime(300),
                    share()
                )
            )
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
        letter: LetterIdentification,
        id: string
    ): Observable<MutationResult<DataEntryUpdateLetterMutation>> {
        return this.updateLetter.mutate(
            {
                letterData: {
                    ...letter,
                    id,
                },
            },
            {
                update: (cache) => this.updateCache(cache, id),
            }
        );
    }

    private onMutationResult(
        result: MutationResult<DataEntryUpdateLetterMutation>
    ): void {
        const errors = result.data?.updateLetter?.errors;
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
            __typename: "LetterDescriptionType",
            id,
        });
        cache.evict({ id: identified });
        cache.gc();
    }

    private updateFormData(
        letter: Partial<LetterDescriptionType> | null | undefined
    ) {
        if (!letter) {
            return;
        }
        this.form.patchValue(letter, {
            emitEvent: false,
            onlySelf: true,
        });
    }
}
