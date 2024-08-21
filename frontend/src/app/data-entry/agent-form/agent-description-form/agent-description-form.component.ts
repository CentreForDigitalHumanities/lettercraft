import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import {
    DataEntryAgentDescriptionGQL,
    DataEntryAgentDescriptionQuery,
    PersonAgentDescriptionGenderGenderChoices as GenderChoices,
    PersonAgentDescriptionGenderSourceMentionChoices as GenderSourceMentionChoices,
    LocationsInSourceListGQL,
    LocationsInSourceListQuery,
    PersonAgentDescriptionSourceMentionChoices as LocationSourceMentionChoices,
} from 'generated/graphql';
import { Observable, map, Subject, switchMap, shareReplay, filter } from 'rxjs';
import _ from 'underscore';


@Component({
    selector: 'lc-agent-description-form',
    templateUrl: './agent-description-form.component.html',
    styleUrls: ['./agent-description-form.component.scss'],
})
export class AgentDescriptionFormComponent implements OnChanges, OnDestroy {
    @Input() id?: string;

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

    private id$ = new Subject<string>();
    private data$: Observable<DataEntryAgentDescriptionQuery>;

    constructor(
        private agentQuery: DataEntryAgentDescriptionGQL,
        private locationsQuery: LocationsInSourceListGQL,
    ) {
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
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['id'] && this.id) {
            this.id$.next(this.id);
        }
    }

    ngOnDestroy(): void {
        this.id$.complete();
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

}
