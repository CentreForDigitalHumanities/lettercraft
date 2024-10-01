import { Component, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastService } from '@services/toast.service';
import { MutationResult } from 'apollo-angular';
import {
    DataEntryAgentDescriptionGQL,
    DataEntryAgentDescriptionQuery,
    DataEntryUpdateAgentGQL,
    DataEntryUpdateAgentMutation,
    Gender,
    SourceMention,
    LocationsInSourceListGQL,
    LocationsInSourceListQuery,
    UpdateAgentInput,
} from 'generated/graphql';
import { Observable, map, switchMap, shareReplay, filter, debounceTime, distinctUntilChanged, withLatestFrom, BehaviorSubject, tap, skip } from 'rxjs';
import _ from 'underscore';
import { FormService } from '../../shared/form.service';
import { FormStatus } from '../../shared/types';
import { sourceMentionSelectOptions } from '../../shared/utils';


@Component({
    selector: 'lc-agent-description-form',
    templateUrl: './agent-description-form.component.html',
    styleUrls: ['./agent-description-form.component.scss'],
})
export class AgentDescriptionFormComponent implements OnDestroy {
    genderOptions: { value: Gender, label: string }[] = [
        { value: Gender.Female, label: 'Female' },
        { value: Gender.Male, label: 'Male' },
        { value: Gender.Other, label: 'Other' },
        { value: Gender.Mixed, label: 'Mixed (for groups)' },
        { value: Gender.Unknown, label: 'Unknown' }
    ];

    sourceMentionOptions = sourceMentionSelectOptions();

    form = new FormGroup({
        gender: new FormGroup({
            gender: new FormControl<string>(Gender.Unknown),
            sourceMention: new FormControl<SourceMention>(SourceMention.Direct),
            note: new FormControl<string>('', { updateOn: 'blur' }),
        }),
        location: new FormGroup({
            hasLocation: new FormControl<boolean>(false, { nonNullable: true }),
            location: new FormControl<string | null>(null),
            sourceMention: new FormControl<SourceMention>(SourceMention.Direct),
            note: new FormControl<string>('', { updateOn: 'blur' }),
        })
    });

    isGroup$: Observable<boolean>;
    locations$: Observable<LocationsInSourceListQuery>;

    status$ = new BehaviorSubject<FormStatus>('idle');

    private id$ = this.formService.id$;
    private data$: Observable<DataEntryAgentDescriptionQuery>;
    private formName = 'description';

    constructor(
        private agentQuery: DataEntryAgentDescriptionGQL,
        private locationsQuery: LocationsInSourceListGQL,
        private agentMutation: DataEntryUpdateAgentGQL,
        private toastService: ToastService,
        private formService: FormService,
    ) {
        this.formService.attachForm(this.formName, this.status$);
        this.data$ = this.id$.pipe(
            switchMap(id => this.agentQuery.watch({ id }).valueChanges),
            map(result => result.data),
            takeUntilDestroyed(),
            shareReplay(1),
        );
        this.isGroup$ = this.data$.pipe(
            map(result => result.agentDescription?.isGroup || false),
        );
        this.locations$ = this.data$.pipe(
            map(data => data.agentDescription?.source.id),
            filter(_.negate(_.isUndefined)),
            switchMap(id => this.locationsQuery.watch({ id }).valueChanges),
            map(result => result.data),
            shareReplay(1),
        );
        this.data$.subscribe(this.updateFormData.bind(this));

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

    updateFormData(data: DataEntryAgentDescriptionQuery) {
        this.form.setValue({
            gender: {
                gender: data.agentDescription?.gender?.gender || Gender.Unknown,
                sourceMention: data.agentDescription?.gender?.sourceMention || SourceMention.Direct,
                note: data.agentDescription?.gender?.note || '',
            },
            location: {
                hasLocation: data.agentDescription?.location !== null,
                location: data.agentDescription?.location?.location.id || null,
                sourceMention: data.agentDescription?.location?.sourceMention || SourceMention.Direct,
                note: data.agentDescription?.location?.note || '',
            }
        });
    }

    ngOnDestroy(): void {
        this.formService.detachForm(this.formName);
    }

    private isValid(): boolean {
        return this.form.valid;
    }

    private toMutationInput([data, id]: [Partial<typeof this.form.value>, string]): UpdateAgentInput {
        return {
            id,
            gender: {
                gender: data.gender?.gender as Gender,
                sourceMention: data.gender?.sourceMention as SourceMention,
                note: data.gender?.note,
            },
            location: data.location?.hasLocation && data.location.location ? {
                location: data.location.location,
                sourceMention: data.location.sourceMention as SourceMention,
                note: data.location.note,
            } : null,
        };
    }

    private makeMutation(input: UpdateAgentInput):
        Observable<MutationResult<DataEntryUpdateAgentMutation>> {
        return this.agentMutation.mutate({ input }, {
            errorPolicy: 'all',
            refetchQueries: [
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
