import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import {
    DataEntryLocationSettlementsGQL,
    DataEntrySettlementsGQL,
    DataEntrySettlementsQuery,
    DataEntryUpdateLocationGQL,
    DataEntryUpdateLocationMutation,
    DataEntryUpdateLocationMutationVariables,
} from "generated/graphql";
import { FormService } from "../../shared/form.service";
import { ToastService } from "@services/toast.service";
import {
    debounceTime,
    filter,
    map,
    Observable,
    share,
    switchMap,
    withLatestFrom,
} from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";
import { formStatusSubject } from "../../shared/utils";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MutationResult } from "apollo-angular";
import { MultiselectOption } from "../../shared/multiselect/multiselect.component";
import { faCity } from "@fortawesome/free-solid-svg-icons";

type LocationSettlementsSpaceDescription = Required<
    Pick<DataEntryUpdateLocationMutationVariables["spaceData"], "settlements">
>;

type LocationSettlementsForm = {
    [K in keyof LocationSettlementsSpaceDescription]: FormControl<
        LocationSettlementsSpaceDescription[K]
    >;
};

type QueriedSettlement = NonNullable<
    DataEntrySettlementsQuery["settlements"][number]
>;

@Component({
    selector: "lc-location-settlements-form",
    templateUrl: "./location-settlements-form.component.html",
    styleUrls: ["./location-settlements-form.component.scss"],
})
export class LocationSettlementsFormComponent implements OnInit, OnDestroy {
    private id$ = this.formService.id$;

    private location$ = this.id$.pipe(
        switchMap((id) => this.locationQuery.watch({ id }).valueChanges),
        map((result) => result.data.spaceDescription),
        share()
    );

    public settlementOptions$: Observable<MultiselectOption[]> =
        this.settlementsQuery.fetch().pipe(
            map((result) => result.data.settlements),
            map((settlements) =>
                settlements.map((settlement) => ({
                    value: settlement.id,
                    label: settlement.name,
                    icon: faCity,
                    dropdownLabel: this.formatDropdownLabel(settlement),
                }))
            )
        );

    public form = new FormGroup<LocationSettlementsForm>({
        settlements: new FormControl<string[]>([], {
            nonNullable: true,
        }),
    });

    private formName = "settlements";
    private status$ = formStatusSubject();

    private formatDropdownLabel(settlement: QueriedSettlement): string {
        const { name, regions } = settlement;
        let label = name;
        if (regions.length === 0) {
            return label;
        } else if (regions.length > 2) {
            return (label += ` (part of ${regions[0].name} and ${
                regions.length - 1
            } more)`);
        }
        return (label += ` (part of ${regions
            .map((region) => region.name)
            .join(", ")})`);
    }

    constructor(
        private destroyRef: DestroyRef,
        private formService: FormService,
        private toastService: ToastService,
        private locationQuery: DataEntryLocationSettlementsGQL,
        private settlementsQuery: DataEntrySettlementsGQL,
        private updateLocation: DataEntryUpdateLocationGQL
    ) {}

    ngOnInit(): void {
        this.formService.attachForm(this.formName, this.status$);

        this.location$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((location) => {
                const settlementIds = location?.settlements.map(
                    (settlement) => settlement.id
                );
                this.form.patchValue({ settlements: settlementIds });
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
        form: LocationSettlementsSpaceDescription,
        id: string
    ): Observable<MutationResult<DataEntryUpdateLocationMutation>> {
        return this.updateLocation.mutate({
            spaceData: {
                id,
                settlements: form.settlements,
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
