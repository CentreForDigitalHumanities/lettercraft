import { Component, DestroyRef, Input, OnInit } from "@angular/core";
import {
    DataEntryRegionsGQL,
    DataEntrySettlementsGQL,
    DataEntryStructuresGQL,
    DataEntrySubspacesGQL,
    DataEntrySubspacesQuery,
} from "generated/graphql";
import { FormService } from "../../shared/form.service";
import { map, Observable, switchMap } from "rxjs";
import { actionIcons } from "@shared/icons";
import { FormControl, FormGroup } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

type SubspaceType = "region" | "settlement" | "structure";

interface Subspace {
    id: string;
    name: string;
}

let nextID = 0;

const subspaceNames: Record<SubspaceType, string> = {
    region: "Region",
    settlement: "Settlement",
    structure: "Structure",
};

type SubspaceDataKey = Exclude<
    keyof NonNullable<DataEntrySubspacesQuery["spaceDescription"]>,
    "__typename" | "id"
>;

const subspaceDataKeys: Record<SubspaceType, SubspaceDataKey> = {
    region: "regions",
    settlement: "settlements",
    structure: "structures",
};

@Component({
    selector: "lc-location-subspace-form",
    templateUrl: "./location-subspace-form.component.html",
    styleUrls: ["./location-subspace-form.component.scss"],
})
export class LocationSubspaceFormComponent implements OnInit {
    @Input({ required: true }) subspaceType!: SubspaceType;

    private id$ = this.formService.id$;

    public form = new FormGroup({
        selectedSubspaces: new FormControl<string[]>([], {
            nonNullable: true,
        }),
    });

    public subspaceName: string | null = null;
    public actionIcons = actionIcons;

    public allSubspaces: Subspace[] = [];
    public selectedSubspaces: Subspace[] = [];

    private formName = `${this.subspaceType}-form-${nextID++}`;
    private subspaceDataKey: SubspaceDataKey | null = null;

    get dropdownToggleID() {
        return this.formName + "-dropdown-toggle";
    }

    constructor(
        private destroyRef: DestroyRef,
        private formService: FormService,
        private subspaceQuery: DataEntrySubspacesGQL,
        private regionsQuery: DataEntryRegionsGQL,
        private settlementsQuery: DataEntrySettlementsGQL,
        private structuresQuery: DataEntryStructuresGQL
    ) {}

    ngOnInit(): void {
        this.subspaceDataKey = subspaceDataKeys[this.subspaceType];
        this.subspaceName = subspaceNames[this.subspaceType];

        // All subspace options
        this.allSubspacesQuery(this.subspaceType)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => (this.allSubspaces = result));

        // Selected subspace options for location
        this.id$
            .pipe(
                switchMap(
                    (id) => this.subspaceQuery.watch({ id }).valueChanges
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((result) => {
                const spaceDescription = result.data.spaceDescription;
                const dataKey = this.subspaceDataKey;
                if (!spaceDescription || !dataKey) {
                    return;
                }
                const selectedIds = spaceDescription[dataKey].map(
                    (subspace) => subspace.id
                );
                this.form.controls.selectedSubspaces.setValue(selectedIds);
            });

        // TODO: save selected subspace options
        this.form.valueChanges.pipe(
            map(() => this.form.getRawValue()),
        ).subscribe();
    }

    public addSubspace(id: string): void {
        const selectedSubspaces = this.form.controls.selectedSubspaces.value;
        this.form.controls.selectedSubspaces.setValue([
            ...selectedSubspaces,
            id,
        ]);
    }

    public removeSubspace(id: string): void {
        const selectedSubspaces =
            this.form.controls.selectedSubspaces.value.filter(
                (subspaceId) => subspaceId !== id
            );
        this.form.controls.selectedSubspaces.setValue(selectedSubspaces);
    }

    private allSubspacesQuery(subspace: SubspaceType): Observable<Subspace[]> {
        switch (subspace) {
            case "region":
                return this.regionsQuery
                    .watch()
                    .valueChanges.pipe(map((result) => result.data.regions));
            case "settlement":
                return this.settlementsQuery
                    .watch()
                    .valueChanges.pipe(
                        map((result) => result.data.settlements)
                    );
            case "structure":
                return this.structuresQuery
                    .watch()
                    .valueChanges.pipe(map((result) => result.data.structures));
        }
    }
}
