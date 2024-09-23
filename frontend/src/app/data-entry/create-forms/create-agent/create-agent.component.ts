import { AfterViewInit, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@services/toast.service';
import { CreateAgentInput } from 'generated/graphql';
import { Observable } from 'rxjs';
import { listNames, nameExamples } from '../../shared/utils';
import { CreateAgentService } from './create-agent.service';

/**
 * Opens modal(s) to create new AgentDescriptions.
 *
 * The parent component shoud implement a trigger to create agents (e.g. a button); use
 * the `[create]` input to signal when to open a modal.
 */
@Component({
  selector: 'lc-create-agent',
  templateUrl: './create-agent.component.html',
    styleUrls: ['./create-agent.component.scss'],
})
export class CreateAgentComponent implements AfterViewInit {
    @Input({ required: true }) create!: Observable<void>;
    @Input({ required: true }) sourceID!: string;
    @Input() episodeID?: string;

    @ViewChild('createAgentModal') modalTempate?: TemplateRef<unknown>;

    modal: NgbModalRef | null = null;
    form = new FormGroup({
        name: new FormControl<string>('', {
            nonNullable: true,
            validators: Validators.required,
        }),
    });

    loading$?: Observable<boolean>;

    submitted = false;

    nameExamples = listNames(nameExamples['agent']);

    constructor(
        private modalService: NgbModal,
        private toastService: ToastService,
        private createAgentService: CreateAgentService,
    ) {

    }

    ngAfterViewInit(): void {
        this.create.subscribe(() => {
            this.submitted = false;
            this.modal = this.modalService.open(this.modalTempate);
        });
    }

    closeModal() {
        this.modal?.close();
    }

    submit() {
        this.submitted = true;
        this.form.updateValueAndValidity();
        this.form.controls.name.markAsTouched();
        if (this.form.invalid) {
            return;
        }
        const input: CreateAgentInput = {
            name: this.form.value.name || '',
            source: this.sourceID,
            episodes: this.episodeID ? [this.episodeID] : null
        };
        const outcome = this.createAgentService.submit(input);

        this.loading$ = outcome.loading$;
        outcome.succes$.subscribe(() => this.onMutationSuccess(input.name));
        outcome.errors$.subscribe(messages => this.onMutationError(messages, input.name));
    }

    private onMutationSuccess(agentName: string) {
        this.modal?.close();
        this.form.reset();
        this.submitted = false;
        this.toastService.show({
            type: 'success',
            header: 'Agent created',
            body: `Created agent "${agentName}"`
        })
    }

    private onMutationError(messages: string[], agentName: string) {
        const body = `Could not create agent "${agentName}".
        ${messages.join('\n')}`;
        this.toastService.show({
            type: 'danger',
            header: 'Creating agent failed',
            body,
        })
    }
}
