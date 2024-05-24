import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { episodes } from '../source-alt/source-data';
import { faPencil, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lc-episode-alt',
  templateUrl: './episode-alt.component.html',
  styleUrls: ['./episode-alt.component.scss']
})
export class EpisodeAltComponent {
    icons = {
        remove: faTimes,
        edit: faPencil,
    };

    labels = [
        'writing',
        'reading',
        'secret communication',
        'penance',
    ]

    episode: any;

    constructor(private activatedRoute: ActivatedRoute) {
        const id = activatedRoute.snapshot.params['episodeID'];
        this.episode = episodes.find(e => e.order == id);
    }
}
