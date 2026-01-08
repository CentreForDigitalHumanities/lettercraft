import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup, FormControl } from "@angular/forms";
import { ToastService } from "@services/toast.service";
import { MutationResult } from "apollo-angular";
import {
    DataEntryLocationStructuresGQL,
    DataEntryStructuresGQL,
    DataEntryStructuresQuery,
    DataEntryUpdateLocationGQL,
    DataEntryUpdateLocationMutation,
    DataEntryUpdateLocationMutationVariables,
    SpaceStructureLevelChoices,
} from "generated/graphql";
import {
    switchMap,
    map,
    share,
    filter,
    debounceTime,
    withLatestFrom,
    Observable,
} from "rxjs";
import { FormService } from "../../shared/form.service";
import { formStatusSubject } from "../../shared/utils";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faChessRook, faHouse, faLocationCrosshairs, faPersonShelter, faRoad } from "@fortawesome/free-solid-svg-icons";
import { MultiselectOption } from "../../shared/multiselect/multiselect.component";

type LocationStructuresSpaceDescription = Required<
    Pick<DataEntryUpdateLocationMutationVariables["spaceData"], "structures">
>;

type LocationStructuresForm = {
    [K in keyof LocationStructuresSpaceDescription]: FormControl<
        LocationStructuresSpaceDescription[K]
    >;
};

type QueriedStructure = NonNullable<
    DataEntryStructuresQuery["structures"][number]
>;

const structureTypeIconMapping: Record<SpaceStructureLevelChoices, IconDefinition> = {
    [SpaceStructureLevelChoices.A_1]: faRoad,
    [SpaceStructureLevelChoices.A_2]: faChessRook,
    [SpaceStructureLevelChoices.A_3]: faHouse,
    [SpaceStructureLevelChoices.A_4]: faPersonShelter,
    [SpaceStructureLevelChoices.A_5]: faLocationCrosshairs,
};

@Component({
    selector: "lc-location-structures-form",
    templateUrl: "./location-structures-form.component.html",
    styleUrls: ["./location-structures-form.component.scss"],
    standalone: false
})
export class LocationStructuresFormComponent implements OnInit, OnDestroy {
    private id$ = this.formService.id$;

    private location$ = this.id$.pipe(
        switchMap((id) => this.locationQuery.watch({ id }).valueChanges),
        map((result) => result.data.spaceDescription),
        share()
    );

    public structureOptions$: Observable<MultiselectOption[]> = this.structuresQuery.fetch().pipe(
        map((result) => result.data.structures),
        map((structures) =>
            structures.map((structure) => ({
                value: structure.id,
                label: structure.name,
                icon: structureTypeIconMapping[structure.level],
                dropdownLabel: this.formatDropdownLabel(structure),
            }))
        )
    );

    public form = new FormGroup<LocationStructuresForm>({
        structures: new FormControl<string[]>([], {
            nonNullable: true,
        }),
    });

    private formName = "structures";
    private status$ = formStatusSubject();

    private formatDropdownLabel(structure: QueriedStructure): string {
        if (!structure.settlement) {
            return structure.name;
        }
        return `${structure.name} (part of ${structure.settlement.name})`;
    }

    constructor(
        private destroyRef: DestroyRef,
        private formService: FormService,
        private toastService: ToastService,
        private locationQuery: DataEntryLocationStructuresGQL,
        private structuresQuery: DataEntryStructuresGQL,
        private updateLocation: DataEntryUpdateLocationGQL
    ) {}

    ngOnInit(): void {
        this.formService.attachForm(this.formName, this.status$);

        this.location$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((location) => {
                const structureIds = location?.structures.map(
                    (structure) => structure.id
                );
                this.form.patchValue({ structures: structureIds });
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
        form: LocationStructuresSpaceDescription,
        id: string
    ): Observable<MutationResult<DataEntryUpdateLocationMutation>> {
        return this.updateLocation.mutate({
            spaceData: {
                id,
                structures: form.structures,
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
