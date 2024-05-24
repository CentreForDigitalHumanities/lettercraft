import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { agents } from '../source-alt/source-data';

@Component({
  selector: 'lc-agent-alt',
  templateUrl: './agent-alt.component.html',
  styleUrls: ['./agent-alt.component.scss']
})
export class AgentAltComponent {
    agent: any;

    constructor(private activatedRoute: ActivatedRoute) {
        const id = activatedRoute.snapshot.params['agentID'];
        this.agent = agents.find(a => a.id === parseInt(id));
    }
}
