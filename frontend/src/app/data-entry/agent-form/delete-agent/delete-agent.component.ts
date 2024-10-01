import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@services/toast.service';
import { actionIcons } from '@shared/icons';
import { DataEntryDeleteAgentGQL, LettercraftErrorType } from 'generated/graphql';
import { FormService } from '../../shared/form.service';
import { BehaviorSubject } from 'rxjs';
import { FormStatus } from '../../shared/types';
import { ModalService } from '@services/modal.service';

@Component({
    selector: 'lc-delete-agent',
    templateUrl: './delete-agent.component.html',
    styleUrls: ['./delete-agent.component.scss']
})
export class DeleteAgentComponent implements OnDestroy {
    @Input() navigateOnDelete?: any[];

    actionIcons = actionIcons;

    id$ = this.formService.id$;
    status$ = new BehaviorSubject<FormStatus>('idle');
    private formName = 'delete';

    constructor(
        private deleteMutation: DataEntryDeleteAgentGQL,
        private toastService: ToastService,
        private router: Router,
        private formService: FormService,
        private modalService: ModalService,
    ) {
        this.formService.attachForm(this.formName, this.status$);
    }

    ngOnDestroy(): void {
        this.formService.detachForm(this.formName);
    }

    openConfirm(id: string) {
        this.modalService.openConfirmationModal({
            title: 'Delete agent?',
            message: `Delete this agent from this source text? They will be removed from all
            episodes they are involved in!`
        }).then(() => this.deleteAgent(id));
    }

    deleteAgent(id: string) {
        this.status$.next('loading');
        this.deleteMutation.mutate({ id }, {
            update: (cache) => cache.evict({ fieldName: "source" }),
        }).subscribe({
            next: (result) => {
                if (result.data?.deleteAgent?.ok) {
                    this.onSuccess();
                } else {
                    this.onFail(result.data?.deleteAgent?.errors);
                }
            },
            error: (error) => {
                this.onFail(error);
            }
        });
    }

    onSuccess() {
        this.status$.next('saved');
        this.toastService.show({
            type: 'success',
            header: 'Agent deleted',
            body: 'Agent successfully deleted'
        })
        if (this.navigateOnDelete) {
            this.router.navigate(this.navigateOnDelete);
        }
    }

    onFail(errors?: LettercraftErrorType[] | any) {
        this.status$.next('error');
        console.error(errors);
        const messages = errors?.map?.call(
            (error: any) => error.messages?.join('\n')
        ) || 'Unexpected error';
        this.toastService.show({
            type: 'danger',
            header: 'Deletion failed',
            body: `Deleting agent failed: \n${messages}`
        });
    }
}
