import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup, FormControl } from "@angular/forms";
import { ToastService } from "@services/toast.service";
import { MutationResult } from "apollo-angular";
import {
    DataEntryLocationSourceTextGQL,
    DataEntryUpdateLocationGQL,
    DataEntryUpdateLocationMutation,
    DataEntryUpdateLocationMutationVariables,
} from "generated/graphql";
import {
    switchMap,
    map,
    shareReplay,
    BehaviorSubject,
    filter,
    debounceTime,
    share,
    withLatestFrom,
    Observable,
} from "rxjs";
import { FormService } from "../../shared/form.service";
import { FormStatus } from "../../shared/types";

interface LocationSourceText {
    book: string;
    chapter: string;
    page: string;
}

type LocationSourceTextForm = {
    [key in keyof LocationSourceText]: FormControl<string>;
};

@Component({
    selector: "lc-location-source-text-form",
    templateUrl: "./location-source-text-form.component.html",
    styleUrls: ["./location-source-text-form.component.scss"],
    standalone: false
})
export class LocationSourceTextFormComponent implements OnInit, OnDestroy {
    private id$ = this.formService.id$;

    public location$ = this.id$.pipe(
        switchMap((id) => this.spaceQuery.watch({ id }).valueChanges),
        map((result) => result.data.spaceDescription),
        shareReplay(1)
    );

    public form = new FormGroup<LocationSourceTextForm>({
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
        private spaceQuery: DataEntryLocationSourceTextGQL,
        private updateLocation: DataEntryUpdateLocationGQL
    ) {}

    ngOnInit(): void {
        this.formService.attachForm(this.formName, this.status$);

        this.location$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((location) => {
                if (!location) {
                    return;
                }
                this.form.patchValue(location, {
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

        const validFormSubmission$ = this.location$.pipe(
            switchMap(() =>
                this.form.valueChanges
            ),
            map(() => this.form.getRawValue()),
            filter(() => this.form.valid),
            debounceTime(300),
            share()
        );

        validFormSubmission$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.status$.next("loading"));

        validFormSubmission$
            .pipe(
                withLatestFrom(this.id$),
                switchMap(([location, id]) =>
                    this.performMutation(location, id)
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((result) => this.onMutationResult(result));
    }

    ngOnDestroy(): void {
        this.formService.detachForm(this.formName);
    }

    private performMutation(
        location: LocationSourceText,
        id: string
    ): Observable<MutationResult<DataEntryUpdateLocationMutation>> {
        return this.updateLocation.mutate({
            spaceData: {
                ...location,
                id,
            },
        });
    }

    private onMutationResult(
        result: MutationResult<DataEntryUpdateLocationMutation>
    ): void {
        const errors = result.data?.updateSpace?.errors;
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
