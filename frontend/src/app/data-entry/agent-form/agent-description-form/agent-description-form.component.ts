import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
    DataEntryAgentDescriptionGQL,
    DataEntryAgentDescriptionQuery,
    PersonAgentDescriptionGenderGenderChoices as GenderChoices,
    PersonAgentDescriptionGenderSourceMentionChoices as GenderSourceMentionChoices
} from 'generated/graphql';
import { Observable, map, Subject, switchMap } from 'rxjs';


@Component({
    selector: 'lc-agent-description-form',
    templateUrl: './agent-description-form.component.html',
    styleUrls: ['./agent-description-form.component.scss']
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

    form = new FormGroup({
        designators: new FormControl<string[]>([]),
        gender: new FormGroup({
            gender: new FormControl<string>(GenderChoices.Unknown),
            sourceMention: new FormControl<string>(GenderSourceMentionChoices.Direct),
            note: new FormControl<string>(''),
        }),
    })

    isGroup$: Observable<boolean>;

    private id$ = new Subject<string>();
    private data$: Observable<DataEntryAgentDescriptionQuery>;

    constructor(private agentQuery: DataEntryAgentDescriptionGQL) {
        this.data$ = this.id$.pipe(
            switchMap(id => this.agentQuery.watch({ id }).valueChanges),
            map(result => result.data),
        );
        this.isGroup$ = this.data$.pipe(
            map(result => result.agentDescription?.isGroup || false),
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
            }
        });
    }

}
