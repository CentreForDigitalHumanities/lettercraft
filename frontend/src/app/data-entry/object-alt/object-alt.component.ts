import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { objects } from '../source-alt/source-data';
import { icons } from '@shared/icons';

@Component({
  selector: 'lc-object-alt',
  templateUrl: './object-alt.component.html',
  styleUrls: ['./object-alt.component.scss']
})
export class ObjectAltComponent {
    object: any;

    icons = icons;

    giftLabels = ['golden cup', 'silver cup', 'hairshirt', 'livestock', 'book'];
    letterLabels = ['papal bull', 'royal decree', 'imaginary', 'love letter'];

    constructor(private activatedRoute: ActivatedRoute) {
        const id = activatedRoute.snapshot.params['objectID'];
        this.object = objects.find(o => o.id == id);
    }
}
