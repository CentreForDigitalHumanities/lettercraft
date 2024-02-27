import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCancel, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lc-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent {
    agent: number;

    icons = {
        confirm: faCheck,
        cancel: faCancel,
        remove: faTimes,
    }

    constructor(route: ActivatedRoute) {
        this.agent = parseInt(route.snapshot.params['agentID']);
    }

}
