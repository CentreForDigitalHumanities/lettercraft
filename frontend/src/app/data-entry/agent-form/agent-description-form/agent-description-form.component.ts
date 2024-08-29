import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
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
    PersonAgentDescriptionGenderGenderChoices as GenderChoices,
    PersonAgentDescriptionGenderSourceMentionChoices as GenderSourceMentionChoices,
    LocationsInSourceListGQL,
    LocationsInSourceListQuery,
    PersonAgentDescriptionSourceMentionChoices as LocationSourceMentionChoices,
    SourceMention,
    UpdateAgentInput,
} from 'generated/graphql';
import { Observable, map, switchMap, shareReplay, filter, debounceTime, distinctUntilChanged, withLatestFrom, BehaviorSubject, tap } from 'rxjs';
import _ from 'underscore';
import { AgentFormService } from '../agent-form.service';
import { FormStatus } from '../../shared/types';


@Component({
    selector: 'lc-agent-description-form',
    templateUrl: './agent-description-form.component.html',
    styleUrls: ['./agent-description-form.component.scss'],
})
export class AgentDescriptionFormComponent implements OnDestroy {
    genderOptions: { value: GenderChoices, label: string }[] = [
        { value: GenderChoices.Female, label: 'Female' },
        { value: GenderChoices.Male, label: 'Male' },
        { value: GenderChoices.Other, label: 'Other' },
        { value: GenderChoices.Mixed, label: 'Mixed (for groups)' },
        { value: GenderChoices.Unknown, label: 'Unknown' }
    ];

    genderSourceMentionOptions: { value: GenderSourceMentionChoices, label: string }[] = [
        { value: GenderSourceMentionChoices.Direct, label: 'Mentioned' },
        { value: GenderSourceMentionChoices.Implied, label: 'Implied' },
    ];

    locationSourceMentionOptions: { value: LocationSourceMentionChoices, label: string }[] = [
        { value: LocationSourceMentionChoices.Direct, label: 'Mentioned' },
        { value: LocationSourceMentionChoices.Implied, label: 'Implied' },
    ];

    form = new FormGroup({
        designators: new FormControl<string[]>([], { nonNullable: true }),
        gender: new FormGroup({
            gender: new FormControl<string>(GenderChoices.Unknown),
            sourceMention: new FormControl<string>(GenderSourceMentionChoices.Direct),
            note: new FormControl<string>(''),
        }),
        location: new FormGroup({
            hasLocation: new FormControl<boolean>(false, { nonNullable: true }),
            location: new FormControl<string | null>(null),
            sourceMention: new FormControl<string>(LocationSourceMentionChoices.Direct),
            note: new FormControl<string>(''),
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
        private formService: AgentFormService,
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
            designators: data.agentDescription?.designators || [],
            gender: {
                gender: data.agentDescription?.gender?.gender || GenderChoices.Unknown,
                sourceMention: data.agentDescription?.gender?.sourceMention || GenderSourceMentionChoices.Direct,
                note: data.agentDescription?.gender?.note || '',
            },
            location: {
                hasLocation: data.agentDescription?.location !== null,
                location: data.agentDescription?.location?.location.id || null,
                sourceMention: data.agentDescription?.location?.sourceMention || LocationSourceMentionChoices.Direct,
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
            designators: data.designators,
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
