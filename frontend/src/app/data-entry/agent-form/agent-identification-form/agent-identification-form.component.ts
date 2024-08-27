import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { DataEntryAgentIdentificationGQL, DataEntryAgentIdentificationQuery, UpdateAgentIdentificationGQL, UpdateAgentIdentificationMutation, UpdateAgentInput, UpdateAgentMutation } from 'generated/graphql';
import { map, Subject, switchMap, filter, debounceTime, withLatestFrom } from 'rxjs';

interface FormData {
    name: string;
    description: string;
    isGroup: boolean;
}

@Component({
    selector: 'lc-agent-identification-form',
    templateUrl: './agent-identification-form.component.html',
    styleUrls: ['./agent-identification-form.component.scss']
})
export class AgentIdentificationFormComponent implements OnChanges, OnDestroy {
    @Input() id?: string;

    form = new FormGroup({
        name: new FormControl<string>('', { nonNullable: true }),
        description: new FormControl<string>('', { nonNullable: true }),
        isGroup: new FormControl<boolean>(false, { nonNullable: true }),
    }, {
        updateOn: 'blur'
    });

    private id$ = new Subject<string>();

    constructor(
        private agentQuery: DataEntryAgentIdentificationGQL,
        private agentMutation: UpdateAgentIdentificationGQL,
    ) {
        this.id$.pipe(
            switchMap(id => this.agentQuery.watch({ id }).valueChanges),
            map(result => result.data),
            takeUntilDestroyed(),
        ).subscribe(this.updateFormData.bind(this));

        this.form.valueChanges.pipe(
            filter(() => this.form.valid),
            debounceTime(500),
            withLatestFrom(this.id$),
            map(this.toMutationInput),
            switchMap(input => this.agentMutation.mutate({ input })),
            takeUntilDestroyed(),
        ).subscribe(this.onMutationResult.bind(this));
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['id'] && this.id) {
            this.id$.next(this.id);
        }
    }

    ngOnDestroy(): void {
        this.id$.complete();
    }

    updateFormData(data: DataEntryAgentIdentificationQuery) {
        this.form.setValue({
            name: data.agentDescription?.name || '',
            description: data.agentDescription?.description || '',
            isGroup: data.agentDescription?.isGroup || false,
        });
    }

    private toMutationInput([data, id]: [Partial<FormData>, string]): UpdateAgentInput {
        return { id, ...data };
    }

    private onMutationResult(result: any): void {
        console.log(result);
    }
}
