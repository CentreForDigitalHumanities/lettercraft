import { AfterViewInit, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@services/toast.service';
import { CreateAgentInput } from 'generated/graphql';
import { Observable } from 'rxjs';
import { listNames, nameExamples } from '../../shared/utils';
import { CreateAgentService } from './create-agent.service';


@Component({
  selector: 'lc-create-agent',
  templateUrl: './create-agent.component.html',
    styleUrls: ['./create-agent.component.scss'],
    providers: [CreateAgentService],
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

    loading = false;
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
        this.loading = true;
        const input: CreateAgentInput = {
            name: this.form.value.name || '',
            source: this.sourceID,
            episodes: this.episodeID ? [this.episodeID] : null
        };
        const outcome = this.createAgentService.submit(input);

        outcome.succes$.subscribe(this.onMutationSuccess.bind(this));
        outcome.errors$.subscribe(this.onMutationError.bind(this));
    }

    private onMutationSuccess() {
        this.loading = false;
        this.modal?.close();
        this.form.reset();
    }

    private onMutationError(messages: string[]) {
        console.error(messages);
        this.loading = false;
        this.toastService.show({
            type: 'danger',
            header: 'Creating agent failed',
            body: messages.join('\n'),
        })
    }
}
