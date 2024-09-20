import { AfterViewInit, Component, DestroyRef, Input, TemplateRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@services/toast.service';
import { CreateAgentInput, DataEntryCreateAgentGQL } from 'generated/graphql';
import { Observable } from 'rxjs';
import _ from 'underscore';
import { listNames, nameExamples } from '../../shared/utils';

@Component({
  selector: 'lc-create-agent',
  templateUrl: './create-agent.component.html',
  styleUrls: ['./create-agent.component.scss']
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
        private createMutation: DataEntryCreateAgentGQL,
        private toastService: ToastService,
        private destroyRef: DestroyRef,
    ) { }

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
        this.createMutation.mutate(
            { input },
            {
                errorPolicy: 'all',
                update: (cache) => this.updateCache(this.sourceID, this.episodeID, cache),
            }
        )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                const errors = result.errors || result.data?.createAgent?.errors;
                if (errors && errors.length > 0) {
                    this.onMutationError(errors);
                }
                this.onMutationSuccess();
            });
    }

    private updateCache(sourceID: string, episodeID: string | undefined, cache: any) {
        cache.evict({
            id: cache.identify({ __typename: "SourceType", id: sourceID }),
            fieldName: 'agents',
        });
        if (episodeID) {
            cache.evict({
                id: cache.identify({ __typename: "EpisodeType", id: episodeID }),
                fieldName: 'agents',
            });
        }
        cache.gc();
    }

    private onMutationSuccess() {
        this.loading = false;
        this.modal?.close();
        this.form.reset();
    }

    private onMutationError(errors: any[] | readonly any[] | undefined) {
        console.error(errors);
        const messages = errors?.map(error =>
            _.get(error, 'message', undefined) || _.get(error, 'messages', []).join('\n')
        ) || ['Unknown error'];
        this.loading = false;
        this.toastService.show({
            type: 'danger',
            header: 'Creating agent failed',
            body: messages.join('\n'),
        })
    }
}
