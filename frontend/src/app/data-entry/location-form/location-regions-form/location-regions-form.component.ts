import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { ToastService } from "@services/toast.service";
import { FormService } from "../../shared/form.service";
import {
    debounceTime,
    filter,
    map,
    Observable,
    share,
    switchMap,
    withLatestFrom,
} from "rxjs";
import {
    DataEntryLocationRegionsGQL,
    DataEntryRegionsGQL,
    DataEntryUpdateLocationGQL,
    DataEntryUpdateLocationMutation,
    DataEntryUpdateLocationMutationVariables,
    SpaceRegionTypeChoices,
} from "generated/graphql";
import { FormControl, FormGroup } from "@angular/forms";
import { formStatusSubject } from "../../shared/utils";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MutationResult } from "apollo-angular";
import { MultiselectOption } from "../../shared/multiselect/multiselect.component";

type LocationRegionsSpaceDescription = Required<
    Pick<DataEntryUpdateLocationMutationVariables["spaceData"], "regions">
>;

type LocationRegionsForm = {
    [K in keyof LocationRegionsSpaceDescription]: FormControl<
        LocationRegionsSpaceDescription[K]
    >;
};

const regionTypeIconMapping: Record<SpaceRegionTypeChoices, string> = {
    [SpaceRegionTypeChoices.Ecclesiastical]: "church",
    [SpaceRegionTypeChoices.Geographical]: "land",
    [SpaceRegionTypeChoices.Political]: "crown",
};

@Component({
    selector: "lc-location-regions-form",
    templateUrl: "./location-regions-form.component.html",
    styleUrls: ["./location-regions-form.component.scss"],
})
export class LocationRegionsFormComponent implements OnInit, OnDestroy {
    private id$ = this.formService.id$;

    private location$ = this.id$.pipe(
        switchMap((id) => this.locationQuery.watch({ id }).valueChanges),
        map((result) => result.data.spaceDescription),
        share()
    );

    public regionOptions$: Observable<MultiselectOption[]> = this.regionsQuery
        .fetch()
        .pipe(
            map((result) => result.data.regions),
            map((regions) =>
                regions.map(({ id, name, type }) => ({
                    value: id,
                    label: name,
                    icon: regionTypeIconMapping[type],
                }))
            )
        );

    public form = new FormGroup<LocationRegionsForm>({
        regions: new FormControl<string[]>([], {
            nonNullable: true,
        }),
    });

    private formName = "regions";
    private status$ = formStatusSubject();

    constructor(
        private destroyRef: DestroyRef,
        private formService: FormService,
        private toastService: ToastService,
        private locationQuery: DataEntryLocationRegionsGQL,
        private regionsQuery: DataEntryRegionsGQL,
        private updateLocation: DataEntryUpdateLocationGQL
    ) {}

    ngOnInit(): void {
        this.formService.attachForm(this.formName, this.status$);

        this.location$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((location) => {
                const regionIds = location?.regions.map((region) => region.id);
                this.form.patchValue({ regions: regionIds });
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
                switchMap(([agent, id]) => this.performMutation(agent, id)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((result) => this.onMutationResult(result));
    }

    ngOnDestroy(): void {
        this.formService.detachForm(this.formName);
    }

    private performMutation(
        form: LocationRegionsSpaceDescription,
        id: string
    ): Observable<MutationResult<DataEntryUpdateLocationMutation>> {
        return this.updateLocation.mutate({
            spaceData: {
                id,
                regions: form.regions,
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
