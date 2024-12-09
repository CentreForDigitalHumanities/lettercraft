import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApolloCache } from "@apollo/client/core";
import { ToastService } from "@services/toast.service";
import { MutationResult } from "apollo-angular";
import {
    DataEntryLocationIdentificationGQL,
    DataEntryUpdateLocationGQL,
    DataEntryUpdateLocationMutation,
} from "generated/graphql";
import {
    map,
    switchMap,
    shareReplay,
    filter,
    debounceTime,
    withLatestFrom,
    Observable,
    BehaviorSubject,
    share,
} from "rxjs";
import { FormService } from "../../shared/form.service";
import { FormStatus } from "../../shared/types";
import { listWithQuotes, nameExamples } from "../../shared/utils";

interface LocationIdentification {
    name: string;
    description: string;
}

type LocationIdentificationForm = {
    [key in keyof LocationIdentification]: FormControl<string>;
};

@Component({
    selector: "lc-location-identification-form",
    templateUrl: "./location-identification-form.component.html",
    styleUrls: ["./location-identification-form.component.scss"],
})
export class LocationIdentificationFormComponent implements OnInit, OnDestroy {
    public id$ = this.formService.id$;

    public location$ = this.id$.pipe(
        switchMap((id) => this.locationQuery.watch({ id }).valueChanges),
        map((result) => result.data.spaceDescription),
        shareReplay(1)
    );

    public form = new FormGroup<LocationIdentificationForm>({
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

    public listWithQuotes = listWithQuotes;
    public nameExamples = nameExamples;

    private formName = "identification";
    private status$ = new BehaviorSubject<FormStatus>("idle");

    constructor(
        private destroyRef: DestroyRef,
        private formService: FormService,
        private toastService: ToastService,
        private locationQuery: DataEntryLocationIdentificationGQL,
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
                filter((status) => status === "INVALID"),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => this.status$.next("invalid"));

        const validFormSubmission$ = this.location$.pipe(
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
                switchMap(([episode, id]) => this.performMutation(episode, id)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((result) => this.onMutationResult(result));
    }

    ngOnDestroy(): void {
        this.formService.detachForm(this.formName);
    }

    private performMutation(
        location: LocationIdentification,
        id: string
    ): Observable<MutationResult<DataEntryUpdateLocationMutation>> {
        return this.updateLocation.mutate(
            {
                spaceData: {
                    ...location,
                    id,
                },
            },
            {
                update: (cache) => this.updateCache(cache, id),
            }
        );
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

    private updateCache(cache: ApolloCache<unknown>, id: string): void {
        cache.evict({
            id: `SpaceDescriptionType:${id}`,
        });
        cache.gc();
    }
}
