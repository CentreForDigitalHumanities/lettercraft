import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { agents, episodes, locations, objects } from '../source-alt/source-data';
import * as _ from 'underscore';
import { agentIcon, icons } from '@shared/icons';

@Component({
  selector: 'lc-episode-alt',
  templateUrl: './episode-alt.component.html',
  styleUrls: ['./episode-alt.component.scss']
})
export class EpisodeAltComponent {
    icons = icons;
    agentIcon = agentIcon;

    labels = [
        'writing',
        'reading',
        'secret communication',
        'penance',
    ]

    episode: any;

    otherAgents: any[];
    otherLocations: any[];
    otherObjects: any[];

    constructor(private activatedRoute: ActivatedRoute) {
        const id = activatedRoute.snapshot.params['episodeID'];
        this.episode = episodes.find(e => e.order == id);
        this.otherAgents = _.difference(agents, this.episode.agents);
        this.otherLocations = _.difference(locations, this.episode.locations);
        this.otherObjects = _.difference(objects, this.episode.objects);
    }
}
