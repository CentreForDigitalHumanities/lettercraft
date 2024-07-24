import { Component } from '@angular/core';
import { icons } from '@shared/icons';

@Component({
  selector: 'lc-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
    icons = icons;

    labels = [
        'writing',
        'reading',
        'secret communication',
        'penance',
    ];
}
