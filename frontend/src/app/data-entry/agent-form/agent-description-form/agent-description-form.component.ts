import { Component, Input } from '@angular/core';

@Component({
    selector: 'lc-agent-description-form',
    templateUrl: './agent-description-form.component.html',
    styleUrls: ['./agent-description-form.component.scss']
})
export class AgentDescriptionFormComponent {
    @Input() id?: string;

}
