import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { icons } from '@shared/icons';

@Component({
  selector: 'lc-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent {
    agent: number;

    icons = icons;

    constructor(route: ActivatedRoute) {
        this.agent = parseInt(route.snapshot.params['agentID']);
    }

}
