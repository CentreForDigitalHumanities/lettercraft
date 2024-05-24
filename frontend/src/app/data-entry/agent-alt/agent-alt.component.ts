import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { agents, episodes } from '../source-alt/source-data';
import { faCaretDown, faCaretUp, faPencil, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'underscore';

@Component({
  selector: 'lc-agent-alt',
  templateUrl: './agent-alt.component.html',
  styleUrls: ['./agent-alt.component.scss']
})
export class AgentAltComponent {
    agent: any;
    episodes: any[];
    otherEpisodes: any[];

    icons = {
        remove: faTimes,
        collapse: faCaretUp,
        expand: faCaretDown,
        edit: faPencil,
        add: faPlus,
    };

    constructor(private activatedRoute: ActivatedRoute) {
        const id = activatedRoute.snapshot.params['agentID'];
        this.agent = agents.find(a => a.id === parseInt(id));
        this.episodes = episodes.filter(episode =>
            _.any(episode.agents, agent => _.isEqual(agent, this.agent))
        );
        this.otherEpisodes = _.difference(episodes, this.episodes);
    }
}
