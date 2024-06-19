import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { objects } from '../source-alt/source-data';
import { faEnvelope, faGift, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'lc-object-alt',
  templateUrl: './object-alt.component.html',
  styleUrls: ['./object-alt.component.scss']
})
export class ObjectAltComponent {
    object: any;

    icons = {
        gift: faGift,
        letter: faEnvelope,
        remove: faTimes,
    }

    constructor(private activatedRoute: ActivatedRoute) {
        const id = activatedRoute.snapshot.params['objectID'];
        this.object = objects.find(o => o.id == id);
    }
}
