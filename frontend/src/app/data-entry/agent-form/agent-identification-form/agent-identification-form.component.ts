import { Component, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '@services/toast.service';
import { MutationResult } from 'apollo-angular';
import {
    DataEntryAgentIdentificationGQL, DataEntryAgentIdentificationQuery,
    DataEntryUpdateAgentGQL, DataEntryUpdateAgentMutation, UpdateAgentInput
} from 'generated/graphql';
import {
    map, switchMap, filter, debounceTime, withLatestFrom, Observable,
    distinctUntilChanged,
    tap,
    BehaviorSubject,
    skip
} from 'rxjs';
import _ from 'underscore';
import { FormService } from '../../shared/form.service';
import { FormStatus } from '../../shared/types';
import { ActivatedRoute } from '@angular/router';

interface FormData {
    name: string;
    description: string;
    isGroup: boolean;
}

@Component({
    selector: 'lc-agent-identification-form',
    templateUrl: './agent-identification-form.component.html',
    styleUrls: ['./agent-identification-form.component.scss'],
})
export class AgentIdentificationFormComponent implements OnDestroy {
    form = new FormGroup({
        name: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        description: new FormControl<string>('', { nonNullable: true }),
        isGroup: new FormControl<boolean>(false, { nonNullable: true }),
    });

    status$ = new BehaviorSubject<FormStatus>('idle');

    private id$ = this.route.params.pipe(map((params) => params["id"]));
    private formName = 'identification';

    constructor(
        private route: ActivatedRoute,
        private agentQuery: DataEntryAgentIdentificationGQL,
        private agentMutation: DataEntryUpdateAgentGQL,
        private toastService: ToastService,
        private formService: FormService,
    ) {
        this.formService.attachForm(this.formName, this.status$);

        this.id$.pipe(
            switchMap(id => this.agentQuery.watch({ id }).valueChanges),
            map(result => result.data),
            takeUntilDestroyed(),
        ).subscribe(this.updateFormData.bind(this));




        this.form.statusChanges.pipe(
            filter(status => status == 'INVALID'),
            takeUntilDestroyed(),
        ).subscribe(() => this.status$.next('invalid'));

        this.form.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(_.isEqual),
            skip(1),
            filter(this.isValid.bind(this)),
            tap(() => this.status$.next('loading')),
            withLatestFrom(this.id$),
            map(this.toMutationInput),
            switchMap(this.makeMutation.bind(this)),
            takeUntilDestroyed(),
        ).subscribe(this.onMutationResult.bind(this));
    }

    ngOnDestroy(): void {
        this.formService.detachForm(this.formName);
    }

    updateFormData(data: DataEntryAgentIdentificationQuery) {
        this.form.setValue({
            name: data.agentDescription?.name || '',
            description: data.agentDescription?.description || '',
            isGroup: data.agentDescription?.isGroup || false,
        });
    }

    private isValid(): boolean {
        return this.form.valid;
    }

    private toMutationInput([data, id]: [Partial<FormData>, string]): UpdateAgentInput {
        return { id, ...data };
    }

    private makeMutation(input: UpdateAgentInput):
        Observable<MutationResult<DataEntryUpdateAgentMutation>> {
        return this.agentMutation.mutate({ input }, {
            errorPolicy: 'all',
            refetchQueries: [
                'DataEntryAgent',
                'DataEntryAgentIdentification',
                'DataEntryAgentDescription'
            ],
        });
    }

    private onMutationResult(result: MutationResult<DataEntryUpdateAgentMutation>): void {
        if (result.errors?.length) {
            this.status$.next('error');
            const messages = result.errors.map(error => error.message);
            this.toastService.show({
                type: 'danger',
                header: 'Failed to save form',
                body: messages.join('\n\n'),
            });
        } else if (result.data?.updateAgent?.errors.length) {
            this.status$.next('error');
            const errors = result.data.updateAgent.errors;
            const messages = errors.map(error => `${error.field}: ${error.messages.join('\n')}`);
            this.toastService.show({
                type: 'danger',
                header: 'Failed to save form',
                body: messages.join('\n\n'),
            });
        } else {
            this.status$.next('saved');
        }
    }

}
