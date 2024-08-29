import { Component, Input } from '@angular/core';
import { actionIcons } from '@shared/icons';

@Component({
    selector: 'lc-delete-agent',
    templateUrl: './delete-agent.component.html',
    styleUrls: ['./delete-agent.component.scss']
})
export class DeleteAgentComponent {
    @Input({ required: true }) id!: string;

    actionIcons = actionIcons;

}
