import { AfterViewInit, Component, DestroyRef, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@services/toast.service';
import { CreateEntityDescriptionInput, Entity } from 'generated/graphql';
import { Observable } from 'rxjs';
import { listWithQuotes, nameExamples } from '../../shared/utils';
import { CreateEntityService } from './create-entity.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


/**
 * Opens modal(s) to create new AgentDescriptions, GiftDescriptions, LetterDescriptions,
 * or SpaceDescriptions.
 *
 * The parent component shoud implement a trigger to create objects (e.g. a button); use
 * the `[create]` input to signal when to open a modal.
 */
@Component({
    selector: 'lc-create-entity',
    templateUrl: './create-entity.component.html',
    styleUrls: ['./create-entity.component.scss'],
})
export class CreateEntityComponent implements AfterViewInit {
    @Input({ required: true }) create!: Observable<void>;
    @Input({ required: true }) sourceID!: string;
    @Input() episodeID?: string;
    @Input({ required: true }) entityType!: Entity;

    @ViewChild('createEntityModal') modalTemplate?: TemplateRef<unknown>;

    modal: NgbModalRef | null = null;
    form = new FormGroup({
        name: new FormControl<string>('', {
            nonNullable: true,
            validators: Validators.required,
        }),
    });

    loading$?: Observable<boolean>;

    submitted = false;


    constructor(
        private modalService: NgbModal,
        private toastService: ToastService,
        private createEntityService: CreateEntityService,
        private destroyRef: DestroyRef,
    ) { }

    get entityName(): string {
        const names = {
            [Entity.Agent]: 'agent',
            [Entity.Gift]: 'gift',
            [Entity.Letter]: 'letter',
            [Entity.Space]: 'location',
        }
        return names[this.entityType];
    }

    get nameExamples(): string {
        return listWithQuotes(nameExamples[this.entityName]);
    }

    ngAfterViewInit(): void {
        this.create.pipe(
            takeUntilDestroyed(this.destroyRef),
        ).subscribe(() => {
            this.submitted = false;
            this.modal = this.modalService.open(this.modalTemplate);
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
        const input: CreateEntityDescriptionInput = {
            name: this.form.value.name || '',
            source: this.sourceID,
            episodes: this.episodeID ? [this.episodeID] : null
        };
        const outcome = this.createEntityService.submit(this.entityType, input);

        this.loading$ = outcome.loading$;
        outcome.success$.subscribe(() => this.onMutationSuccess(input.name, this.entityName));
        outcome.errors$.subscribe(messages => this.onMutationError(messages, input.name, this.entityName));
    }

    private onMutationSuccess(entityName: string, entityTypeName: string) {
        this.modal?.close();
        this.form.reset();
        this.submitted = false;
        this.toastService.show({
            type: 'success',
            header: `Created ${entityTypeName}`,
            body: `Created ${entityTypeName} "${entityName}"`
        })
    }

    private onMutationError(messages: string[], entityName: string, entityTypeName: string) {
        const body = `Could not create ${entityTypeName} "${entityName}".
        ${messages.join('\n')}`;
        this.toastService.show({
            type: 'danger',
            header: `Creating ${entityTypeName} failed`,
            body,
        })
    }
}
