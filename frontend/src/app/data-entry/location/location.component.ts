import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faBookmark, faCaretDown, faCaretUp, faLocationDot, faPencil, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { episodes, locations } from '../source-alt/source-data';
import _ from 'underscore';

@Component({
  selector: 'lc-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent {
    episodes: any[];
    otherEpisodes: any[];
    location: any;

    icons = {
        remove: faTimes,
        collapse: faCaretUp,
        expand: faCaretDown,
        edit: faPencil,
        add: faPlus,
        episode: faBookmark,
        location: faLocationDot,
    };

    constructor(private activatedRoute: ActivatedRoute) {
        const id = activatedRoute.snapshot.params['locationID'];
        this.location = locations.find(a => a.id === parseInt(id));
        this.episodes = episodes.filter(episode =>
            _.any(episode.locations, location => _.isEqual(location, this.location))
        );
        this.otherEpisodes = _.difference(episodes, this.episodes);
    }
}
