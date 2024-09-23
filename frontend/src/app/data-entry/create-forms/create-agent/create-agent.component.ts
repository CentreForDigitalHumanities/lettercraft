import { AfterViewInit, Component, DestroyRef, Input, TemplateRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@services/toast.service';
import { CreateAgentInput, DataEntryCreateAgentGQL, DataEntryCreateAgentMutation } from 'generated/graphql';
import { filter, map, Observable, shareReplay, } from 'rxjs';
import _ from 'underscore';
import { listNames, nameExamples } from '../../shared/utils';
import { MutationResult } from 'apollo-angular';
import { isLoading } from '@shared/request-utils';

interface MutationOutcome<T> {
    loading$: Observable<boolean>;
    succes$: Observable<T>;
    errors$: Observable<string[]>,
}

class AgentCreator {
    constructor(
        private createMutation: DataEntryCreateAgentGQL,
        private destroyRef: DestroyRef
    ) { }

    submit(input: CreateAgentInput): MutationOutcome<DataEntryCreateAgentMutation> {
        const result$ = this.createMutation.mutate(
            { input },
            {
                errorPolicy: 'all',
                update: (cache) => this.updateCache(input.source, input.episodes, cache),
            }
        ).pipe(
            shareReplay(1),
            takeUntilDestroyed(this.destroyRef),
        );
        return this.getOutcome(result$);
    }

    private getOutcome(result$: Observable<MutationResult<DataEntryCreateAgentMutation>>): MutationOutcome<DataEntryCreateAgentMutation> {
        const loading$ = isLoading(result$);
        const succes$: Observable<DataEntryCreateAgentMutation> = result$.pipe(
            filter(result => _.isUndefined(this.resultErrors(result))),
            map(result => result.data?.createAgent as DataEntryCreateAgentMutation),
        );

        const errors$: Observable<string[]> = result$.pipe(
            map(this.resultErrors),
            filter(_.negate(_.isUndefined)),
        );

        return { loading$, succes$, errors$ };
    }

    private updateCache(source: string, episodes: string[] | null | undefined, cache: any) {
        cache.evict({
            id: cache.identify({ __typename: "SourceType", id: source }),
            fieldName: 'agents',
        });
        if (episodes) {
            for (const episode of episodes) {
                cache.evict({
                    id: cache.identify({ __typename: "EpisodeType", id: episode }),
                    fieldName: 'agents',
                })
            }
        }
        cache.gc();
    }

    private resultErrors(result: MutationResult<DataEntryCreateAgentMutation>): string[] | undefined {
        if (result.errors?.length) {
            return result.errors.map(error => error.message);
        }
        if (result.data?.createAgent?.errors.length) {
            return result.data.createAgent.errors.flatMap(error => error.messages);
        }
        if (!result.data?.createAgent) {
            return ['Unknown error'];
        }
        return undefined;
    }

}

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

    private agentCreateService: AgentCreator;

    constructor(
        private modalService: NgbModal,
        createMutation: DataEntryCreateAgentGQL,
        private toastService: ToastService,
        destroyRef: DestroyRef,
    ) {
        this.agentCreateService = new AgentCreator(createMutation, destroyRef);
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
        const outcome = this.agentCreateService.submit(input);

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
