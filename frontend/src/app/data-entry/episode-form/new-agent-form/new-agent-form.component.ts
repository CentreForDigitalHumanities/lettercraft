import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '@services/toast.service';
import { MutationResult } from 'apollo-angular';
import { CreateAgentInput, DataEntryCreateAgentGQL, DataEntryCreateAgentMutation } from 'generated/graphql';

@Component({
    selector: 'lc-new-agent-form',
    templateUrl: './new-agent-form.component.html',
    styleUrls: ['./new-agent-form.component.scss']
})
export class NewAgentFormComponent {
    @Input({ required: true }) sourceID!: string;
    @Input() episodeID?: string;
    @Output() mutationStarted = new EventEmitter<void>();
    @Output() agentCreated = new EventEmitter<null>();

    constructor(
        private mutation: DataEntryCreateAgentGQL,
        private toastService: ToastService,
    ) { }

    form = new FormGroup({
        name: new FormControl<string>('', {
            nonNullable: true,
            validators: Validators.required
        }),
    });

    submit(): void {
        if (!this.checkValidity()) {
            return;
        }
        this.mutationStarted.emit();
        const input = this.mutationInput();
        this.mutation.mutate({ input }, {
            update: this.updateCache.bind(this),
        }).subscribe({
            next: this.onMutationSucces.bind(this),
            error: this.onMutationError.bind(this),
        });
    }

    private checkValidity(): boolean {
        this.form.updateValueAndValidity();
        this.form.controls.name.markAsTouched();
        return this.form.valid;
    }

    private mutationInput(): CreateAgentInput {
        return {
            name: this.form.value.name || '',
            source: this.sourceID,
            episodes: this.episodeID ? [this.episodeID] : null,
        };
    }

    private updateCache(cache: any) {
        if (this.episodeID) {
            const identified = cache.identify({
                __typename: "EpisodeType",
                id: this.episodeID,
            });
            cache.evict({ id: identified });
        }
        cache.gc();
    }

    private onMutationSucces(data: MutationResult<DataEntryCreateAgentMutation>) {
        this.agentCreated.emit();
        if (data.errors?.length || data.data?.createAgent?.errors.length) {
            this.onMutationError(data);
        } else {
            this.toastService.show({
                header: 'Agent created',
                type: 'success',
                body: 'Agent created successfully',
            });
        }
    }

    private onMutationError(err: any) {
        console.error(err);
        this.toastService.show({
            header: 'Creation failed',
            type: 'danger',
            body: 'Could not create new agent',
        });
    }
}
