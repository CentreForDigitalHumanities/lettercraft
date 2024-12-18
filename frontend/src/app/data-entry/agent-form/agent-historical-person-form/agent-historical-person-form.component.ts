import { Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
import { FormService } from "../../shared/form.service";
import {
    DataEntryAgentHistoricalPersonGQL,
    DataEntryHistoricalPersonsGQL,
    DataEntryUpdateAgentGQL,
    DataEntryUpdateAgentMutation,
} from "generated/graphql";
import {
    combineLatest,
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
import { MultiselectOption } from "../../shared/multiselect/multiselect.component";
import { MutationResult } from "apollo-angular";
import { ToastService } from "@services/toast.service";

interface HistoricalPerson {
    describes: string[];
}

type HistoricalPersonForm = {
    [key in keyof HistoricalPerson]: FormControl<string[]>;
};

@Component({
    selector: "lc-agent-historical-person-form",
    templateUrl: "./agent-historical-person-form.component.html",
    styleUrls: ["./agent-historical-person-form.component.scss"],
})
export class AgentHistoricalPersonFormComponent implements OnInit, OnDestroy {
    private id$ = this.formService.id$;

    private agent$ = this.id$.pipe(
        switchMap((id) => this.agentQuery.watch({ id }).valueChanges),
        map((result) => result.data.agentDescription),
        share()
    );

    private allHistoricalPersons$ = this.historicalPersonsQuery
        .fetch()
        .pipe(map((result) => result.data.historicalPersons));

    public historicalPersonOptions$: Observable<MultiselectOption[]> =
        this.allHistoricalPersons$.pipe(
            map((persons) =>
                persons.map((person) => ({
                    value: person.id,
                    label: `${person.name} (${
                        person.dateOfBirth?.displayDate ?? " ?"
                    } – ${person.dateOfDeath?.displayDate ?? "? "})`,
                }))
            )
        );

    public isGroup$ = this.agent$.pipe(
        map((agent) => agent?.isGroup ?? false),
        share()
    );

    public form = new FormGroup<HistoricalPersonForm>({
        describes: new FormControl<string[]>([], { nonNullable: true }),
    });

    private formName = "historicalPersons";
    private status$ = formStatusSubject();

    constructor(
        private destroyRef: DestroyRef,
        private formService: FormService,
        private toastService: ToastService,
        private agentQuery: DataEntryAgentHistoricalPersonGQL,
        private historicalPersonsQuery: DataEntryHistoricalPersonsGQL,
        private updateAgent: DataEntryUpdateAgentGQL
    ) {}

    ngOnInit(): void {
        this.formService.attachForm(this.formName, this.status$);

        this.agent$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((agent) => {
                const historicalPersonIds = agent?.describes.map(
                    (person) => person.id
                );
                this.form.patchValue({ describes: historicalPersonIds });
            });

        this.form.statusChanges
            .pipe(
                filter((status) => status === "INVALID"),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => this.status$.next("invalid"));

        const validFormSubmission$ = this.agent$.pipe(
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
        form: HistoricalPerson,
        id: string
    ): Observable<MutationResult<DataEntryUpdateAgentMutation>> {
        return this.updateAgent.mutate({
            input: {
                id,
                describes: form.describes,
            },
        }, {
            // Refetch the form with the isGroup control to update validation.
            refetchQueries: ["DataEntryAgentIdentification"],
        });
    }

    private onMutationResult(
        result: MutationResult<DataEntryUpdateAgentMutation>
    ): void {
        const errors = result.data?.updateAgent?.errors;
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
