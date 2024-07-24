import { Component, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { episodes, locations } from '../source-alt/source-data';
import _ from 'underscore';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { icons } from '@shared/icons';

@Component({
  selector: 'lc-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent {
    episodes: any[];
    otherEpisodes: any[];
    location: any;

    icons = icons;

    constructor(
        private activatedRoute: ActivatedRoute,
        private offcanvasService: NgbOffcanvas
    ) {
        const id = activatedRoute.snapshot.params['locationID'];
        this.location = locations.find(a => a.id === parseInt(id));
        this.episodes = episodes.filter(episode =>
            _.any(episode.locations, location => _.isEqual(location, this.location))
        );
        this.otherEpisodes = _.difference(episodes, this.episodes);
    }

    open(content: TemplateRef<any>) {
        this.offcanvasService.open(content, { position: 'end' });
    }
}
