import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { agents, episodes, locations } from '../source-alt/source-data';
import * as _ from 'underscore';
import { agentIcon, icons } from '@shared/icons';

@Component({
  selector: 'lc-agent-alt',
  templateUrl: './agent-alt.component.html',
  styleUrls: ['./agent-alt.component.scss']
})
export class AgentAltComponent {
    agent: any;
    episodes: any[];
    otherEpisodes: any[];
    locations: any[];

    icons = icons;
    agentIcon = agentIcon

    constructor(private activatedRoute: ActivatedRoute) {
        const id = activatedRoute.snapshot.params['agentID'];
        this.agent = agents.find(a => a.id === parseInt(id));
        this.episodes = episodes.filter(episode =>
            _.any(episode.agents, agent => _.isEqual(agent, this.agent))
        );
        this.otherEpisodes = _.difference(episodes, this.episodes);
        this.locations = locations;
    }
}
