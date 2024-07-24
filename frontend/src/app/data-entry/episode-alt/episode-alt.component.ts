import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { agents, episodes } from '../source-alt/source-data';
import * as _ from 'underscore';
import { icons } from '@shared/icons';

@Component({
  selector: 'lc-episode-alt',
  templateUrl: './episode-alt.component.html',
  styleUrls: ['./episode-alt.component.scss']
})
export class EpisodeAltComponent {
    icons = icons;

    labels = [
        'writing',
        'reading',
        'secret communication',
        'penance',
    ]

    episode: any;

    otherAgents: any[];

    constructor(private activatedRoute: ActivatedRoute) {
        const id = activatedRoute.snapshot.params['episodeID'];
        this.episode = episodes.find(e => e.order == id);
        this.otherAgents = _.difference(agents, this.episode.agents);
    }
}
