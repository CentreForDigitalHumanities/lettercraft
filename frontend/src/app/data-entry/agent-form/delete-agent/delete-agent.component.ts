import { Component, Input, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { actionIcons } from '@shared/icons';
import _ from 'underscore';

@Component({
    selector: 'lc-delete-agent',
    templateUrl: './delete-agent.component.html',
    styleUrls: ['./delete-agent.component.scss']
})
export class DeleteAgentComponent {
    @Input({ required: true }) id!: string;

    actionIcons = actionIcons;

    constructor(private modalService: NgbModal) { }

    open(content: TemplateRef<any>) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-title' }).result.then(
            this.deleteAgent.bind(this),
            _.constant(undefined),
        );
    }

    deleteAgent(id: string) {
        console.log(id);
    }

}
