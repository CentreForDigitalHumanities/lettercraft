import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataEntryAgentIdentificationGQL, DataEntryAgentIdentificationQuery } from 'generated/graphql';
import { map, Subject, switchMap } from 'rxjs';

@Component({
    selector: 'lc-agent-identification-form',
    templateUrl: './agent-identification-form.component.html',
    styleUrls: ['./agent-identification-form.component.scss']
})
export class AgentIdentificationFormComponent implements OnChanges, OnDestroy {
    @Input() id?: string;

    form = new FormGroup({
        name: new FormControl<string>(''),
        description: new FormControl<string>(''),
        isGroup: new FormControl<boolean>(false),
    });

    private id$ = new Subject<string>();

    constructor(private agentQuery: DataEntryAgentIdentificationGQL) {
        this.id$.pipe(
            switchMap(id => this.agentQuery.watch({ id }).valueChanges),
            map(result => result.data),
        ).subscribe(this.updateFormData.bind(this));
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
}
